import { IsOptional, IsString } from 'class-validator';

export class UpdatePostDto {
  @IsString()
  @IsOptional()
  title: string;
  @IsString()
  @IsOptional()
  image: string;
  @IsString()
  @IsOptional()
  description: string;
}
