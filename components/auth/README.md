# Authentication Components

This directory contains the authentication components for TwinLink, following the Atomic Cobalt & Emerald design system.

## Components

### AuthLayout
- Main layout component for the authentication page
- Two-column design (desktop) / stacked (mobile)
- Left: Branding section with gradient background
- Right: Authentication card

### AuthCard
- Main authentication form component
- Toggles between Sign Up and Sign In modes
- Includes form validation and error handling
- Features social login (Google) option

### InputField
- Reusable form input component
- Supports error states and validation
- Theme-aware styling with dark mode support

### AuthButton
- Reusable button component with multiple variants
- Primary, secondary, and Google login styles
- Loading states and hover animations

## Features

- **Theme Support**: Full light/dark mode compatibility
- **Form Validation**: Client-side validation with error messages
- **Responsive Design**: Mobile-first approach with desktop enhancements
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Animations**: Smooth transitions and hover effects
- **Loading States**: Visual feedback during form submission

## Usage

```tsx
import AuthLayout from '@/components/auth/AuthLayout';

export default function AuthPage() {
  return <AuthLayout />;
}
```

## Styling

All components follow the TwinLink design system:
- Atomic Cobalt & Emerald color palette
- Consistent spacing and typography
- Smooth transitions (300ms duration)
- Theme-aware color schemes