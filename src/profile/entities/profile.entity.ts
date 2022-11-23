import { ApiProperty } from '@nestjs/swagger';
import { Profile } from '@prisma/client';

export class ProfileEntity implements Profile {
  @ApiProperty()
  id: number;
  @ApiProperty()
  userId: number;
  @ApiProperty()
  nickname: string;
  @ApiProperty()
  image: string;
}
