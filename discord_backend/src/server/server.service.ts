import { Injectable, BadRequestException } from '@nestjs/common';
import { ApolloError } from 'apollo-server-express';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateServerDto,
  UpdateServerDto,
  CreateChannelOnServerDto,
} from './dto/create-server.dto';
import { MemberRole } from 'src/member/types/member.types';
import { ChannelType } from './types/types';

@Injectable()
export class ServerService {
  constructor(private readonly prisma: PrismaService) {}

  async createServer(input: CreateServerDto, imageUrl: string) {
    const profile = await this.prisma.profile.findUnique({
      where: {
        id: Number(input.profileId),
      },
    });
    if (!profile) throw new BadRequestException('Profile not found');

    return this.prisma.server.create({
      data: {
        ...input,
        imageUrl,
        inviteCode: uuidv4(),
        channels: {
          create: [
            {
              name: 'general',
              profileId: profile.id,
            },
          ],
        },
        members: {
          create: [
            {
              profileId: profile.id,
              role: MemberRole.ADMIN,
            },
          ],
        },
      },
      include: {
        members: true,
      },
    });
  }

  async getServerByProfileEmailOfMember(email: string) {
    return this.prisma.server.findMany({
      where: {
        members: {
          some: {
            profile: {
              email,
            },
          },
        },
      },
    });
  }

  async getServer(id: number, email: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { email },
    });

    if (!profile)
      return new ApolloError('Profile not found', 'PROFILE_NOT_FOUND');

    const server = await this.prisma.server.findUnique({
      where: {
        id,
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      include: {
        channels: true,
        members: {
          include: {
            profile: true,
            server: true,
          },
        },
      },
    });
    if (!server) return new ApolloError('Server not found', 'SERVER_NOT_FOUND');
    return server;
  }

  async updateServerWithNewInviteCode(serverId: number) {
    const server = await this.prisma.server.findUnique({
      where: {
        id: serverId,
      },
    });

    if (!server) throw Error('Server not found');

    return this.prisma.server.update({
      where: {
        id: serverId,
      },
      data: {
        inviteCode: uuidv4(),
      },
    });
  }

  async updateServer(input: UpdateServerDto, imageUrl: string) {
    const server = await this.prisma.server.findUnique({
      where: {
        id: input.serverId,
      },
    });
    if (!server) throw Error('Server not found');
    return this.prisma.server.update({
      where: {
        id: server.id,
      },
      data: {
        name: input.name,
        imageUrl,
      },
    });
  }

  async createChannel(input: CreateChannelOnServerDto, email: string) {
    if (!input.name) throw new Error('Channel name is required');

    const profile = await this.prisma.profile.findUnique({
      where: {
        email,
      },
    });
    if (!profile) throw new Error('Profile not found');

    return this.prisma.server.update({
      where: {
        id: input.serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          create: {
            name: input.name,
            profileId: profile.id,
            type: ChannelType[input.type],
          },
        },
      },
    });
  }

  async leaveServer(serverId: number, email: string) {
    const profile = await this.prisma.profile.findUnique({
      where: {
        email,
      },
    });
    console.log('serverId69', serverId, email);
    if (!profile) throw new Error('Profile not found');
    return this.prisma.server.update({
      where: {
        id: serverId,
      },
      data: {
        members: {
          deleteMany: {
            profileId: profile.id,
          },
        },
      },
    });
  }

  async deleteServer(serverId: number, email: string) {
    const profile = await this.prisma.profile.findUnique({
      where: {
        email,
      },
    });
    if (!profile) throw new Error('Profile not found');

    const server = await this.prisma.server.findUnique({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN],
            },
          },
        },
      },
    });

    if (!server) throw new Error('Server not found');
    await this.prisma.server.delete({
      where: {
        id: serverId,
      },
    });

    return 'Server deleted successfully';
  }

  async deleteChannelFromServer(channelId: number, email: string) {
    const profile = await this.prisma.profile.findUnique({
      where: {
        email,
      },
    });
    if (!profile) throw new Error('Profile not found');
    const channel = await this.prisma.channel.findUnique({
      where: {
        id: channelId,
        profileId: profile.id,
        NOT: {
          name: 'general',
        },
      },
    });

    if (!channel) throw new Error('Channel not found');
    await this.prisma.channel.delete({
      where: {
        id: channelId,
      },
    });
    return 'Channel deleted successfully';
  }
}
