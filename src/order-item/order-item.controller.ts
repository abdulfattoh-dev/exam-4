import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { OrderItemService } from './order-item.service';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { CheckRoles } from 'src/decorators/role.decorator';
import { AdminRoles } from 'src/enum';

@Controller('order-item')
export class OrderItemController {
  constructor(private readonly orderItemService: OrderItemService) {}

  @Post()
  create(@Body() createOrderItemDto: CreateOrderItemDto) {
    return this.orderItemService.create(createOrderItemDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @CheckRoles(AdminRoles.SUPERADMIN, AdminRoles.ADMIN)
  @Get()
  findAll() {
    return this.orderItemService.findAll();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @CheckRoles(AdminRoles.SUPERADMIN, AdminRoles.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderItemService.findOne(+id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @CheckRoles(AdminRoles.SUPERADMIN, AdminRoles.ADMIN)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrderItemDto: UpdateOrderItemDto,
  ) {
    return this.orderItemService.update(+id, updateOrderItemDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @CheckRoles(AdminRoles.SUPERADMIN, AdminRoles.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderItemService.remove(+id);
  }
}
