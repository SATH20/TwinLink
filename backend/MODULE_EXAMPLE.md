# Example Module: Twins Module

This shows how a complete NestJS module is structured.

## 1. Module File (`twins.module.ts`)

```typescript
import { Module } from '@nestjs/common';
import { TwinsController } from './twins.controller';
import { TwinsService } from './twins.service';

@Module({
  controllers: [TwinsController],  // Register controller
  providers: [TwinsService]        // Register service
})
export class TwinsModule {}
```

**Purpose**: Bundles the controller and service together.

---

## 2. Controller File (`twins.controller.ts`)

```typescript
import { Controller, Get } from '@nestjs/common';
import { TwinsService } from './twins.service';

@Controller('twins')  // Base route: /twins
export class TwinsController {
  constructor(private readonly twinsService: TwinsService) {}

  @Get()  // GET /twins
  findAll() {
    return this.twinsService.findAll();
  }
}
```

**Purpose**: Handles HTTP requests and routes them to the service.

---

## 3. Service File (`twins.service.ts`)

```typescript
import { Injectable } from '@nestjs/common';

@Injectable()
export class TwinsService {
  findAll() {
    // Business logic will go here
    return { message: 'This will return all digital twins' };
  }
}
```

**Purpose**: Contains business logic (database queries, calculations, etc.).

---

## How They Work Together

```
HTTP Request (GET /twins)
    ↓
TwinsController.findAll()
    ↓
TwinsService.findAll()
    ↓
Return Response
```

1. Client sends request to `/twins`
2. Controller receives it and calls the service
3. Service processes the logic
4. Response flows back to client

---

## All Four Modules Follow This Pattern

- `auth/` - Authentication (login, register)
- `twins/` - Digital twin management
- `matching/` - Matchmaking logic
- `simulations/` - Simulation processing

Each has the same structure: module, controller, service.
