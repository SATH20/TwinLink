import { Injectable, Logger, HttpException, GatewayTimeoutException, ServiceUnavailableException, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { GenerateTwinRequestDto } from './dto/generate-twin-request.dto';
import { ConversationRequestDto } from './dto/conversation-request.dto';
import { CompatibilityRequestDto } from './dto/compatibility-request.dto';
import { GenerateTwinResponse, ConversationResponse, CompatibilityResponse } from './interfaces/ai-response.interface';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly aiServiceUrl: string;
  private readonly requestTimeout: number;
  private readonly maxRetries: number;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.aiServiceUrl = this.configService.get<string>('AI_SERVICE_URL', 'http://localhost:8000');
    this.requestTimeout = this.configService.get<number>('AI_SERVICE_TIMEOUT', 30000);
    this.maxRetries = this.configService.get<number>('AI_SERVICE_MAX_RETRIES', 3);
  }

  /**
   * Calls the AI service to generate a twin prompt
   * @param data The user profile data
   * @returns The generated twin response
   */
  async generateTwin(data: GenerateTwinRequestDto): Promise<GenerateTwinResponse> {
    return this.postRequest<GenerateTwinResponse>('/generate-twin', data);
  }

  /**
   * Calls the AI service to run a conversation between two twins
   * @param data The conversation data
   * @returns The conversation response
   */
  async runConversation(data: ConversationRequestDto): Promise<ConversationResponse> {
    if (!data.maxTurns) data.maxTurns = 10;
    return this.postRequest<ConversationResponse>('/conversation', data);
  }

  /**
   * Calls the AI service to analyze compatibility between two twins
   * @param data The compatibility request data
   * @returns The compatibility response
   */
  async analyzeCompatibility(data: CompatibilityRequestDto): Promise<CompatibilityResponse> {
    return this.postRequest<CompatibilityResponse>('/compatibility', data);
  }

  /**
   * Helper method to make POST requests to the AI service with retry logic.
   *
   * Retries are only attempted for transient failures (network errors,
   * timeouts, and 5xx responses). Client errors (4xx) fail fast since
   * retrying an invalid request is pointless.
   */
  private async postRequest<T>(endpoint: string, data: any): Promise<T> {
    const url = `${this.aiServiceUrl}${endpoint}`;
    let attempt = 0;
    let lastError: any;

    while (attempt < this.maxRetries) {
      attempt++;
      try {
        const startTime = Date.now();
        this.logger.debug(`Sending request to ${url} (Attempt ${attempt}/${this.maxRetries})`);

        const response = await firstValueFrom(
          this.httpService.post<T>(url, data, { timeout: this.requestTimeout }),
        );

        const duration = Date.now() - startTime;
        this.logger.debug(`Received response from ${url} in ${duration}ms`);

        return response.data;
      } catch (error) {
        lastError = error;
        const message = error instanceof Error ? error.message : String(error);
        const stack = error instanceof Error ? error.stack : undefined;

        const retryable = this.isRetryable(error);
        this.logger.error(
          `Error requesting ${url} (attempt ${attempt}/${this.maxRetries}, retryable=${retryable}): ${message}`,
          stack,
        );

        // Fail fast on non-retryable errors or when retries are exhausted.
        if (!retryable || attempt >= this.maxRetries) {
          this.handleHttpError(error);
        }

        // Exponential backoff before the next attempt.
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }

    // Unreachable in practice: the loop either returns or throws above.
    this.handleHttpError(lastError);
  }

  /**
   * Determines whether an error is transient and worth retrying.
   * Retries: connection errors, timeouts, and 5xx responses.
   * Does not retry: 4xx client errors (bad/invalid requests).
   */
  private isRetryable(error: any): boolean {
    // No HTTP response received → network/connection/timeout issue.
    if (!error?.response) {
      const retryableCodes = [
        'ECONNREFUSED',
        'ECONNRESET',
        'ECONNABORTED',
        'ETIMEDOUT',
        'ENOTFOUND',
        'EAI_AGAIN',
        'EPIPE',
      ];
      if (error?.code && retryableCodes.includes(error.code)) {
        return true;
      }
      // Axios surfaces timeouts via message when no code is present.
      if (typeof error?.message === 'string' && error.message.toLowerCase().includes('timeout')) {
        return true;
      }
      // Unknown network-level failure without a response → treat as transient.
      return true;
    }

    // Retry only server-side errors.
    const status = error.response.status;
    return status >= 500 && status <= 599;
  }

  private handleHttpError(error: any): never {
    if (error?.code === 'ECONNREFUSED' || error?.code === 'ENOTFOUND') {
      this.logger.error(`AI service unreachable: ${error.code}`);
      throw new ServiceUnavailableException('AI service is currently unavailable');
    }

    if (
      error?.code === 'ECONNABORTED' ||
      error?.code === 'ETIMEDOUT' ||
      (typeof error?.message === 'string' && error.message.toLowerCase().includes('timeout'))
    ) {
      this.logger.error(`AI service timeout: ${error.code || error.message}`);
      throw new GatewayTimeoutException('AI service request timed out');
    }

    if (error?.response) {
      const status = error.response.status || 500;
      const data = error.response.data;

      // Log the full response from FastAPI for debugging
      this.logger.error(
        `AI service returned HTTP ${status}. Full response body: ${JSON.stringify(data, null, 2)}`,
      );

      // FastAPI 422 returns structured validation errors in 'detail' (array of objects)
      // Preserve the full detail so the caller can see exactly which fields failed
      let errorMessage: string;
      if (status === 422 && Array.isArray(data?.detail)) {
        const fieldErrors = data.detail.map((err: any) => {
          const loc = Array.isArray(err.loc) ? err.loc.join('.') : String(err.loc || '');
          return `${loc}: ${err.msg}`;
        });
        errorMessage = `AI service validation failed: ${fieldErrors.join('; ')}`;
        this.logger.error(`FastAPI 422 validation errors: ${fieldErrors.join('; ')}`);
      } else {
        errorMessage = data?.detail || data?.message || 'AI service error';
      }

      throw new HttpException(errorMessage, status);
    }

    this.logger.error(`Unexpected AI service error: ${error?.message || error}`);
    throw new InternalServerErrorException('An unexpected error occurred while communicating with the AI service');
  }

}
