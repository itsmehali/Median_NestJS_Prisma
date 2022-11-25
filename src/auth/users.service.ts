import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { prisma, User } from '@prisma/client';
import { of } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { FriendRequest } from './dto';
import { FriendRequest_Status } from './interfaces/friend-request.interface';
import { JwtPayload } from './JwtPayload.interface';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async sendFriendRequest(receiverId: number, creator: JwtPayload) {
    if (receiverId === creator.sub) {
      throw new HttpException('It is not possible to add yourself!', HttpStatus.FORBIDDEN);
    }

    const alreadyExist = await this.hasRequestBeenSentOrReceived(receiverId, creator.sub);

    if (alreadyExist.length === 0) {
      return this.prisma.friendRequest.create({
        data: {
          creator: creator.sub,
          receiver: receiverId,
          status: 'pending',
        },
      });
    } else {
      throw new HttpException(
        'A friend request has already been sent of received to your account!',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async respondToFriendRequest(
    friendRequestId: number,
    statusResponse: FriendRequest_Status,
    currentUser: JwtPayload,
  ) {
    const findMyselfInFriendRequest = await this.findFriendRequestById(friendRequestId);

    if (currentUser.sub !== findMyselfInFriendRequest.id) {
      throw new HttpException(
        'You can not interract with this friend request.',
        HttpStatus.FORBIDDEN,
      );
    }

    return await this.prisma.friendRequest.update({
      where: { id: friendRequestId },
      data: { status: statusResponse },
    });
  }

  async getFriendRequestStatus(creatorId: number, currentUser: JwtPayload) {
    return await this.prisma.friendRequest.findMany({ where: { creator: creatorId } });
  }

  async getFriendRequestsFromRecipients(currentUser: number) {
    return await this.prisma.friendRequest.findMany({ where: { receiver: currentUser } });
  }

  async hasRequestBeenSentOrReceived(receiverId: number, creatorId: number) {
    const friendRequest = await this.prisma.friendRequest.findMany({
      where: {
        receiver: { in: receiverId },
        creator: { in: creatorId },
      },
    });

    return friendRequest;
  }

  findUserById(id: number) {
    return this.prisma.user.findFirst({ where: { id } });
  }

  findFriendRequestById(id: number) {
    return this.prisma.friendRequest.findFirst({ where: { id } });
  }
}
