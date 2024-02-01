import { Resolver, Query, Args, Context, Mutation } from '@nestjs/graphql';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { CreateServerDto } from './dto/create-server.dto';
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
export class ServerResolver {
  constructor(private readonly serverService: ServerService) {}

  @UseGuards(GraphqlAuthGuard)
  @Query(() => [Server])
  async getServers(
    @Args('profileId') profileId: number,
    @Context() ctx: { req: Request },
  ) {
    if (!ctx.req?.profile.email)
      return new ApolloError('Profile not found', 'PROFILE_NOT_FOUND');
    return this.serverService.getServerByProfileEmailOfMember(
      ctx.req?.profile.email,
    );
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
}
