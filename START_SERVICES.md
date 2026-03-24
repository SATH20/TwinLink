# Start TwinLink Services

## Terminal 1: FastAPI (Port 8000)
```bash
cd fastapi-engine
python -m uvicorn main:app --reload --port 8000
```

## Terminal 2: NestJS Backend (Port 3000)
```bash
cd backend
npm run start:dev
```

## Terminal 3: Next.js Frontend (Port 3001)
```bash
cd twinlink
npm run dev
```

## Test Integration

```bash
curl -X POST http://localhost:3000/twin/create \
  -H "Content-Type: application/json" \
  -d '{
    "interests": ["coding", "music"],
    "communicationStyle": "direct",
    "goals": "Find meaningful connections",
    "personality": {"openness": 0.8, "extraversion": 0.6}
  }'
```

## Architecture

```
Next.js Frontend (3001)
    ↓
NestJS Backend (3000)
    ↓
FastAPI AI Engine (8000)
```
