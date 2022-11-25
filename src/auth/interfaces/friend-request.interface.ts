export type FriendRequest_Status = 'pending' | 'accepted' | 'declined';

export interface FriendRequestStatus {
  status?: FriendRequest_Status;
}
