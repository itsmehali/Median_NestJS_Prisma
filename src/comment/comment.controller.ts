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
  @Post(':id')
  async create(
    @Param('id', ParseIntPipe) postId: number,
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: Request,
  ) {
    return await this.commentService.create(postId, createCommentDto, req.user);
  }

  @Get()
  findAll() {
    return this.commentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.update(+id, updateCommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentService.remove(+id);
  }
}
