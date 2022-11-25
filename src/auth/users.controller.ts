import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { Request } from 'express';
import { AccessTokenGuard } from 'src/guards';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from './decoraters';
import { FriendRequestStatus, FriendRequest_Status } from './interfaces/friend-request.interface';
import { UserService } from './users.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Roles(Role.USER)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Post('friend-request/send/:receiverId')
  sendFriendRequest(@Param('receiverId', ParseIntPipe) receiverId: number, @Req() req: Request) {
    return this.userService.sendFriendRequest(receiverId, req.user);
  }

  @Roles(Role.USER)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Put('friend-request/response/:friendRequestId')
  respondToFriendRequest(
    @Param('friendRequestId', ParseIntPipe) friendRequestId: number,
    @Body() statusResponse: FriendRequestStatus,
    @Req() req: Request,
  ) {
    return this.userService.respondToFriendRequest(
      friendRequestId,
      statusResponse.status,
      req.user,
    );
  }

  @Roles(Role.USER)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Get('friend-request/status/:receiverId')
  getFriendRequestStatus(
    @Param('receiverId', ParseIntPipe) receiverId: number,
    @Req() req: Request,
  ) {
    return this.userService.getFriendRequestStatus(receiverId, req.user);
  }

  // GET received friendrequests
  @Roles(Role.USER)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Get('friend-request/received-requests')
  getFriendRequestsFromRecipients(@Req() req: Request) {
    return this.userService.getFriendRequestsFromRecipients(req.user.sub);
  }
}
