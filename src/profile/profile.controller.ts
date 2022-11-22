import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Role } from '@prisma/client';
import { Roles } from 'src/auth/decoraters';
import { RolesGuard } from 'src/guards/roles.guard';
import { AccessTokenGuard } from 'src/guards';
import { Request } from 'express';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Roles(Role.USER)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Post()
  create(
    @Body() createProfileDto: CreateProfileDto,
    @Req() req: Request,
  ): Promise<CreateProfileDto> {
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
