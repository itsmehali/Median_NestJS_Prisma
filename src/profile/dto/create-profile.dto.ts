import { IsOptional, IsString } from 'class-validator';

export class CreateProfileDto {
  @IsString()
  nickname: string;

  @IsString()
  @IsOptional()
  image: string;
}
