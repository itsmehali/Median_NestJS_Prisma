import { User } from '@prisma/client';
import { FriendRequest_Status } from '../interfaces/friend-request.interface';

export class FriendRequest {
  creator: User;
  receiver: User;
  status: FriendRequest_Status;
}
