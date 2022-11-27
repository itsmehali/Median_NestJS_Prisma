import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtPayload } from 'src/auth/JwtPayload.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async create(postId: number, createCommentDto: CreateCommentDto, user: JwtPayload) {
    const post = await this.prisma.post.findFirst({ where: { id: postId } });

    if (!post) throw new NotFoundException('Post not found');

    return this.prisma.comment.create({
      data: { postId: postId, ...createCommentDto, userId: user.sub },
    });
  }

  findAll() {
    return `This action returns all comment`;
  }

  async findOne(id: number) {
    return await this.prisma.comment.findUnique({ where: { id } });
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
