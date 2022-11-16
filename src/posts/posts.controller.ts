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
  Logger,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Role } from '@prisma/client';
import { Roles } from 'src/auth/decoraters';
import { AccessTokenGuard } from 'src/guards';
import { RolesGuard } from 'src/guards/roles.guard';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { PostEntity } from './entities/post.entity';
import { Request } from 'express';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Roles(Role.USER)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @ApiCreatedResponse({ type: PostEntity })
  @Post()
  create(@Body() createPostDto: CreatePostDto, @Req() req: Request) {
    //,
    //Logger.log('here should be the request specific user', req.user);
    // return 'test';
    return this.postsService.create(createPostDto, req.user);
  }

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
}
