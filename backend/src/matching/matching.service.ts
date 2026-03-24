import { Injectable } from '@nestjs/common';

@Injectable()
export class MatchingService {
  getMatches() {
    return { message: 'This will return twin matches' };
  }
}
