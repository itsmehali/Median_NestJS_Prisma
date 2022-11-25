import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AtStrategy, RtStrategy } from './strategies';
import { UserService } from './users.service';
import { UserController } from './users.controller';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController, UserController],
  providers: [AuthService, AtStrategy, RtStrategy, UserService],
})
export class AuthModule {}
