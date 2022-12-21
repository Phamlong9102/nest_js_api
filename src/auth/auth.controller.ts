import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

// THẰNG CONTROLLER NÀY CHỨC NĂNG GIỐNG NHƯ THẰNG ROUTES TRONG EXPRESS
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // CHỨC NĂNG ĐĂNG KÝ
  @Post('register')
  register(@Body() dto: AuthDto) {
    return this.authService.register(dto);
  }

  // CHỨC NĂNG ĐĂNG NHẬP
  @Post('login')
  login(@Body() dto: AuthDto) {
    return this.authService.login(dto);
  }
}
