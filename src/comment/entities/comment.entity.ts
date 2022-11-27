import { ApiProperty } from '@nestjs/swagger';
import { Comment } from '@prisma/client';

export class CommentEntity implements Comment {
  @ApiProperty()
  id: number;
  @ApiProperty()
  comment: string;
  @ApiProperty()
  postId: number;
  @ApiProperty()
  userId: number;
}
