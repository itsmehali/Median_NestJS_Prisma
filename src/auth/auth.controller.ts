import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { Token } from './types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/local/signup')
  signupLocal(@Body() dto: AuthDto): Promise<Token> {
    return this.authService.signupLocal(dto);
  }

  @Post('/local/signin')
  signinLocal() {
    this.authService.signinLocal();
  }

  @Post('/local/logout')
  logout() {
    this.authService.logout();
  }

  @Post('/local/refresh')
  refreshToken() {
    this.authService.refreshToken();
  }
}
