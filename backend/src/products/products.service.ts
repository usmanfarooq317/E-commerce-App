// src/products/products.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(data: { name: string; description: string; price: number }, creatorId: number) {
    if (!creatorId) throw new Error('creatorId is undefined'); // 👈 optional safety

    return this.prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        creatorId, // ✅ this is all you need
      },
    });
  }


  async findAll() {
    return this.prisma.product.findMany();
  }

  async update(id: number, data: { name: string; description: string; price: number }) {
    return this.prisma.product.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return this.prisma.product.delete({ where: { id } });
  }
}
