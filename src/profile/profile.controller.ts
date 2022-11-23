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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Role } from '@prisma/client';
import { Roles } from 'src/auth/decoraters';
import { RolesGuard } from 'src/guards/roles.guard';
import { AccessTokenGuard } from 'src/guards';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProfileEntity } from './entities/profile.entity';
import { ApiCreatedResponse } from '@nestjs/swagger';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Roles(Role.USER)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('image'))
  @ApiCreatedResponse({ type: ProfileEntity })
  @Post()
  create(
    @Body() createProfileDto: CreateProfileDto,
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) createProfileDto.image = file.filename;

    return this.profileService.create(createProfileDto, req.user);
  }

  @Get()
  findAll() {
    return this.profileService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.profileService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profileService.update(+id, updateProfileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.profileService.remove(+id);
  }
}
