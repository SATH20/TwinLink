import { Module } from '@nestjs/common';
import { SimulationsController } from './simulations.controller';
import { SimulationsService } from './simulations.service';

@Module({
  controllers: [SimulationsController],
  providers: [SimulationsService]
})
export class SimulationsModule {}
