# TwinLink Backend - NestJS Foundation

## Project Structure

```
backend/
├── src/
│   ├── auth/                    # Authentication module
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   └── auth.service.ts
│   ├── twins/                   # Digital Twins module
│   │   ├── twins.module.ts
│   │   ├── twins.controller.ts
│   │   └── twins.service.ts
│   ├── matching/                # Matchmaking module
│   │   ├── matching.module.ts
│   │   ├── matching.controller.ts
│   │   └── matching.service.ts
│   ├── simulations/             # Simulations module
│   │   ├── simulations.module.ts
│   │   ├── simulations.controller.ts
│   │   └── simulations.service.ts
│   ├── app.module.ts            # Root module
│   └── main.ts                  # Application entry point
├── package.json
└── tsconfig.json
```

## What is a Module in NestJS?

A **module** is a class with the `@Module()` decorator. It organizes your application into logical sections.

Think of it like a folder that groups related features together:
- The `auth` module handles everything about authentication
- The `twins` module manages digital twin data
- The `matching` module handles matchmaking logic
- The `simulations` module runs twin simulations

## Role of Controller

A **controller** handles incoming HTTP requests and returns responses to the client.

```typescript
@Controller('twins')  // Routes start with /twins
export class TwinsController {
  @Get()  // GET /twins
  findAll() {
    return this.twinsService.findAll();
  }
}
```

Controllers define your API endpoints (routes).

## Role of Service

A **service** contains the business logic. It's where you write the actual functionality.

```typescript
@Injectable()
export class TwinsService {
  findAll() {
    // Business logic goes here
    // Database queries, calculations, etc.
    return { message: 'This will return all digital twins' };
  }
}
```

Services are injected into controllers using dependency injection.

## How Modules Connect

All modules are imported into `app.module.ts`:

```typescript
@Module({
  imports: [AuthModule, TwinsModule, MatchingModule, SimulationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

## Running the Backend

```bash
cd backend

# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

The server runs on `http://localhost:3000`

## Available Routes (Placeholder)

- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /twins` - Get all digital twins
- `GET /matching` - Get matches
- `GET /simulations` - Get simulations

## Next Steps

1. Add DTOs (Data Transfer Objects) for request/response validation
2. Connect to Firebase
3. Implement business logic in services
4. Add authentication guards
5. Connect to FastAPI AI engine
