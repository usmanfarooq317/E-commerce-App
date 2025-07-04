import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async register(data: RegisterDto) {
    const hashed = await bcrypt.hash(data.password, 10);
    return this.prisma.user.create({
      data: {
        ...data,
        password: hashed,
      },
    });
  }

  async getAll() {
    // Fetch all users excluding the admin
    return this.prisma.user.findMany({
      where: {
        NOT: {
          email: 'admin@gmail.com',
        },
      },
    });
  }

  async updateUser(id: number, data: Partial<RegisterDto>) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    if (user.email === 'admin@gmail.com') {
      throw new ForbiddenException('Admin cannot be updated');
    }

    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async deleteUser(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    if (user.email === 'admin@gmail.com') {
      throw new ForbiddenException('Admin cannot be deleted');
    }

    return this.prisma.user.delete({
      where: { id },
    });
  }
}
