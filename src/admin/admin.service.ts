import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Admin } from './models/admin.model';
import { hashPassword } from 'src/utils/bcrypt';
import { AdminRoles } from 'src/enum';

@Injectable()
export class AdminService {
  constructor(@InjectModel(Admin) private model: typeof Admin) {}

  async createSuperAdmin(createAdminDto: CreateAdminDto): Promise<object> {
    try {
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
    } catch (error) {
      throw new InternalServerErrorException(error.message);
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

      const hashed_password = await hashPassword(password);
      const admin = await this.model.create({
        ...createAdminDto,
        hashed_password,
        attributes: { exclude: ['hashed_password'] },
      });

      return {
        statusCode: 201,
        message: 'success',
        data: admin,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll() {
    try {
      return this.model.findAll({
        where: { role: ['admin', 'superadmin'] },
        attributes: { exclude: ['hashed_password'] },
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
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
      throw new InternalServerErrorException(error.message);
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
      throw new InternalServerErrorException(error.message);
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
      throw new InternalServerErrorException(error.message);
    }
  }
}
