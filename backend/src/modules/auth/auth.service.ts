import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Syncs a Clerk user with Firestore.
   * Creates the user if they do not exist, and backfills a missing display name.
   * @param clerkUserId Clerk user ID
   * @param email User email
   * @param firstName User first name (from token claims, may be empty)
   * @param lastName User last name (from token claims, may be empty)
   * @param providedName Full name supplied by the client (from Clerk profile)
   * @returns User object and isNewUser flag
   */
  async syncUser(
    clerkUserId: string,
    email: string,
    firstName?: string,
    lastName?: string,
    providedName?: string,
  ) {
    // Prefer the explicitly provided name, fall back to token claim parts.
    const resolvedName =
      (providedName && providedName.trim()) ||
      [firstName, lastName].filter(Boolean).join(' ').trim();

    let user = await this.usersService.findByClerkId(clerkUserId);
    let isNewUser = false;

    if (!user) {
      user = await this.usersService.createUser({
        clerkId: clerkUserId,
        email,
        name: resolvedName || 'Anonymous',
      });
      isNewUser = true;
    } else if (
      resolvedName &&
      (!user.name || user.name.trim() === '' || user.name === 'Anonymous')
    ) {
      // Backfill a real name for users previously created without one.
      user = await this.usersService.updateUser(clerkUserId, { name: resolvedName });
    }

    return { user, isNewUser };
  }

  /**
   * Validates if a user exists in the system by their Clerk ID.
   * @param userId Clerk user ID
   * @returns The user object
   * @throws NotFoundException if user is not found
   */
  async validateUser(userId: string) {
    const user = await this.usersService.findByClerkId(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
