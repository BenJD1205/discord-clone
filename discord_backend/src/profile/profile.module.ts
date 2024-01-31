import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProfileService } from './profile.service';
import { ProfileResolver } from './profile.resolver';

@Module({
  providers: [ProfileService, ProfileResolver, PrismaService, JwtService],
})
export class ProfileModule {}
