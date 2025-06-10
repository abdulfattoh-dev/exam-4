import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  UseGuards,
  UseInterceptors,
  ParseIntPipe,
} from '@nestjs/common';
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
import { GetCookie } from 'src/decorators/cookie.decorator';
import { StatusAdminDto } from './dto/status.admin.dto';
import { SelfGuard } from 'src/guards/self.guard';

@Controller('admin')
@UseInterceptors(CacheInterceptor)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @CheckRoles(AdminRoles.SUPERADMIN)
  @Post()
  async create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.create(createAdminDto);
  }

  @Post('sign-in')
  async signIn(@Body() signInAdminDto: SignInAdminDto) {
    return this.adminService.signIn(signInAdminDto);
  }

  @Post('confirm-sign-in')
  async confirmSignIn(
    @Body() confirmSignInAdminDto: ConfirmSignInAdminDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.adminService.confirmSignIn(confirmSignInAdminDto, res);
  }

  @Post('token')
  async refreshToken(@GetCookie('refreshTokenAdmin') refreshToken: string) {
    return this.adminService.refreshToken(refreshToken);
  }

  @Post('sign-out')
  async signOut(
    @GetCookie('refreshTokenAdmin') refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.adminService.signOut(refreshToken, res);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @CheckRoles(AdminRoles.SUPERADMIN)
  @Get()
  async findAll() {
    return this.adminService.findAll();
  }

  @UseGuards(AuthGuard, SelfGuard)
  @CheckRoles(AdminRoles.SUPERADMIN, AdminRoles.ADMIN)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.findOne(id);
  }

  @Patch('status/:id')
  async status(
    @Param('id', ParseIntPipe) id: number,
    @Body() statusDto: StatusAdminDto,
  ) {
    return this.adminService.status(id, statusDto);
  }

  @UseGuards(AuthGuard, SelfGuard)
  @CheckRoles(AdminRoles.SUPERADMIN, AdminRoles.ADMIN)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAdminDto: UpdateAdminDto,
  ) {
    return this.adminService.update(id, updateAdminDto);
  }

  @UseGuards(AuthGuard, SelfGuard)
  @CheckRoles(AdminRoles.SUPERADMIN)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.remove(id);
  }
}
