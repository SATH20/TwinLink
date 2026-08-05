import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Interface representing the authenticated user payload.
 */
export interface AuthenticatedUser {
  userId: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

/**
 * Custom decorator to extract the current user from the request.
 * Requires the ClerkAuthGuard to attach the user object to the request.
 *
 * - `@CurrentUser()` returns the full AuthenticatedUser object.
 * - `@CurrentUser('userId')` returns a single property from the payload.
 */
export const CurrentUser = createParamDecorator(
  (data: keyof AuthenticatedUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: AuthenticatedUser = request.user;

    return data ? user?.[data] : user;
  },
);
