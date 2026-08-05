import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProfilesService } from './profiles.service';
import { ProfilesController } from './profiles.controller';
import { ProfilesRepository } from './profiles.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [ConfigModule, AuthModule],
  controllers: [ProfilesController],
  providers: [ProfilesService, ProfilesRepository],
  exports: [ProfilesService],
})
export class ProfilesModule {}
