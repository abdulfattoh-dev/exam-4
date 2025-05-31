import { Controller, Get, Post, Body, Patch, Param, Delete, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { SignInAdminDto } from './dto/sign-in-admin.dto';
import { Response } from 'express';
import { AuthGuard } from 'src/guards/auth.guard';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { ConfirmSignInAdminDto } from './dto/confirm-sign-in-admin.dto';
import { RolesGuard } from 'src/guards/role.guard';
import { CheckRoles } from 'src/decorators/role.decorator';
import { AdminRoles } from 'src/enum';

@Controller('admin')
@UseInterceptors(CacheInterceptor)
export class AdminController {
  constructor(private readonly adminService: AdminService) { }

  @UseGuards(AuthGuard, RolesGuard)
  @CheckRoles(AdminRoles.SUPERADMIN)
  @Post()
  async create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.create(createAdminDto);
  }

  @Post("sign-in")
  async signIn(@Body() signInAdminDto: SignInAdminDto) {
    return this.adminService.signIn(signInAdminDto);
  }

  @Post("confirm-sign-in")
  async confirmSignIn(@Body() confirmSignInAdminDto: ConfirmSignInAdminDto, @Res({ passthrough: true }) res: Response) {
    return this.adminService.confirmSignIn(confirmSignInAdminDto, res);
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
