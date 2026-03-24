import { Injectable } from '@nestjs/common';

@Injectable()
export class TwinsService {
  findAll() {
    return { message: 'This will return all digital twins' };
  }
}
