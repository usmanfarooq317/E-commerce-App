import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateOrderDto, UpdateOrderDto } from './dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async createOrder(userId: number, data: CreateOrderDto) {
    const product = await this.prisma.product.findUnique({
      where: { id: data.productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const total = product.price * data.quantity;

    return this.prisma.order.create({
      data: {
        userId, // ✅ simple scalar value
        productId: data.productId,
        quantity: data.quantity,
        total,
      },
      include: {
        product: true,
      },
    });
  }

  async findUserOrders(userId: number) {
    return this.prisma.order.findMany({
      where: { userId },
      include: { product: true },
    });
  }

  async update(userId: number, id: number, data: UpdateOrderDto) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');
    if (order.userId !== userId) throw new ForbiddenException();

    const product = await this.prisma.product.findUnique({
      where: { id: order.productId },
    });
    if (!product) throw new NotFoundException('Product not found');

    return this.prisma.order.update({
      where: { id },
      data: {
        quantity: data.quantity,
        total: product.price * data.quantity,
      },
      include: {
        product: true,
      },
    });
  }

  async remove(userId: number, id: number) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');
    if (order.userId !== userId) throw new ForbiddenException();

    return this.prisma.order.delete({ where: { id } });
  }

  async findAllWithUsers() {
    return this.prisma.order.findMany({
      include: {
        product: true,
        user: true,
      },
    });
  }
}
