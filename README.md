# 🤖 TwinLink - Because Regular Dating Apps Weren't Complicated Enough

> *Let AI versions of yourself do the awkward small talk. You're welcome.*

## What Even Is This?

Look, we've all been there. You match with someone, spend 3 days crafting the perfect opening message, they reply with "hey," and then... nothing. Exhausting, right?

So we built TwinLink. It's basically a dating app where your AI twin does all the talking for you. Your digital twin meets their digital twin, they chat, analyze compatibility, and THEN you decide if you want to actually meet the human. 

Think of it as having a really smart friend who pre-screens your dates, except the friend is an AI that knows literally everything about you. Not creepy at all!

## The Vibe

- ✨ Your AI twin talks to other AI twins (while you binge Netflix)
- 🧠 They analyze compatibility using ~fancy algorithms~ 
- 💬 Only talk to humans AFTER the AIs give it a thumbs up
- 🎯 Saves you from small talk with people who think pineapple belongs on pizza (it does, fight me)

## Tech Stack (For the Nerds)

**Frontend** (The Pretty Part)
- Next.js 15 - Because we like being on the bleeding edge
- TypeScript - JavaScript with commitment issues
- Tailwind CSS - Never writing vanilla CSS again
- Framer Motion - Making things go *whoosh*
- Clerk - Authentication that just works™

**Backend** (The Smart Part)
- NestJS 11 - Node.js with a suit and tie
- TypeScript - Again, because JavaScript can't be trusted
- Firebase Firestore - Because who needs SQL joins anyway?
- Redis + BullMQ - For jobs that need to happen... eventually
- FastAPI (Python) - Where the AI magic happens

**The AI Brain**
- OpenAI GPT-4 - The one that does all the work
- Anthropic Claude - Backup brain (because redundancy is sexy)
- Some really complex compatibility algorithms we definitely didn't steal from OkCupid

## Getting Started (aka "How Do I Run This Thing?")

### Step 0: Prerequisites

