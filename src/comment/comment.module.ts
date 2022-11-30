import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PostsService } from 'src/posts/posts.service';

@Module({
  imports: [PrismaModule],
  controllers: [CommentController],
  providers: [CommentService, PostsService],
})
export class CommentModule {}
