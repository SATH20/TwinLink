# TwinLink - AI-Powered Matchmaking Platform

A modern, visually stunning landing page for TwinLink, an AI-powered matchmaking platform where users create digital twins that interact to evaluate compatibility before real connections.

## Features

- 🎨 Modern, futuristic UI with glassmorphism effects
- 🌓 Dark/Light theme switching with smooth transitions
- ✨ Smooth animations using Framer Motion
- 🎯 Responsive design for all devices
- 🚀 Built with Next.js 15 (App Router) and Tailwind CSS
- 💫 Gradient effects and glowing animations
- 🎭 Premium AI SaaS aesthetic

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Theme**: next-themes
- **Icons**: Lucide React
- **Language**: TypeScript

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
twinlink/
├── app/
│   ├── layout.tsx          # Root layout with theme provider
│   ├── page.tsx            # Main landing page
│   ├── globals.css         # Global styles
│   └── providers.tsx       # Theme provider wrapper
├── components/
│   ├── Navbar.tsx          # Navigation with theme toggle
│   ├── Hero.tsx            # Hero section with animations
│   ├── HowItWorks.tsx      # Three-step process section
│   ├── Features.tsx        # Features showcase
│   ├── CTA.tsx             # Call-to-action section
│   └── Footer.tsx          # Footer component
└── tailwind.config.ts      # Tailwind configuration
```

## Theme Switching

The landing page supports three theme modes:
- **Dark Mode**: Futuristic AI aesthetic with deep dark backgrounds
- **Light Mode**: Clean, modern social platform look
- **System**: Automatically matches your system preference

Toggle between themes using the sun/moon icon in the navbar.

## Color Palette

- **Primary Gradient**: Indigo (#6366F1) → Purple (#8B5CF6)
- **Accent**: Pink (#EC4899)
- **Dark Background**: Slate (#0F172A)
- **Light Background**: White (#FFFFFF)

## Customization

To customize the design:

1. **Colors**: Edit `tailwind.config.ts` and component gradient classes
2. **Animations**: Modify animation keyframes in `tailwind.config.ts`
3. **Content**: Update text and descriptions in component files
4. **Layout**: Adjust spacing and sizing in component JSX

## Build for Production

```bash
npm run build
npm start
```

## License

MIT