You'll need:
- Node.js 20+ (because we're fancy)
- Python 3.11+ (for the AI wizardry)
- Redis (it's like a really fast sticky note)
- A Firebase project (go make one, I'll wait)
- Clerk account (free tier works, we're not monsters)
- Coffee ☕ (required, not optional)

### Step 1: Clone This Bad Boy

```bash
git clone <your-repo-url>
cd twinlink
```

### Step 2: Backend Setup

```bash
cd backend

# Install stuff
npm install -g pnpm  # if you don't have it
pnpm install

# Copy the .env file
cp .env.example .env

# Now edit .env with your actual keys
# (Yes, you have to get them yourself. We're not giving you ours.)

# Start the server
pnpm start:dev
```

The backend should now be running on `http://localhost:3001`. If it's not, check if something else is hogging that port. Looking at you, random Docker container.

### Step 3: AI Service Setup

```bash
cd fastapi-engine

# Make a virtual environment (trust me on this one)
python -m venv venv

# Activate it
# On Mac/Linux:
source venv/bin/activate
# On Windows (because someone has to use it):
venv\Scripts\activate

# Install the Python stuff
pip install -r requirements.txt

# Copy the .env
cp .env.example .env
# Edit it with your OpenAI/Anthropic keys

# Start the AI engine
uvicorn main:app --reload --port 8000
```

### Step 4: Frontend Setup

```bash
cd frontend

# Install dependencies
pnpm install

# Setup environment
cp .env.local.example .env.local
# Edit with your Clerk keys and backend URL

# Start the dev server
pnpm dev
```

Now visit `http://localhost:3000` and watch the magic happen (or the errors, probably errors at first).

### Step 5: Redis (Don't Skip This)

**Easy Mode (Docker):**
```bash
docker run -d --name redis -p 6379:6379 redis:7-alpine
```

**Hard Mode (Local Install):**
- Install Redis from their website
- Run `redis-server`
- Wonder why you didn't just use Docker

## Project Structure (For When You Inevitably Get Lost)

```
twinlink/
├── backend/              # NestJS backend (Node.js stuff)
│   ├── src/
│   │   ├── modules/      # All the backend logic
│   │   │   ├── auth/     # Login things
│   │   │   ├── twins/    # Digital twin magic
│   │   │   ├── matching/ # The matchmaking algorithm
│   │   │   └── ...       # More modules than you want to know about
│   │   └── main.ts       # Where it all begins
│   └── ...
│
├── frontend/             # Next.js frontend (The pretty UI)
│   ├── app/              # Pages (App Router because we're masochists)
│   │   ├── recommendations/ # See your matches
│   │   ├── twin-conversation/ # Watch AIs chat
│   │   └── chat/         # Actually talk to humans
│   ├── components/       # Reusable UI bits
│   └── ...
│
├── fastapi-engine/       # Python AI service (The brain)
│   ├── main.py           # FastAPI app
│   ├── services/         # AI logic lives here
│   └── ...
│
└── README.md             # You are here!
```

## The Flow (How This Actually Works)

1. **You sign up** - Create an account, fill out your profile (age, interests, that jazz)

2. **Create your AI twin** - The AI generates a digital version of you based on your profile. Don't worry, it won't steal your identity. Probably.

3. **Start matching** - Click a button, your twin goes out and finds other twins to chat with

4. **AI Conversations** - Your twin and their twin have a little chat. It's like speed dating but with 100% more robots

5. **Compatibility Analysis** - The AIs analyze how well you'd get along. Using ~science~ and ~algorithms~

6. **Accept/Reject** - If the compatibility is good (70%+), you can accept the introduction

7. **Human Chat** - NOW you can talk to the actual human. Wild concept, I know.

## Features (The Cool Stuff)

### ✅ What Works Right Now

- User authentication (Clerk makes this stupidly easy)
- Profile creation with personality traits, interests, values
- Digital twin generation (powered by GPT-4)
- AI-to-AI conversations (yes, they actually talk to each other)
- Compatibility scoring (with detailed analysis)
- Match recommendations
- Connection requests (like friend requests but more desperate)
- Notifications (so you know when someone likes your AI)
- Human chat (for when you're ready to adult)

### 🚧 What's Coming (Maybe)

- Voice messages between twins
- Group conversations (because why not?)
- Video calls (once we're brave enough)
- Better matching algorithm (it's pretty good already though)
- Mobile app (React Native? Flutter? Carrier pigeon?)

## API Documentation

Once everything's running:

- **Backend API Docs**: http://localhost:3001/api/docs
- **AI Service Docs**: http://localhost:8000/docs
- **Frontend**: http://localhost:3000

Swagger UI has all the endpoints documented. Click around, you can't break anything. (Okay, you probably can, but that's on you.)

## Common Issues (Because Things Always Break)

### "Port 3001 is already in use"
Something else is using that port. Kill it:
```bash
# Find what's using it
lsof -i :3001  # Mac/Linux
netstat -ano | findstr :3001  # Windows

# Kill it
kill -9 <PID>  # Mac/Linux
taskkill /PID <PID> /F  # Windows
```

### "Cannot find module..."
Did you run `pnpm install`? Like, actually run it?

### "Firebase initialization failed"
Check your `private.json` file exists and has valid credentials. Also make sure you're not accidentally committing it to git (please don't).

### "AI service not responding"
Is the FastAPI server running? Is it on port 8000? Did you set your OpenAI API key? These are the deep questions.

### "Everything is broken"
1. Turn it off
2. Turn it back on
3. Still broken? Check the console logs
4. Still broken? Check if Redis is running
5. Still broken? It's probably environment variables
6. Still BROKEN? Time to ask Stack Overflow

## Environment Variables (The Secrets)

You need to set these up in `.env` files. Don't commit them to git. Seriously.

**Backend (.env):**
```env
PORT=3001
NODE_ENV=development
CLERK_SECRET_KEY=your_clerk_secret
FIREBASE_PROJECT_ID=your_project
# ... and like 20 more
```

**Frontend (.env.local):**
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
NEXT_PUBLIC_API_URL=http://localhost:3001
# ... etc
```

Check the `.env.example` files for the full list. There are... many.

## Testing

```bash
# Backend tests
cd backend
pnpm test

# Frontend tests (we should probably write some)
cd frontend
pnpm test
```

Do we have 100% test coverage? Haha, no. Do we have some tests? Also no. Should we? Yes. Will we? Eventually.

## Contributing

Found a bug? Want to add a feature? Here's how:

1. Fork it
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
6. Wait for review (we promise to be nice)

## Deployment (Making It Live)

Check the individual README files in `backend/` and `frontend/` for deployment instructions. Spoiler: it involves Docker, environment variables, and mild panic.

## License

This is currently unlicensed private code. Don't steal it. We'll know. We have AIs watching.

## FAQ

**Q: Is this better than Tinder?**  
A: Define "better." You definitely swipe less.

**Q: Will my AI twin be smarter than me?**  
A: Probably not, it's based on your profile after all.

**Q: Can I date the AI instead of the human?**  
A: No. Touch grass.

**Q: How much does this cost?**  
A: Free for now. OpenAI API costs though... *sweats in API calls*

**Q: Is my data safe?**  
A: It's in Firebase with proper auth. Safer than your Instagram DMs.

**Q: Can I customize my twin's personality?**  
A: It's based on your profile, so technically yes.

**Q: What if the AIs fall in love?**  
A: We're not prepared for that scenario.

## Credits

Built with ☕, 🎵, and a concerning amount of Stack Overflow by the TwinLink team.

Special thanks to:
- OpenAI for GPT-4 (you're doing great sweetie)
- The NestJS team for making Node.js bearable
- Whoever invented TypeScript
- Coffee (the real MVP)

---

**Need help?** Open an issue. We'll probably see it eventually.

**Found a bug?** Congratulations! Open an issue or fix it and get eternal glory in the contributors list.

**Want to say hi?** Sure, but like, why?

Now go forth and let AI do your dating for you. What could possibly go wrong? 🚀
