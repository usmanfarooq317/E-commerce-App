import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  Put,
  Delete,
  Request,
  ParseIntPipe,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.usersService.register(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('all')
  getAllUsers(@Request() req) {
    if (req.user.email !== 'admin@gmail.com') throw new ForbiddenException('Forbidden');
    return this.usersService.getAll();
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  updateUser(@Param('id', ParseIntPipe) id: number, @Body() dto: Partial<RegisterDto>, @Request() req) {
    if (req.user.email !== 'admin@gmail.com') throw new ForbiddenException('Forbidden');
    return this.usersService.updateUser(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number, @Request() req) {
    if (req.user.email !== 'admin@gmail.com') throw new ForbiddenException('Forbidden');
    return this.usersService.deleteUser(id);
  }
}
