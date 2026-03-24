import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  login() {
    return { message: 'This will handle user login' };
  }

  register() {
    return { message: 'This will handle user registration' };
  }
}
