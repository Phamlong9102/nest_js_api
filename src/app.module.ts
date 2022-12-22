import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    BookmarkModule,
    UserModule,
    // ĐOẠN NÀY THÊM isGlobal là true KHÔNG THÌ NÓ BỊ LỖI CONFIG
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
