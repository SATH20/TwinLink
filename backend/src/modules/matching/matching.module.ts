import { Module, forwardRef } from '@nestjs/common';
import { MatchingController } from './matching.controller';
import { MatchingService } from './matching.service';
import { MatchingRepository } from './matching.repository';
import { CandidateFilterEngine } from './engine/candidate-filter.engine';
import { ScoringEngine } from './engine/scoring.engine';
import { FirebaseModule } from '../../firebase/firebase.module';
import { ProfilesModule } from '../profiles/profiles.module';
import { TwinsModule } from '../twins/twins.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    FirebaseModule,
    ProfilesModule,
    forwardRef(() => TwinsModule),
    NotificationsModule,
  ],
  controllers: [MatchingController],
  providers: [
    MatchingService,
    MatchingRepository,
    CandidateFilterEngine,
    ScoringEngine,
  ],
  exports: [MatchingService],
})
export class MatchingModule {}
