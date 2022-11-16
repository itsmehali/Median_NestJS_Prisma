import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import { Token } from './types';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { userInfo } from 'os';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async signupLocal(dto: AuthDto): Promise<Token> {
    const { email, password } = dto;

    const hash = await this.hashData(password);

    const newUser = await this.prisma.user.create({
      data: {
        email: email,
        hash,
      },
    });

    // const tokens = await this.getTokens(newUser.id, newUser.email);

    // await this.updateRtHash(newUser.id, tokens.refresh_token);

    // return tokens;

    const tokens = this.generatingTokensForRT(newUser.id, newUser.email, newUser.role);

    return tokens;
  }

  async signinLocal(dto: AuthDto): Promise<Token> {
    const { email, password } = dto;

    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new ForbiddenException('Access Denied');
    }

    const passwordMatches = await bcrypt.compare(password, user.hash);

    if (!passwordMatches) {
      throw new ForbiddenException('Access Denied');
    }

    // const tokens = await this.getTokens(user.id, user.email);

    // await this.updateRtHash(user.id, tokens.refresh_token);

    // return tokens;

    const tokens = this.generatingTokensForRT(user.id, user.email, user.role);

    return tokens;
  }

  async logout(userId: number) {
    await this.prisma.user.updateMany({
      where: {
        id: userId,
        hashedRt: {
          not: null,
        },
      },
      data: {
        hashedRt: null,
      },
    });
  }

  async refreshToken(userId: number, refreshToken: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new ForbiddenException('Access Denied');
    }

    const rtMatches = await bcrypt.compare(refreshToken, user.hashedRt);

    if (!rtMatches) {
      throw new ForbiddenException('Access Denied');
    }

    const tokens = this.generatingTokensForRT(user.id, user.email, user.role);

    return tokens;
  }

  async generatingTokensForRT(userId: number, email: string, userRole: Role) {
    const tokens = await this.getTokens(userId, email, userRole);

    await this.updateRtHash(userId, tokens.refresh_token);

    return tokens;
  }

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  async getTokens(userId: number, email: string, userRole: Role) {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          role: userRole,
        },
        {
          secret: this.config.get<string>('AT_SECRET'),
          expiresIn: '120m',
        },
      ),

      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: this.config.get<string>('RT_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async updateRtHash(userId: number, refreshToken: string) {
    const hash = await this.hashData(refreshToken);

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hashedRt: hash,
      },
    });
  }
}
