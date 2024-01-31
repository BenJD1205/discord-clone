import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProfileDto } from './dto/profile.dto';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async createProfile(data: CreateProfileDto) {
    const profile = await this.prisma.profile.findUnique({
      where: {
        email: data.email,
      },
    });
    if (profile) {
      return profile;
    }
    return this.prisma.profile.create({
      data,
    });
  }

  async getProfileById(id: number) {
    return this.prisma.profile.findUnique({
      where: {
        id,
      },
      include: {
        servers: {
          include: {
            channels: true,
          },
        },
      },
    });
  }

  async getProfileByEmail(email: string) {
    return this.prisma.profile.findUnique({
      where: {
        email,
      },
      include: {
        servers: {
          include: {
            channels: true,
          },
        },
      },
    });
  }
}
