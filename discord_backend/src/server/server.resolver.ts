import { Resolver, Query, Args, Context, Mutation } from '@nestjs/graphql';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import {
  CreateServerDto,
  UpdateServerDto,
  CreateChannelOnServerDto,
} from './dto/create-server.dto';
import { ApolloError } from 'apollo-server-express';
import { Request } from 'express';
import { UseGuards } from '@nestjs/common';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { Server } from './types/types';
import { ServerService } from './server.service';
import { GraphqlAuthGuard } from 'src/auth/auth.guard';

@Resolver()
@UseGuards(GraphqlAuthGuard)
export class ServerResolver {
  constructor(private readonly serverService: ServerService) {}
  @Query(() => [Server])
  async getServers(@Context() ctx: { req: Request }) {
    if (!ctx.req?.profile.email)
      return new ApolloError('Profile not found', 'PROFILE_NOT_FOUND');
    return await this.serverService.getServerByProfileEmailOfMember(
      ctx.req?.profile.email,
    );
  }

  @Query(() => Server)
  async getServer(
    @Context() ctx: { req: Request },
    @Args('id', { nullable: true }) id: number,
  ) {
    if (!ctx.req?.profile.email)
      return new ApolloError('Profile not found', 'PROFILE_NOT_FOUND');
    return this.serverService.getServer(id, ctx.req?.profile.email);
  }

  @Mutation(() => Server)
  async createServer(
    @Args('input') input: CreateServerDto,
    @Args('file', { type: () => GraphQLUpload, nullable: true })
    file: GraphQLUpload,
  ) {
    if (!file) throw new ApolloError('Image is required', 'IMAGE_REQUIRED');
    const imageUrl = await this.storeImageAndGetUrl(file);

    return this.serverService.createServer(input, imageUrl);
  }

  async storeImageAndGetUrl(file: GraphQLUpload) {
    const { createReadStream, filename } = await file;
    const uniqueFilename = `${uuidv4()}_${filename}`;
    const imagePath = join(process.cwd(), 'public', 'images', uniqueFilename);
    const imageUrl = `${process.env.APP_URL}/images/${uniqueFilename}`;

    if (!existsSync(join(process.cwd(), 'public', 'images'))) {
      mkdirSync(join(process.cwd(), 'public', 'images'), { recursive: true });
    }

    const readStream = createReadStream();
    readStream.pipe(createWriteStream(imagePath));
    return imageUrl;
  }

  @Mutation(() => Server)
  async updateServer(
    @Args('input') input: UpdateServerDto,
    @Args('file', { type: () => GraphQLUpload, nullable: true })
    file: GraphQLUpload,
  ) {
    let imageUrl;

    if (file) {
      imageUrl = await this.storeImageAndGetUrl(file);
    }
    try {
      return this.serverService.updateServer(input, imageUrl);
    } catch (err) {
      throw new ApolloError(err.message, err.code);
    }
  }

  @Mutation(() => Server)
  async updateServerWithNewInviteCode(
    @Args('serverId', { nullable: true }) serverId: number,
  ) {
    if (!serverId)
      throw new ApolloError('Server id is required', 'SERVER_ID_REQUIRED');
    try {
      return this.serverService.updateServerWithNewInviteCode(serverId);
    } catch (err) {
      throw new ApolloError(err.message, err.code);
    }
  }

  @Mutation(() => Server)
  async createChannel(
    @Args('input') input: CreateChannelOnServerDto,
    @Context() ctx: { req: Request },
  ) {
    try {
      return this.serverService.createChannel(input, ctx.req?.profile.email);
    } catch (err) {
      throw new ApolloError(err.message, err.code);
    }
  }

  @Mutation(() => String)
  async leaveServer(
    @Args('serverId', { nullable: true }) serverId: number,
    @Context() ctx: { req: Request },
  ) {
    try {
      await this.serverService.leaveServer(serverId, ctx.req?.profile.email);
      return 'OK';
    } catch (err) {
      throw new ApolloError(err.message, err.code);
    }
  }

  @Mutation(() => String)
  async deleteServer(
    @Args('serverId', { nullable: true }) serverId: number,
    @Context() ctx: { req: Request },
  ) {
    try {
      return this.serverService.deleteServer(serverId, ctx.req?.profile.email);
    } catch (err) {
      throw new ApolloError(err.message, err.code);
    }
  }

  @Mutation(() => String)
  async deleteChannelFromServer(
    @Args('channelId', { nullable: true }) channelId: number,
    @Context() ctx: { req: Request },
  ) {
    try {
      return this.serverService.deleteChannelFromServer(
        channelId,
        ctx.req?.profile.email,
      );
    } catch (err) {
      throw new ApolloError(err.message, err.code);
    }
  }
}
