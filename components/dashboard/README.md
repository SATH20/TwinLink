# Dashboard Components

Components for the TwinLink user dashboard interface.

## Components

### Sidebar
Fixed left sidebar with navigation links and logo.

### DashboardGrid
Responsive grid container for dashboard widgets.

### TwinWidget
Displays user's digital twin avatar and personality summary.

### MatchesWidget
Shows new recommended matches with compatibility scores.

### SimulationWidget
Lists recent twin interaction simulations.

### StatCard
Reusable card for displaying activity statistics.

## Usage

```tsx
import DashboardLayout from '@/components/dashboard/DashboardLayout';

export default function DashboardPage() {
  return <DashboardLayout />;
}
```
