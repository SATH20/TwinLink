# TwinLink Backend

> **AI-Powered Digital Twin Network** — Production-ready backend for autonomous AI agents that evaluate human compatibility.

[![NestJS](https://img.shields.io/badge/NestJS-11-red?style=flat-square&logo=nestjs)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore-orange?style=flat-square&logo=firebase)](https://firebase.google.com/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-green?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js Frontend                          │
│              (Clerk Auth → JWT Tokens)                       │
└─────────────────────┬───────────────────────────────────────┘
                      │ HTTP + Bearer JWT
┌─────────────────────▼───────────────────────────────────────┐
│                   NestJS Backend (Port 3001)                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐   │
│  │   Auth   │ │  Users   │ │ Profiles │ │   Twins      │   │
│  │  Module  │ │  Module  │ │  Module  │ │   Module     │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────┘   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐   │
│  │ Matching │ │  Conver- │ │ Compat-  │ │ Notification │   │
│  │  Engine  │ │  sation  │ │ ibility  │ │   Module     │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────┘   │
│  ┌──────────┐ ┌────────────────────────────┐                │
│  │Scheduler │ │   AI Module (HTTP Client)  │───────┐        │
│  └──────────┘ └────────────────────────────┘       │        │
│                          │                          │        │
│               ┌──────────▼──────────┐              │        │
│               │  Firebase Firestore │              │        │
│               └─────────────────────┘              │        │
└────────────────────────────────────────────────────┼────────┘
                                                     │ HTTP
                      ┌──────────────────────────────▼────────┐
                      │      FastAPI AI Engine (Port 8000)     │
                      │  ┌──────────┐ ┌───────────────────┐   │
                      │  │  Twin    │ │  Conversation     │   │
                      │  │Generator │ │  Simulator        │   │
                      │  └──────────┘ └───────────────────┘   │
                      │  ┌───────────────────────────────┐    │
                      │  │  Compatibility Analyzer       │    │
                      │  └───────────────────────────────┘    │
                      └───────────────────────────────────────┘
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend Framework | NestJS 11 + TypeScript |
| AI Service | FastAPI (Python) |
| Authentication | Clerk |
| Database | Firebase Firestore |
| Background Jobs | BullMQ + Redis |
| Validation | class-validator + class-transformer |
| API Docs | Swagger (OpenAPI 3.0) |
| Containerization | Docker + Docker Compose |

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm (`npm install -g pnpm`)
- Python 3.11+
- Redis (local or Docker)
- Firebase project with Firestore enabled
- Clerk account with API keys

### 1. Backend Setup

```bash
cd backend

# Install dependencies
pnpm install

# Configure environment
cp .env.example .env
# Edit .env with your actual values (Clerk keys, Firebase path, etc.)

# Start development server
pnpm start:dev
```

### 2. FastAPI AI Service Setup

```bash
cd fastapi-engine

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env

# Start development server
uvicorn main:app --reload --port 8000
```

### 3. Redis (for BullMQ scheduler)

```bash
# Using Docker
docker run -d --name redis -p 6379:6379 redis:7-alpine

# Or install locally and start
redis-server
```

### 4. Docker Compose (all services)

```bash
cd backend
docker-compose up -d
```

## API Documentation

Once running, visit:
- **Swagger UI**: [http://localhost:3001/api/docs](http://localhost:3001/api/docs)
- **Health Check**: [http://localhost:3001/v1/health](http://localhost:3001/v1/health)

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/v1/auth/register` | Register/sync user from Clerk |
| POST | `/v1/auth/login` | Login and check user status |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/v1/users/me` | Get current user |
| PUT | `/v1/users/me` | Update current user |

### Profiles
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/v1/profiles/me` | Get current user's profile |
| PUT | `/v1/profiles/me` | Update profile |

### Digital Twins
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/v1/twins/create` | Create a Digital Twin |
| GET | `/v1/twins/me` | Get your twin |
| PUT | `/v1/twins/me` | Update your twin |

### Matching
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/v1/matching/start` | Start matching process |
| GET | `/v1/matching/recommendations` | Get recommendations |
| GET | `/v1/matching/history` | Get match history |

### Conversations
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/v1/conversation/start` | Start twin-to-twin conversation |

### Compatibility
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/v1/compatibility/analyze` | Analyze compatibility |

### Notifications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/v1/notifications` | Get all notifications |
| GET | `/v1/notifications/unread` | Get unread notifications |
| PATCH | `/v1/notifications/:id/read` | Mark as read |

### Health
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/v1/health` | System health check |
| GET | `/v1/health/live` | Liveness probe |

## Project Structure

```
backend/src/
├── main.ts                          # Application bootstrap
├── app.module.ts                    # Root module
├── health.controller.ts             # Health check endpoints
│
├── common/                          # Shared infrastructure
│   ├── constants/index.ts           # App-wide constants
│   ├── decorators/                  # Custom decorators
│   ├── dto/                         # Shared DTOs
│   ├── filters/                     # Exception filters
│   ├── interceptors/                # Request/response interceptors
│   ├── interfaces/                  # Shared interfaces
│   ├── pipes/                       # Validation pipes
│   ├── utils/                       # Utility functions
│   └── common.module.ts             # Global module
│
├── config/                          # Configuration
│   ├── app.config.ts
│   ├── firebase.config.ts
│   ├── redis.config.ts
│   ├── ai-service.config.ts
│   ├── clerk.config.ts
│   └── index.ts
│
├── firebase/                        # Firebase infrastructure
│   ├── firebase.module.ts
│   ├── firebase.service.ts          # Firestore initialization
│   └── firebase.repository.ts       # Generic base repository
│
└── modules/
    ├── auth/                        # Authentication
    ├── users/                       # User management
    ├── profiles/                    # Profile management
    ├── twins/                       # Digital Twin lifecycle
    ├── ai/                          # AI service orchestration
    ├── matching/                    # Matching engine
    ├── conversation/                # Conversation orchestration
    ├── compatibility/               # Compatibility analysis
    ├── notifications/               # Notifications
    └── scheduler/                   # Twin wake scheduler
```

## Design Principles

### Modular Monolith
Each module is independently deployable. Modules communicate through exported services, not shared state. This enables future extraction to microservices without rewriting.

### Repository Pattern
All Firestore access goes through repositories that extend `FirebaseRepository<T>`. This decouples business logic from data access, enabling easy testing and potential database migration.

### Deterministic Matching Pipeline
The matching engine uses a 9-stage filter pipeline:
1. Intent matching
2. Age compatibility (mutual)
3. Gender preference (mutual)
4. Location proximity (Haversine)
5. Language overlap
6. Deal breaker check
7. Interest scoring (Jaccard)
8. Values alignment
9. Weighted composite scoring

AI is only invoked for top candidates who pass all filters, saving API costs.

### Clean Separation of AI
NestJS contains **zero AI logic**. The AI module is a pure HTTP orchestration layer that marshals requests to FastAPI. All intelligence lives in the Python service.

## Environment Variables

See [.env.example](./.env.example) for all required configuration.

## License

UNLICENSED — Private
