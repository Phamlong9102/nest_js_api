import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

// THẰNG SERVICE NÀY CHỨC NĂNG GIỐNG VỚI THẰNG CONTROLLER TRONG EXPRESS
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  // CHỨC NĂNG ĐĂNG KÍ
  async register(dto: AuthDto) {
    // GENERATE HASHED PASSWORD
    const password = await argon.hash(dto.password);

    try {
      // SAVE NEW USER TO DATABASE
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password,
        },
      });

      // XÓA PASSWORD
      delete user.password;

      // ĐOẠN NÀY LÀ CHỌN ĐƯỢC DỮ LIỆU TRẢ VÊ TỪ BACK END
      return this.signToken(user.id, user.email);
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new ForbiddenException('EMAIL ĐÃ ĐƯỢC ĐĂNG KÍ');
        }
      }
      throw err;
    }
  }

  // CHỨC NĂNG ĐĂNG NHẬP
  async login(dto: AuthDto) {
    // TÌM USER BẰNG EMAIL
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    // NẾU KHÔNG TÌM THẤY EMAIL TRONG DATABASE THÌ TRẢ VỀ LỖI
    if (!user)
      throw new ForbiddenException('KHÔNG TÌM THẤY EMAIL TRONG DATABASE');

    // SO SÁNH PASSWORD
    const passwordMatch = await argon.verify(user.password, dto.password);

    // NẾU PASSWORD SAI
    if (!passwordMatch)
      throw new ForbiddenException('EMAIL HOẶC PASSWORD KHÔNG ĐÚNG');

    // TRẢ VỀ USER ID VÀ USER EMAIL DƯỚI DẠNG JWT
    return this.signToken(user.id, user.email);
  }

  // TẠO CHỮ KÍ
  // MONG MUỐN PROMISE SẼ TRẢ RA ACCESS TOKEN STRING
  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };

    // LẤY JWT SECRET TỪ FILE .env
    const secret = this.config.get('JWT_SECRET');

    // TẠO ACCESS TOKEN
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: secret,
    });

    // TRẢ VỀ ACCESS TOKEN
    return {
      access_token: token,
    };
  }
}
