import { UseGuards } from '@nestjs/common';
import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { ProfileService } from './profile.service';
import { Profile } from './types/profile.types';
import { CreateProfileDto } from './dto/profile.dto';
import { GraphqlAuthGuard } from 'src/auth/auth.guard';

@Resolver()
export class ProfileResolver {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Profile)
  async createProfile(@Args('input') data: CreateProfileDto) {
    return this.profileService.createProfile(data);
  }

  @Query(() => Profile)
  async getProfileById(@Args('profileId') id: number) {
    return this.profileService.getProfileById(id);
  }
}
