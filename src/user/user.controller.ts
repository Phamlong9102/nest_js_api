import { Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  // THẰNG NÀY DÙNG KIỂU MIDDLE WARE CONFIRM ACCESS TOKEN

  // LẤY DETAIL DATA USER
  @Get('data')
  getDetailUserData(@GetUser() user: User) {
    return user;
  }
}
