import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TwinsModule } from './twins/twins.module';
import { MatchingModule } from './matching/matching.module';
import { SimulationsModule } from './simulations/simulations.module';

@Module({
  imports: [AuthModule, TwinsModule, MatchingModule, SimulationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
