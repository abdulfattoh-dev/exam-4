import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Customer } from './models/customer.model';
import { comparePassword, hashPassword } from 'src/utils/bcrypt';
import { catchError } from 'src/utils/catch-error';
import { UserRoles } from 'src/enum';
import { SignInCustomerDto } from './dto/sign-in-customer.dto';
import { TokenService } from 'src/utils/generate-token';
import { writeToCookie } from 'src/utils/write-cookie';
import { Response } from 'express';
import { generateOTP } from 'src/utils/generate-otp';
import { MailService } from 'src/mail/mail.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ConfirmSignInCustomerDto } from './dto/confirm-sign-in-customer.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel(Customer) private model: typeof Customer,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly tokenService: TokenService,
    private readonly mailService: MailService
  ) { }

  async create(createCustomerDto: CreateCustomerDto): Promise<object> {
    try {
      const { email, phone_number, password, } = createCustomerDto;
      const existingEmail = await this.model.findOne({ where: { email } });

      if (existingEmail) {
        throw new ConflictException(`Email: ${email} already exists`);
      }

      const existingPhoneNumber = await this.model.findOne({ where: { phone_number } });

      if (existingPhoneNumber) {
        throw new ConflictException(`Phone number: ${phone_number} already exists`);
      }

      const hashedPassword = await hashPassword(password);
      const customer = await this.model.create({
        ...createCustomerDto,
        hashed_password: hashedPassword,
        attributes: { exclude: ["hashed_password"] }
      });

      return {
        statusCode: 201,
        message: "success",
        data: customer
      }
    } catch (error) {
      return catchError(error);
    }
  }

  async signIn(signInCustomerDto: SignInCustomerDto): Promise<object> {
    try {
      const { email, password } = signInCustomerDto;
      const customer = await this.model.findOne({ where: { email } });

      if (!customer) {
        throw new BadRequestException("Invalid email or password");
      }

      const isMatchPassword = await comparePassword(password, customer.dataValues?.hashed_password);

      if (!isMatchPassword) {
        throw new BadRequestException("Invalid email or password");
      }

      const otp = generateOTP();

      await this.mailService.sentOtp(email, otp);
      await this.cacheManager.set(email, otp);

      return {
        statusCode: 200,
        message: "success",
        data: email
      }
    } catch (error) {
      return catchError(error);
    }
  }

  async confirmSignIn(confirmSignInCustomerDto: ConfirmSignInCustomerDto, res: Response): Promise<object> {
    try {
      const { email, otp } = confirmSignInCustomerDto;
      const hasCustomer = await this.cacheManager.get(email);

      if (!hasCustomer || hasCustomer != otp) {
        throw new BadRequestException("OTP expired");
      }

      const customer = await this.model.findOne({ where: { email } });
      const { id, role, status } = customer?.dataValues;
      const payload = { id, role, status }
      const accessToken = await this.tokenService.generateAccessToken(payload);
      const refreshToken = await this.tokenService.generateRefreshToken(payload);

      writeToCookie(res, "refreshTokenCustomer", refreshToken);

      return {
        statusCode: 200,
        message: "success",
        data: accessToken
      }
    } catch (error) {
      return catchError(error);
    }
  }

  async findAll(): Promise<object> {
    try {
      return this.model.findAll({ where: { role: UserRoles.CUSTOMER }, attributes: { exclude: ["hashed_password"] } });
    } catch (error) {
      return catchError(error);
    }
  }

  async findOne(id: number): Promise<object> {
    try {
      const customer = await this.model.findByPk(id, { attributes: { exclude: ["hashed_password"] } });

      if (!customer) {
        throw new NotFoundException(`Customer not found by id: ${id}`);
      }

      return {
        statusCode: 200,
        message: "success",
        data: customer
      }
    } catch (error) {
      return catchError(error);
    }
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto): Promise<object> {
    try {
      const customer = await this.model.findByPk(id);

      if (!customer) {
        throw new NotFoundException(`Customer not found by id: ${id}`);
      }

      const { password } = updateCustomerDto;

      if (password) {
        updateCustomerDto.password = await hashPassword(password);
      }

      await this.model.update({
        ...updateCustomerDto,
        hashed_password: updateCustomerDto.password
      }, { where: { id } });

      const updatedCustomer = await this.model.findByPk(id, { attributes: { exclude: ["hashed_password"] } });

      return {
        statusCode: 200,
        message: "success",
        data: updatedCustomer
      }
    } catch (error) {
      return catchError(error);
    }
  }

  async remove(id: number): Promise<object> {
    try {
      const customer = await this.model.findByPk(id);

      if (!customer) {
        throw new NotFoundException(`Customer not found by id: ${id}`);
      }

      await this.model.destroy({ where: { id } });

      return {
        statusCode: 200,
        message: "success",
        data: {}
      }
    } catch (error) {
      return catchError(error);
    }
  }
}
