import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as bcrypt from 'bcrypt';
import { Token } from './types';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  async signupLocal(dto: AuthDto): Promise<Token> {
    const { email, password } = dto;

    const hash = await this.hashData(password);

    const newUser = this.prisma.user.create({
      data: {
        email: email,
        hash,
      },
    });
  }

  signinLocal() {}

  logout() {}

  refreshToken() {}
}
