# Twin Interaction Simulation Components

This directory contains components for visualizing AI-powered twin interactions and compatibility analysis.

## Components

### SimulationLayout
- Main orchestrator for the simulation page
- Manages simulation state and timing
- Displays twin avatars, conversation, and results
- Handles navigation and actions

### SimulationLog
- Container for conversation messages
- Scrollable message display
- Title and description header
- Theme-aware card styling

### SimulationBubble
- Individual chat message bubble
- Alternating left/right alignment
- Color-coded by sender (blue/emerald)
- Slide-in animations
- Theme-aware styling

### CompatibilityCard
- Displays compatibility score prominently
- Animated score reveal
- Color-coded score levels
- Explanation text with icon
- Pulsing heart icon
- Theme-aware styling

## Page Sections

### 1. Header
- Back navigation to profile
- TwinLink branding
- Sticky positioning with backdrop blur

### 2. Title Section
- "Twin Interaction Simulation" heading
- Subtitle explaining AI analysis
- Centered layout

### 3. Twin Avatars Header
- Two avatars facing each other
- User twin (blue gradient)
- Other twin (emerald gradient)
- Animated connection arrow
- Pulsing glow effects during simulation
- "Simulating..." indicator

### 4. Simulation Log
- Chat-style conversation display
- Alternating message bubbles
- Scrollable container
- Staggered message animations
- Sample conversation about AI/tech

### 5. Compatibility Results
- Large percentage score (87%)
- Score label (Excellent/Good/Potential Match)
- Heart icon with pulsing animation
- Detailed explanation text
- Appears after simulation completes

### 6. Action Button
- "Connect with this Match" CTA
- Emerald gradient background
- Hover glow effect
- Routes to dashboard

### 7. Loading State
- "Analyzing compatibility..." message
- Rotating Zap icon
- Blue accent badge
- Appears during simulation

## Features

- **Timed Simulation**: 3-second delay before showing results
- **Smooth Animations**: Framer Motion for all elements
- **Real-time Feedback**: Pulsing avatars during simulation
- **Theme Support**: Full light/dark mode compatibility
- **Responsive Design**: Mobile-first approach
- **Interactive Elements**: Hover effects and transitions
- **Visual Storytelling**: Clear progression from simulation to results

## Simulation Flow

1. Page loads with twin avatars
2. Pulsing glow effects on avatars
3. "Simulating..." indicator appears
4. Animated arrow between twins
5. Conversation messages appear sequentially
6. After 3 seconds, simulation completes
7. Compatibility card reveals with score
8. Action button appears
9. User can connect with match

## Data Structure

```typescript
interface Message {
  sender: 'user' | 'other';
  text: string;
}

interface CompatibilityData {
  score: number;
  explanation: string;
}

interface TwinData {
  initials: string;
  name: string;
}
```

## Usage

```tsx
import SimulationLayout from '@/components/simulation/SimulationLayout';

export default function SimulationPage() {
  return <SimulationLayout />;
}
```

## Styling

### Avatar Colors
- User Twin: `bg-gradient-to-br from-blue-500 to-blue-600`
- Other Twin: `bg-gradient-to-br from-emerald-500 to-emerald-600`

### Message Bubbles
- User: `bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300`
- Other: `bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300`

### Compatibility Score Colors
- 80%+: Emerald (Excellent Match)
- 60-79%: Blue (Good Match)
- <60%: Slate (Potential Match)

### Action Button
- `bg-gradient-to-r from-emerald-600 to-emerald-500`
- Hover: `from-emerald-700 to-emerald-600`
- Glow effect on hover

## Animation Sequence

1. Title fades in (0s)
2. Twin avatars appear (0.2s)
3. Connection arrow animates (continuous)
4. Simulation log slides up (0.4s)
5. Messages appear sequentially (0.5s+)
6. Compatibility card scales in (0.8s after completion)
7. Score animates (1s after completion)
8. Action button slides up (1.2s after completion)

## Visual Effects

- **Pulsing Glows**: Behind avatars during simulation
- **Animated Arrow**: Moving between twins
- **Rotating Icon**: Loading indicator
- **Scale Animations**: Score reveal
- **Slide Animations**: Message bubbles
- **Hover Glow**: Action button
- **Smooth Transitions**: All state changes

## Theme Support

All components use Tailwind's `dark:` variants:
- Background colors adapt
- Text colors transition
- Border colors change
- Glow effects visible in both modes
- Consistent visual hierarchy