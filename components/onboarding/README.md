# Onboarding Components

This directory contains the interactive onboarding flow components for TwinLink's digital twin creation process.

## Components

### OnboardingLayout
- Main orchestrator for the 5-step onboarding flow
- Manages state and navigation between steps
- Handles data collection and validation
- Redirects to dashboard upon completion

### ProgressBar
- Visual progress indicator showing current step
- Displays percentage completion
- Gradient progress bar with smooth animations

### OptionCard
- Selectable card component for single-choice questions
- Hover and selection animations
- Check mark indicator for selected state
- Theme-aware styling

### ChipSelector
- Multi-select chip component for interests
- Toggle selection with smooth animations
- Responsive layout with flex wrap
- Visual feedback for selected/unselected states

### PersonalitySlider
- Interactive range slider for personality traits
- Real-time value updates
- Visual feedback with color changes
- Custom styled thumb and track

## Onboarding Flow

### Step 1: Role Selection
- Question: "What best describes you?"
- Options: Student, Developer, Entrepreneur, Designer, Other
- Single selection with icon cards

### Step 2: Interests
- Question: "What are your interests?"
- Options: Gaming, Technology, AI, Movies, Music, Sports, Reading, Travel
- Multi-select chips

### Step 3: Conversation Style
- Question: "How do you like conversations?"
- Options: Deep discussions, Casual chats, Collaborative problem solving, Humorous conversations
- Single selection cards

### Step 4: Looking For
- Question: "What are you looking for?"
- Options: Friends, Networking, Tech partners, Gaming buddies, Dating
- Single selection cards

### Step 5: Personality Traits
- Question: "Tell us about your personality"
- Three sliders:
  - Introvert ←→ Extrovert
  - Analytical ←→ Creative
  - Serious ←→ Playful

## Features

- **Smooth Animations**: Framer Motion for page transitions
- **Progress Tracking**: Visual progress bar with percentage
- **Validation**: Step-by-step validation before proceeding
- **Theme Support**: Full light/dark mode compatibility
- **Responsive Design**: Mobile-first approach
- **Interactive Elements**: Hover effects and micro-interactions
- **State Management**: Centralized data collection

## Usage

```tsx
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';

export default function OnboardingPage() {
  return <OnboardingLayout />;
}
```

## Data Structure

```typescript
interface OnboardingData {
  role: string;
  interests: string[];
  conversationStyle: string;
  lookingFor: string;
  personality: {
    introvertExtrovert: number;
    analyticalCreative: number;
    seriousPlayful: number;
  };
}
```

## Styling

All components follow the TwinLink design system:
- Atomic Cobalt & Emerald color palette
- Consistent spacing and typography
- Smooth transitions (300ms duration)
- Theme-aware color schemes
- Interactive hover states