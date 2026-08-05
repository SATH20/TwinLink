import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Syncs a Clerk user with Firestore.
   * Creates the user if they do not exist.
   * @param clerkUserId Clerk user ID
   * @param email User email
   * @param firstName User first name
   * @param lastName User last name
   * @returns User object and isNewUser flag
   */
  async syncUser(clerkUserId: string, email: string, firstName?: string, lastName?: string) {
    let user = await this.usersService.findByClerkId(clerkUserId);
    let isNewUser = false;

    if (!user) {
      const name = [firstName, lastName].filter(Boolean).join(' ');
      user = await this.usersService.createUser({
        clerkId: clerkUserId,
        email,
        name: name || 'Anonymous',
      });
      isNewUser = true;
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
