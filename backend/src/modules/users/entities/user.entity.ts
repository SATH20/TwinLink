export class User {
  id: string;
  email: string;
  name: string;
  clerkId: string;
  /** Optional unique TwinLink handle (app-level, not used for authentication). */
  username?: string;
  /** Optional contact phone (app-level, not an authentication factor). */
  phone?: string;
  createdAt: string;
  updatedAt: string;
}
