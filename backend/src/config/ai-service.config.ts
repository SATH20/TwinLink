import { registerAs } from '@nestjs/config';

export default registerAs('aiService', () => ({
  url: process.env.AI_SERVICE_URL || 'http://localhost:8000',
  timeout: parseInt(process.env.AI_SERVICE_TIMEOUT || '30000', 10),
}));
