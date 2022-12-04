import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from 'src/auth/JwtPayload.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  create(createProfileDto: CreateProfileDto, user: JwtPayload) {
    return this.prisma.profile.create({ data: { ...createProfileDto, userId: user.sub } });
  }

  findAll() {
    return this.prisma.profile.findMany();
  }

  findOne(id: number) {
    return this.prisma.profile.findFirst({ where: { id } });
  }

  update(id: number, updateProfileDto: UpdateProfileDto) {
    return `This action updates a #${id} profile`;
  }

  async remove(id: number, user: JwtPayload) {
    if (!user) throw new NotFoundException('User not found');

    const profile = await this.prisma.profile.findUnique({ where: { id } });
    if (!profile) throw new NotFoundException('Post not found');

    if (user.sub !== profile.userId && user.role !== 'ADMIN') {
      throw new UnauthorizedException('You do not have rights for it!');
    }

    return this.prisma.profile.delete({ where: { id } });
  }
}
