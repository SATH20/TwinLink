import { registerAs } from '@nestjs/config';

export default registerAs('clerk', () => ({
  secretKey: process.env.CLERK_SECRET_KEY,
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
}));
