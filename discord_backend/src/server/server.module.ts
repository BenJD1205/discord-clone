import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ServerService } from './server.service';
import { ServerResolver } from './server.resolver';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [ServerService, ServerResolver, PrismaService, JwtService],
})
export class ServerModule {}
