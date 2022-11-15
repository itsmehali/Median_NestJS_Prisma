import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { Token } from './types';
import { Request } from 'express';
import { AccessTokenGuard, RefreshTokenGuard } from 'src/guards';
import { CurrentUser, CurrentUserId, Public } from './decoraters';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //@Public()
  @Post('local/signup')
  @HttpCode(HttpStatus.CREATED)
  signupLocal(@Body() dto: AuthDto): Promise<Token> {
    return this.authService.signupLocal(dto);
  }

  // @Public()
  @Post('local/signin')
  @HttpCode(HttpStatus.OK)
  signinLocal(@Body() dto: AuthDto): Promise<Token> {
    return this.authService.signinLocal(dto);
  }

  @UseGuards(AccessTokenGuard)
  @Post('local/logout')
  @HttpCode(HttpStatus.OK)
  logout(@CurrentUserId() userId: number) {
    return this.authService.logout(userId);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('local/refresh')
  @HttpCode(HttpStatus.OK)
  refreshToken(@CurrentUserId() userId: number, @CurrentUser('refreshToken') refreshToken: string) {
    return this.authService.refreshToken(userId, refreshToken);
  }
}
