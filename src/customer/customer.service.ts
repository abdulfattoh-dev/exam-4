import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
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

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel(Customer) private model: typeof Customer,
    private readonly token: TokenService
  ) { }

  async create(createCustomerDto: CreateCustomerDto) {
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

  async signIn(signInCustomerDto: SignInCustomerDto, res: Response): Promise<object> {
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

      const payload = {
        id: customer.dataValues.id,
        role: customer.dataValues.role,
        status: customer.dataValues.status
      }
      const accessToken = await this.token.generateAccessToken(payload);
      const refreshToken = await this.token.generateRefreshToken(payload);

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

  async findAll() {
    try {
      return this.model.findAll({ where: { role: UserRoles.CUSTOMER }, attributes: { exclude: ["hashed_password"] } });
    } catch (error) {
      return catchError(error);
    }
  }

  async findOne(id: number) {
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

  async update(id: number, updateCustomerDto: UpdateCustomerDto) {
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

  async remove(id: number) {
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
