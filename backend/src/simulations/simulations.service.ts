import { Injectable } from '@nestjs/common';

@Injectable()
export class SimulationsService {
  getSimulations() {
    return { message: 'This will return simulation data' };
  }
}
