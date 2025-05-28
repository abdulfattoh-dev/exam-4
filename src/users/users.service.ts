import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { hashPassword } from 'src/utils/bcrypt';
import { UserRoles } from 'src/enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private model: typeof User
  ) { }

  async createSeller(createUserDto: CreateUserDto) {
    try {
      const { email, phone_number, password, } = createUserDto;
      const existingEmail = await this.model.findOne({ where: { email } });

      if (existingEmail) {
        throw new ConflictException(`Email: ${email} already exists`);
      }

      const existingPhoneNumber = await this.model.findOne({ where: { phone_number } });

      if (existingPhoneNumber) {
        throw new ConflictException(`Phone number: ${phone_number} already exists`);
      }

      const hashed_password = await hashPassword(password);
      const seller = await this.model.create({
        ...createUserDto,
        hashed_password,
        role: UserRoles.SELLER,
        attributes: { exclude: ["hashed_password"] }
      });

      return {
        statusCode: 201,
        message: "success",
        data: seller
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async createCustomer(createUserDto: CreateUserDto) {
    try {
      const { email, phone_number, password, } = createUserDto;
      const existingEmail = await this.model.findOne({ where: { email } });

      if (existingEmail) {
        throw new ConflictException(`Email: ${email} already exists`);
      }

      const existingPhoneNumber = await this.model.findOne({ where: { phone_number } });

      if (existingPhoneNumber) {
        throw new ConflictException(`Phone number: ${phone_number} already exists`);
      }

      const hashed_password = await hashPassword(password);
      const customer = await this.model.create({
        ...createUserDto,
        hashed_password,
        attributes: { exclude: ["hashed_password"] }
      });

      return {
        statusCode: 201,
        message: "success",
        data: customer
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  findAll() {
    return this.model.findAll({ attributes: { exclude: ["hashed_password"] } });
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
