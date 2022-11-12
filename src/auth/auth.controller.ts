import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { Token } from './types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('local/signup')
  signupLocal(@Body() dto: AuthDto): Promise<Token> {
    return this.authService.signupLocal(dto);
  }

  @Post('local/signin')
  signinLocal(@Body() dto: AuthDto): Promise<Token> {
    return this.authService.signinLocal(dto);
  }

  @Post('local/logout')
  logout() {
    return this.authService.logout();
  }

  @Post('local/refresh')
  refreshToken() {
    return this.authService.refreshToken();
  }
}
