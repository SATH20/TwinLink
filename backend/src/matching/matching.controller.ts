import { Controller, Get } from '@nestjs/common';
import { MatchingService } from './matching.service';

@Controller('matching')
export class MatchingController {
  constructor(private readonly matchingService: MatchingService) {}

  @Get()
  getMatches() {
    return this.matchingService.getMatches();
  }
}
