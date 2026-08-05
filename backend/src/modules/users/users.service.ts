import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

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
   * Updates a user's details.
   * @param clerkId The Clerk ID of the user to update
   * @param dto The update data
   * @returns The updated user entity
   */
  async updateUser(clerkId: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.getCurrentUser(clerkId);
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
}
