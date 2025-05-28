import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

<<<<<<< HEAD
  @Post('super')
  createSuperAdmin(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.createSuperAdmin(createAdminDto);
  }

=======
>>>>>>> 39fea831b376bd16a715aa4b0ab6758ff50a4817
  @Post()
  async create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.create(createAdminDto);
  }

  @Get()
  async findAll() {
    return this.adminService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.adminService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(+id, updateAdminDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.adminService.remove(+id);
  }
}
