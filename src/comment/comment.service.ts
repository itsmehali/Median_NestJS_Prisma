import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from 'src/auth/JwtPayload.interface';
import { PostsService } from 'src/posts/posts.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService, private postsService: PostsService) {}

  async create(postId: number, createCommentDto: CreateCommentDto, user: JwtPayload) {
    const post = await this.prisma.post.findFirst({ where: { id: postId } });

    if (!post) throw new NotFoundException('Post not found');

    return this.prisma.comment.create({
      data: { postId: postId, ...createCommentDto, userId: user.sub },
    });
  }

  async findAll() {
    return await this.prisma.comment.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.comment.findUnique({ where: { id } });
  }

  async update(id: number, updateCommentDto: UpdateCommentDto, user: JwtPayload) {
    if (!user) throw new NotFoundException('User not found');

    // using method from Postservice
    // const post = await this.postsService.findOne(postId);
    // if (!post) throw new NotFoundException('Post not found');

    const comment = await this.findOne(id);

    if (!comment) throw new NotFoundException('Comment not found');

    if (comment.userId !== user.sub) {
      throw new UnauthorizedException('You do not have access to do that!');
    }

    return this.prisma.comment.update({
      where: { id },
      data: updateCommentDto,
    });
  }

  async remove(id: number, user: JwtPayload) {
    if (!user) throw new NotFoundException('User not found');

    const comment = await this.findOne(id);

    if (!comment) throw new NotFoundException('Comment not found');

    if (comment.userId !== user.sub || user.role === 'ADMIN') {
      throw new UnauthorizedException('You do not have access to do that!');
    }

    return this.prisma.comment.delete({ where: { id } });
  }
}
