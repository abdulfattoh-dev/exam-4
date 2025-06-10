import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Admin } from './models/admin.model';
import { comparePassword, hashPassword } from 'src/utils/bcrypt';
import { AdminRoles } from 'src/enum';
import config from 'src/config';
import { catchError } from 'src/utils/catch-error';
import { SignInAdminDto } from './dto/sign-in-admin.dto';
import { TokenService } from 'src/utils/generate-token';
import { writeToCookie } from 'src/utils/write-cookie';
import { Response } from 'express';
import { generateOTP } from 'src/utils/generate-otp';
import { MailService } from 'src/mail/mail.service';
import { ConfirmSignInAdminDto } from './dto/confirm-sign-in-admin.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { successRes } from 'src/helpers/success-response';
import { StatusAdminDto } from './dto/status.admin.dto';

@Injectable()
export class AdminService implements OnModuleInit {
  constructor(
    @InjectModel(Admin) private model: typeof Admin,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly tokenService: TokenService,
    private readonly mailService: MailService,
  ) {}

  async onModuleInit(): Promise<void> {
    try {
      const existingSuperAdmin = await this.model.findOne({
        where: { role: AdminRoles.SUPERADMIN },
      });

      if (!existingSuperAdmin) {
        const hashedPassword = await hashPassword(config.ADMIN_PASSWORD);
        await this.model.create({
          full_name: config.ADMIN_FULL_NAME,
          email: config.ADMIN_EMAIL,
          phone_number: config.ADMIN_PHONE,
          hashed_password: hashedPassword,
          role: AdminRoles.SUPERADMIN,
        });
      }
    } catch (error) {
      return catchError(error);
    }
  }

  async create(createAdminDto: CreateAdminDto): Promise<object> {
    try {
      const { email, phone_number, password } = createAdminDto;
      const existingEmail = await this.model.findOne({ where: { email } });

      if (existingEmail) {
        throw new ConflictException(`Email: ${email} already exists`);
      }

      const existingPhoneNumber = await this.model.findOne({
        where: { phone_number },
      });

      if (existingPhoneNumber) {
        throw new ConflictException(
          `Phone number: ${phone_number} already exists`,
        );
      }

      const hashedPassword = await hashPassword(password);
      const admin = await this.model.create({
        ...createAdminDto,
        hashed_password: hashedPassword,
        attributes: { exclude: ['hashed_password'] },
      });

      return successRes(admin);
    } catch (error) {
      return catchError(error);
    }
  }

  async signIn(signInAdminDto: SignInAdminDto): Promise<object> {
    try {
      const { email, password } = signInAdminDto;
      const admin = await this.model.findOne({ where: { email } });

      if (!admin) {
        throw new BadRequestException('Invalid email or password');
      }

      const isMatchPassword = await comparePassword(
        password,
        admin.dataValues?.hashed_password,
      );

      if (!isMatchPassword) {
        throw new BadRequestException('Invalid email or password');
      }

      const otp = generateOTP();

      await this.mailService.sentOtp(email, otp);
      await this.cacheManager.set(email, otp);

      return {
        statusCode: 200,
        message: 'success',
        data: email,
      };
    } catch (error) {
      return catchError(error);
    }
  }

  async confirmSignIn(
    confirmSignInAdminDto: ConfirmSignInAdminDto,
    res: Response,
  ): Promise<object> {
    try {
      const { email, otp } = confirmSignInAdminDto;
      const hasAdmin = await this.cacheManager.get(email);

      if (!hasAdmin || hasAdmin != otp) {
        throw new BadRequestException('OTP expired');
      }

      const admin = await this.model.findOne({ where: { email } });
      const { id, role, status } = admin?.dataValues;
      const payload = { id, role, status };
      const accessToken = await this.tokenService.generateAccessToken(payload);
      const refreshToken =
        await this.tokenService.generateRefreshToken(payload);

      writeToCookie(res, 'refreshTokenAdmin', refreshToken);

      return successRes({ token: accessToken });
    } catch (error) {
      return catchError(error);
    }
  }

  async refreshToken(refreshToken: string): Promise<object> {
    try {
      const decodedToken =
        await this.tokenService.verifyRefreshToken(refreshToken);

      if (!decodedToken) {
        throw new UnauthorizedException('Refresh token expired');
      }

      const admin = await this.findById(decodedToken.id);
      const payload = {
        id: admin.id,
        role: admin.role,
        status: admin.status,
      };
      const accessToken = await this.tokenService.generateAccessToken(payload);

      return successRes({ token: accessToken });
    } catch (error) {
      return catchError(error);
    }
  }

  async signOut(refreshToken: string, res: Response): Promise<object> {
    try {
      const decodedToken =
        await this.tokenService.verifyRefreshToken(refreshToken);

      await this.findById(decodedToken?.id);
      res.clearCookie('refreshTokenAdmin');

      return successRes({ message: 'Admin signed out succcesfully' });
    } catch (error) {
      return catchError(error);
    }
  }

  async findAll(): Promise<object> {
    try {
      const admins = await this.model.findAll({
        where: { role: ['admin', 'superadmin'] },
        attributes: { exclude: ['hashed_password'] },
      });

      return successRes(admins);
    } catch (error) {
      return catchError(error);
    }
  }

  async findOne(id: number): Promise<object> {
    try {
      const admin = await this.model.findByPk(id, {
        attributes: { exclude: ['hashed_password'] },
      });

      if (!admin) {
        throw new NotFoundException(`Admin not found by id: ${id}`);
      }

      return successRes(admin);
    } catch (error) {
      return catchError(error);
    }
  }

  async update(id: number, updateAdminDto: UpdateAdminDto): Promise<object> {
    try {
      const admin = await this.model.findByPk(id);

      if (!admin) {
        throw new NotFoundException(`Admin not found by id: ${id}`);
      }

      const { password } = updateAdminDto;

      if (password) {
        updateAdminDto.password = await hashPassword(password);
      }

      await this.model.update(
        {
          ...updateAdminDto,
          hashed_password: updateAdminDto.password,
        },
        { where: { id } },
      );

      const updatedAdmin = await this.model.findByPk(id, {
        attributes: { exclude: ['hashed_password'] },
      });

      return successRes(updatedAdmin);
    } catch (error) {
      return catchError(error);
    }
  }

  async status(id: number, statusDto: StatusAdminDto): Promise<object> {
    try {
      await this.findById(id);
      const updatedAdmin = await this.model.update(
        {
          status: statusDto.status,
        },
        { where: { id }, returning: true },
      );

      return successRes(updatedAdmin[1][0]);
    } catch (error) {
      return catchError(error);
    }
  }

  async remove(id: number): Promise<object> {
    try {
      const admin = await this.model.findByPk(id);

      if (!admin) {
        throw new NotFoundException(`Admin not found by id: ${id}`);
      }

      if (admin.role === 'superadmin') {
        throw new ConflictException('Super admin cannot be deleted');
      }

      await this.model.destroy({ where: { id } });

      return successRes({ message: 'Admin deleted successfully' });
    } catch (error) {
      return catchError(error);
    }
  }

  async findById(id: number) {
    try {
      const admin = await this.model.findByPk(id);

      if (!admin) {
        throw new NotFoundException(`Admin not found by id: ${id}`);
      }

      return admin.dataValues;
    } catch (error) {
      return catchError(error);
    }
  }
}
