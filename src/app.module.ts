import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ArticlesModule } from './articles/articles.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './guards';
import { PostsModule } from './posts/posts.module';
import { ProfileModule } from './profile/profile.module';
import { CommentModule } from './comment/comment.module';

import * as Joi from '@hapi/joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
        AWS_REGION: Joi.string().required(),
        AWS_ACCESS_KEY_ID: Joi.string().required(),
        AWS_SECRET_ACCESS_KEY: Joi.string().required(),
        AWS_PUBLIC_BUCKET_NAME: Joi.string().required(),
      }),
    }),
    PrismaModule,
    ArticlesModule,
    AuthModule,
    PostsModule,
    ProfileModule,
    CommentModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // { provide: APP_GUARD, useClass: AccessTokenGuard }
  ],
})
export class AppModule {}
