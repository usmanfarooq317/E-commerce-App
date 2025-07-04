import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
  Put,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderDto } from './dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // 👤 USER - Create order
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req, @Body() dto: CreateOrderDto) {
    return this.ordersService.createOrder(req.user.userId, dto);
  }

  // 👤 USER - Get own orders
  @UseGuards(JwtAuthGuard)
  @Get('my')
  findUserOrders(@Request() req) {
    return this.ordersService.findUserOrders(req.user.userId);
  }

  // 👤 USER - Update own order
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: UpdateOrderDto,
  ) {
    return this.ordersService.update(req.user.userId, +id, dto);
  }

  // 👤 USER - Delete own order
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.ordersService.remove(req.user.userId, +id);
  }

  // 🔐 ADMIN - Get all user orders
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Request() req) {
    const user = req.user;
    if (user.email !== 'admin@gmail.com') {
      return { message: 'Access denied: Only admin can view all orders' };
    }
    return this.ordersService.findAllWithUsers();
  }
}
