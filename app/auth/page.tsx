import { Metadata } from 'next';
import AuthLayout from '@/components/auth/AuthLayout';

export const metadata: Metadata = {
  title: 'Sign Up - TwinLink | Create Your Digital Twin',
  description: 'Join TwinLink and create your AI-powered digital twin to discover meaningful connections through intelligent compatibility analysis.',
};

export default function AuthPage() {
  return <AuthLayout />;
}