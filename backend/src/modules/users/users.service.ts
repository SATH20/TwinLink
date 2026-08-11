import {
  Injectable,
  NotFoundException,
  ConflictException,
  Inject,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { createClerkClient } from '@clerk/backend';
import { UsersRepository } from './users.repository';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { FIRESTORE } from '../../firebase/firebase.constants';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly usersRepository: UsersRepository,
    @Inject(FIRESTORE) private readonly firestore: admin.firestore.Firestore,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Gets the current user by their Clerk ID.
   * @param clerkId The Clerk ID of the user
   * @returns The user entity
   * @throws NotFoundException if user is not found
   */
  async getCurrentUser(clerkId: string): Promise<User> {
    const user = await this.usersRepository.findByClerkId(clerkId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  /**
   * Updates a user's details. Enforces username uniqueness across TwinLink.
   * @param clerkId The Clerk ID of the user to update
   * @param dto The update data
   * @returns The updated user entity
   */
  async updateUser(clerkId: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.getCurrentUser(clerkId);

    // Enforce unique usernames (case-insensitive) when a username is supplied
    // and it actually changes.
    if (dto.username !== undefined && dto.username !== null && dto.username !== '') {
      const normalized = dto.username.trim();
      if (normalized.toLowerCase() !== (user.username || '').toLowerCase()) {
        const existing = await this.usersRepository.findByUsername(normalized);
        if (existing && existing.id !== user.id) {
          throw new ConflictException('That username is already taken');
        }
      }
      dto = { ...dto, username: normalized };
    }

    const updateData = {
      ...dto,
      updatedAt: new Date().toISOString(),
    };
    await this.usersRepository.update(user.id, updateData);
    return this.getCurrentUser(clerkId);
  }

  /**
   * Creates a new user.
   * @param data The user data including clerkId, email, and name
   * @returns The created user entity
   */
  async createUser(data: { clerkId: string; email: string; name: string }): Promise<User> {
    const now = new Date().toISOString();
    const newUser = {
      ...data,
      createdAt: now,
      updatedAt: now,
    };
    return this.usersRepository.create(newUser as Partial<User>);
  }

  /**
   * Finds a user by their Clerk ID.
   * @param clerkId The Clerk ID to search for
   * @returns The user entity or null
   */
  async findByClerkId(clerkId: string): Promise<User | null> {
    return this.usersRepository.findByClerkId(clerkId);
  }

  /**
   * Permanently delete a user's TwinLink account and all associated data.
   *
   * Deletes, in order:
   *  - the user's profile(s) and Digital Twin(s)
   *  - connections the user is part of (and their chat messages)
   *  - matches / conversations / notifications tied to the user
   *  - the user document itself
   *  - the Clerk user (best-effort; only if the backend has the secret key)
   *
   * The `userId` stored on every collection is the Clerk id (payload.sub), the
   * same mapping used by Human Chat and Connections.
   */
  async deleteAccount(clerkId: string): Promise<{ deleted: boolean }> {
    const user = await this.usersRepository.findByClerkId(clerkId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const db = this.firestore;

    // Helper: delete every doc returned by a query.
    const deleteQuery = async (
      collection: string,
      field: string,
      value: string,
    ): Promise<admin.firestore.QueryDocumentSnapshot[]> => {
      const snap = await db.collection(collection).where(field, '==', value).get();
      await Promise.all(snap.docs.map((d) => d.ref.delete()));
      return snap.docs;
    };

    try {
      // Profiles & Twins
      await deleteQuery('profiles', 'userId', clerkId);
      await deleteQuery('twins', 'userId', clerkId);

      // Connections (both directions) + their chat messages
      const connSnaps = [
        ...(await db.collection('connections').where('currentUserId', '==', clerkId).get()).docs,
        ...(await db.collection('connections').where('targetUserId', '==', clerkId).get()).docs,
      ];
      for (const conn of connSnaps) {
        const msgs = await db.collection('messages').where('connectionId', '==', conn.id).get();
        await Promise.all(msgs.docs.map((m) => m.ref.delete()));
        await conn.ref.delete();
      }

      // Matches, conversations, notifications
      await deleteQuery('matches', 'userA', clerkId);
      await deleteQuery('matches', 'userB', clerkId);
      await deleteQuery('conversations', 'userA', clerkId);
      await deleteQuery('conversations', 'userB', clerkId);
      await deleteQuery('notifications', 'userId', clerkId);

      // Finally the user document
      await db.collection('users').doc(user.id).delete();
    } catch (error: any) {
      this.logger.error(`Failed to delete user data for ${clerkId}: ${error?.message}`);
      throw error;
    }

    // Best-effort: delete the Clerk user so authentication is fully removed.
    const secretKey = this.configService.get<string>('CLERK_SECRET_KEY');
    if (secretKey) {
      try {
        const clerk = createClerkClient({ secretKey });
        await clerk.users.deleteUser(clerkId);
        this.logger.log(`Deleted Clerk user ${clerkId}`);
      } catch (error: any) {
        // Non-fatal: app data is already removed. The user simply won't have a
        // TwinLink record on next sign-in.
        this.logger.warn(`Could not delete Clerk user ${clerkId}: ${error?.message}`);
      }
    }

    return { deleted: true };
  }
}
