import { Controller, Get } from '@nestjs/common';
import { SimulationsService } from './simulations.service';

@Controller('simulations')
export class SimulationsController {
  constructor(private readonly simulationsService: SimulationsService) {}

  @Get()
  getSimulations() {
    return this.simulationsService.getSimulations();
  }
}
