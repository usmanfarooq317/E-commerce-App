// src/products/products.controller.ts

import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Request,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // 🔐 ADMIN - Create product
  @UseGuards(JwtAuthGuard)
  @Post()
@UseGuards(JwtAuthGuard)
async create(@Request() req, @Body() dto: { name: string; description: string; price: number }) {
  if (req.user.email !== 'admin@gmail.com') {
    throw new ForbiddenException('Only admin can create products');
  }

  console.log('req.user =', req.user); // ✅ see if userId is there
  return this.productsService.create(dto, req.user.userId); // ✅ must not be undefined
}

  // 👥 USER/ADMIN - Get all products
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return this.productsService.findAll();
  }

  // 🔐 ADMIN - Update product
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: { name: string; description: string; price: number }, @Request() req) {
    if (req.user.email !== 'admin@gmail.com') throw new ForbiddenException('Only admin can update');
    return this.productsService.update(+id, dto);
  }

  // 🔐 ADMIN - Delete product
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req) {
    if (req.user.email !== 'admin@gmail.com') throw new ForbiddenException('Only admin can delete');
    return this.productsService.delete(+id);
  }
}
