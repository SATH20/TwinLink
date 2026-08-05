import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { verifyToken } from '@clerk/backend';
import { AuthenticatedUser } from '../interfaces/auth-user.interface';

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid token');
    }

    const token = authHeader.split(' ')[1];
    const secretKey = this.configService.get<string>('CLERK_SECRET_KEY');

    if (!secretKey) {
      throw new UnauthorizedException('Clerk secret key is missing');
    }

    try {
      const payload = await verifyToken(token, { secretKey });
      
      const user: AuthenticatedUser = {
        userId: payload.sub,
        email: payload.email as string || '',
        firstName: payload.firstName as string | undefined,
        lastName: payload.lastName as string | undefined,
      };

      request.user = user;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
