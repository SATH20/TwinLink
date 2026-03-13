# Match Recommendations Components

This directory contains components for the Match Recommendations page, where users discover AI-recommended matches based on digital twin compatibility.

## Components

### MatchRecommendationsLayout
Main layout component for the matches page with header and grid container.

### MatchGrid
Grid container that displays match cards in a responsive layout.

### MatchCard
Individual match card displaying:
- Avatar with gradient background
- Name
- Compatibility score with animated progress bar
- Interest tags
- Connect button

### CompatibilityBar
Animated progress bar showing compatibility percentage.

### InterestChip
Styled chip component for displaying user interests.

## Usage

```tsx
import MatchRecommendationsLayout from '@/components/matches/MatchRecommendationsLayout';

export default function MatchesPage() {
  return <MatchRecommendationsLayout />;
}
```

## Design Features

- Responsive grid layout (1 column mobile, 2 tablet, 3 desktop)
- Animated card entrance with staggered delays
- Hover effects on cards and buttons
- Dark mode support
- Gradient avatars with unique colors per match
- Animated compatibility progress bars
