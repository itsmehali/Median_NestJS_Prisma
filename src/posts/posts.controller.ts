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
  Query,
  ParseIntPipe,
  NotFoundException,
  UseInterceptors,
  UploadedFile,
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
import { FileInterceptor } from '@nestjs/platform-express';
import { saveImageToStorage } from 'src/helpers/imageHelper';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Roles(Role.USER)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('image'))
  @ApiCreatedResponse({ type: PostEntity })
  @Post()
  create(
    @Body() createPostDto: CreatePostDto,
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<CreatePostDto> {
    if (file) createPostDto.image = file.filename;

    return this.postsService.create(createPostDto, req.user);
  }

  @Get()
  findAll(@Query('title') title: string) {
    return this.postsService.findAll(title);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const post = await this.postsService.findOne(id);

    if (!post) throw new NotFoundException('Post not found');

    return post;
  }

  @Roles(Role.USER)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Patch(':id')
  @ApiCreatedResponse({ type: PostEntity })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
    @Req() req: Request,
  ) {
    return this.postsService.update(id, updatePostDto, req.user);
  }

  @Roles(Role.USER, Role.ADMIN)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Delete(':id')
  @ApiCreatedResponse({ type: PostEntity })
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    return this.postsService.remove(id, req.user);
  }
}
