import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { Roles } from 'src/auth/decoraters';
import { AccessTokenGuard } from 'src/guards';
import { RolesGuard } from 'src/guards/roles.guard';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Request } from 'express';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { CommentEntity } from './entities/comment.entity';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Roles(Role.USER)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @ApiCreatedResponse({ type: CommentEntity })
  @Post(':postId')
  create(
    @Param('postId', ParseIntPipe) postId: number,
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: Request,
  ) {
    return this.commentService.create(postId, createCommentDto, req.user);
  }

  @Get()
  findAll() {
    return this.commentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.commentService.findOne(id);
  }

  @Roles(Role.USER)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @ApiCreatedResponse({ type: CommentEntity })
  @Patch(':commentId')
  update(
    @Param('commentId', ParseIntPipe) commentId: number,
    @Body() updateCommentDto: UpdateCommentDto,
    @Req() req: Request,
  ) {
    return this.commentService.update(commentId, updateCommentDto, req.user);
  }

  @Roles(Role.USER, Role.ADMIN)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Delete(':commentId')
  @ApiCreatedResponse({ type: CommentEntity })
  remove(@Param('commentId', ParseIntPipe) id: number, @Req() req: Request) {
    return this.commentService.remove(id, req.user);
  }
}
