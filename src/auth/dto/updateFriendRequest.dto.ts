import { FriendRequest } from '@prisma/client';
import { FriendRequest_Status } from '../interfaces/friend-request.interface';

export class UpdateFriendRequestDto {
  status: FriendRequest_Status;
}
