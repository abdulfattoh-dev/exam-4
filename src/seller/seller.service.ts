import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Seller } from './models/seller.model';
import { comparePassword, hashPassword } from 'src/utils/bcrypt';
import { catchError } from 'src/utils/catch-error';
import { UserRoles } from 'src/enum';
import { SignInSellerDto } from './dto/sign-in-seller.dto';
import { Response } from 'express';
import { TokenService } from 'src/utils/generate-token';
import { writeToCookie } from 'src/utils/write-cookie';

@Injectable()
export class SellerService {
  constructor(
    @InjectModel(Seller) private model: typeof Seller,
    private readonly token: TokenService
  ) { }

  async create(createSellerDto: CreateSellerDto) {
    try {
      const { email, phone_number, password, } = createSellerDto;
      const existingEmail = await this.model.findOne({ where: { email } });

      if (existingEmail) {
        throw new ConflictException(`Email: ${email} already exists`);
      }

      const existingPhoneNumber = await this.model.findOne({ where: { phone_number } });

      if (existingPhoneNumber) {
        throw new ConflictException(`Phone number: ${phone_number} already exists`);
      }

      const hashedPassword = await hashPassword(password);
      const seller = await this.model.create({
        ...createSellerDto,
        hashed_password: hashedPassword,
        attributes: { exclude: ["hashed_password"] }
      });

      return {
        statusCode: 201,
        message: "success",
        data: seller
      }
    } catch (error) {
      return catchError(error);
    }
  }

  async signIn(signInSellerDto: SignInSellerDto, res: Response): Promise<object> {
    try {
      const { email, password } = signInSellerDto;
      const seller = await this.model.findOne({ where: { email } });

      if (!seller) {
        throw new BadRequestException("Invalid email or password");
      }

      const isMatchPassword = await comparePassword(password, seller.dataValues?.hashed_password);

      if (!isMatchPassword) {
        throw new BadRequestException("Invalid email or password");
      }

      const payload = {
        id: seller.dataValues.id,
        role: seller.dataValues.role,
        status: seller.dataValues.status
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
      return this.model.findAll({ where: { role: UserRoles.SELLER }, attributes: { exclude: ["hashed_password"] } });
    } catch (error) {
      return catchError(error);
    }
  }

  async findOne(id: number) {
    try {
      const seller = await this.model.findByPk(id, { attributes: { exclude: ["hashed_password"] } });

      if (!seller) {
        throw new NotFoundException(`Seller not found by id: ${id}`);
      }

      return {
        statusCode: 200,
        message: "success",
        data: seller
      }
    } catch (error) {
      return catchError(error);
    }
  }

  async update(id: number, updateSellerDto: UpdateSellerDto) {
    try {
      const seller = await this.model.findByPk(id);

      if (!seller) {
        throw new NotFoundException(`Seller not found by id: ${id}`);
      }

      const { password } = updateSellerDto;

      if (password) {
        updateSellerDto.password = await hashPassword(password);
      }

      await this.model.update({
        ...updateSellerDto,
        hashed_password: updateSellerDto.password
      }, { where: { id } });

      const updatedSeller = await this.model.findByPk(id, { attributes: { exclude: ["hashed_password"] } });

      return {
        statusCode: 200,
        message: "success",
        data: updatedSeller
      }
    } catch (error) {
      return catchError(error);
    }
  }

  async remove(id: number) {
    try {
      const seller = await this.model.findByPk(id);

      if (!seller) {
        throw new NotFoundException(`Seller not found by id: ${id}`);
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
