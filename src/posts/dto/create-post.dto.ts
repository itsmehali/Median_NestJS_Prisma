import { IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  title: string;
  @IsString()
  @IsOptional()
  image: string;
  @IsString()
  @IsOptional()
  description: string;
  // @IsNumber()
  authorId: number;
}
