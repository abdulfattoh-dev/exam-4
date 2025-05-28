<<<<<<< HEAD
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
=======
import { BadRequestException, ConflictException, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
>>>>>>> 39fea831b376bd16a715aa4b0ab6758ff50a4817
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Admin } from './models/admin.model';
import { comparePassword, hashPassword } from 'src/utils/bcrypt';
import { AdminRoles } from 'src/enum';
import config from 'src/config';
import { catchError } from 'src/utils/catch-error';
import { SignInAdminDto } from './dto/sign-in-admin.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
<<<<<<< HEAD
export class AdminService {
  constructor(@InjectModel(Admin) private model: typeof Admin) {}
=======
export class AdminService implements OnModuleInit {
  constructor(
    @InjectModel(Admin) private model: typeof Admin,
    private readonly jwtService: JwtService
  ) { }
>>>>>>> 39fea831b376bd16a715aa4b0ab6758ff50a4817

  async onModuleInit(): Promise<void> {
    try {
<<<<<<< HEAD
      const existingSuperAdmin = await this.model.findOne({
        where: { role: 'superadmin' },
      });

      if (existingSuperAdmin) {
        throw new ConflictException('Super admin already exists');
      }

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

      const hashed_password = await hashPassword(password);
      const superAdmin = await this.model.create({
        ...createAdminDto,
        hashed_password,
        role: AdminRoles.SUPERADMIN,
        attributes: { exclude: ['hashed_password'] },
      });

      return {
        statusCode: 201,
        message: 'success',
        data: superAdmin,
      };
=======
      const existingSuperAdmin = await this.model.findOne({ where: { role: AdminRoles.SUPERADMIN } });

      if (!existingSuperAdmin) {
        const hashedPassword = await hashPassword(config.ADMIN_PASSWORD);
        await this.model.create({
          full_name: config.ADMIN_FULL_NAME,
          email: config.ADMIN_EMAIL,
          phone_number: config.ADMIN_PHONE,
          hashed_password: hashedPassword,
          role: AdminRoles.SUPERADMIN
        });
      }
>>>>>>> 39fea831b376bd16a715aa4b0ab6758ff50a4817
    } catch (error) {
      return catchError(error);
    }
  }

  async create(createAdminDto: CreateAdminDto) {
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
<<<<<<< HEAD
        hashed_password,
        attributes: { exclude: ['hashed_password'] },
=======
        hashed_password: hashedPassword,
        attributes: { exclude: ["hashed_password"] }
>>>>>>> 39fea831b376bd16a715aa4b0ab6758ff50a4817
      });

      return {
        statusCode: 201,
        message: 'success',
        data: admin,
      };
    } catch (error) {
      return catchError(error);
    }
  }

  async signIn(signInAdminDto: SignInAdminDto) {
    try {
      const { email, password } = signInAdminDto;
      const admin = await this.model.findOne({ where: { email } });

      if (!admin) {
        throw new BadRequestException("Invalid email or password");
      }

      const isMatchPassword = await comparePassword(password, admin.hashed_password);

      if (!isMatchPassword) {
        throw new BadRequestException("Invalid email or password");
      }

      const payload = {
        id: admin.id,
        role: admin.role,
        status: admin.status
      }
    } catch (error) {
      return catchError(error);
    }
  }

  async findAll() {
    try {
      return this.model.findAll({
        where: { role: ['admin', 'superadmin'] },
        attributes: { exclude: ['hashed_password'] },
      });
    } catch (error) {
      return catchError(error);
    }
  }

  async findOne(id: number) {
    try {
      const admin = await this.model.findByPk(id, {
        attributes: { exclude: ['hashed_password'] },
      });

      if (!admin) {
        throw new NotFoundException(`Admin not found by id: ${id}`);
      }

      return {
        statusCode: 200,
        message: 'success',
        data: admin,
      };
    } catch (error) {
      return catchError(error);
    }
  }

  async update(id: number, updateAdminDto: UpdateAdminDto) {
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

      return {
        statusCode: 200,
        message: 'success',
        data: updatedAdmin,
      };
    } catch (error) {
      return catchError(error);
    }
  }

  async remove(id: number) {
    try {
      const admin = await this.model.findByPk(id);

      if (!admin) {
        throw new NotFoundException(`Admin not found by id: ${id}`);
      }

      if (admin.role === 'superadmin') {
        throw new ConflictException('Super admin cannot be deleted');
      }

      await this.model.destroy({ where: { id } });

      return {
        statusCode: 200,
        message: 'success',
        data: {},
      };
    } catch (error) {
      return catchError(error);
    }
  }
}
