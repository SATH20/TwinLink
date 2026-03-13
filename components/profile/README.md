# Digital Twin Profile Components

This directory contains components for displaying the AI-generated digital twin profile after onboarding completion.

## Components

### TwinProfileLayout
- Main layout component for the profile page
- Orchestrates all profile sections
- Handles navigation and actions
- Displays complete twin personality

### TwinAvatar
- Circular avatar with gradient background
- Displays user initials
- Animated entrance with spring effect
- Glow effect behind avatar
- Sparkle badge indicator
- Supports multiple sizes (sm, md, lg)

### TwinSummaryCard
- Displays AI-generated personality summary
- Brain icon with gradient background
- Card layout with shadow
- Animated entrance
- Theme-aware styling

### TraitBar
- Progress bar for personality traits
- Animated fill with gradient
- Percentage display
- Staggered animation delays
- Smooth transitions

### InterestChip
- Pill-shaped chip for interests
- Staggered entrance animations
- Blue accent colors
- Border styling
- Theme-aware

## Profile Sections

### 1. Header
- Back navigation button
- TwinLink branding
- Sticky positioning with backdrop blur

### 2. Avatar Section
- Large circular avatar with glow
- User name and title
- "Twin Active" status badge
- Centered layout

### 3. AI Summary
- Personality analysis card
- Brain icon indicator
- Detailed description text
- Professional card styling

### 4. Personality Traits
- Grid of trait progress bars
- Animated fill effects
- Percentage indicators
- Traits displayed:
  - Introversion
  - Creativity
  - Logic
  - Humor

### 5. Interests
- Flex-wrapped chip layout
- Multiple interest tags
- Staggered animations
- Responsive wrapping

### 6. Action Button
- "Start Twin Simulation" CTA
- Gradient emerald background
- Hover glow effect
- Scale animation on hover
- Routes to dashboard

## Features

- **Smooth Animations**: Framer Motion for all elements
- **Staggered Entrance**: Sequential component animations
- **Theme Support**: Full light/dark mode compatibility
- **Responsive Design**: Mobile-first approach
- **Interactive Elements**: Hover effects and transitions
- **Visual Hierarchy**: Clear information structure
- **Futuristic Design**: Modern AI aesthetic

## Data Structure

```typescript
interface TwinData {
  name: string;
  initials: string;
  summary: string;
  traits: Array<{
    label: string;
    value: number;
  }>;
  interests: string[];
}
```

## Usage

```tsx
import TwinProfileLayout from '@/components/profile/TwinProfileLayout';

export default function ProfilePage() {
  return <TwinProfileLayout />;
}
```

## Styling

All components follow the TwinLink design system:
- Atomic Cobalt & Emerald color palette
- Gradient backgrounds for emphasis
- Consistent spacing and typography
- Smooth transitions (300ms duration)
- Theme-aware color schemes
- Shadow and glow effects

## Animation Sequence

1. Avatar appears with spring animation (0s)
2. Title and status badge fade in (0.3s)
3. Summary card slides up (0.2s)
4. Traits section slides up (0.3s)
5. Individual trait bars animate (0.4s+)
6. Interests section slides up (0.5s)
7. Interest chips appear sequentially (0.6s+)
8. Action button slides up (0.7s)
9. Info text fades in (0.9s)

## Visual Effects

- **Glow Effects**: Behind avatar and on button hover
- **Gradient Fills**: Progress bars and backgrounds
- **Scale Animations**: Hover states on interactive elements
- **Blur Effects**: Backdrop blur on header
- **Shadow Layers**: Depth and elevation
- **Smooth Transitions**: All color and state changes