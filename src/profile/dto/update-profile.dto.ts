import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CreateProfileDto } from './create-profile.dto';

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  image: string;
}
