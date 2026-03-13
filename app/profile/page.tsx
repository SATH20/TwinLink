import { Metadata } from 'next';
import TwinProfileLayout from '@/components/profile/TwinProfileLayout';

export const metadata: Metadata = {
  title: 'Your Digital Twin - TwinLink',
  description: 'View your AI-generated digital twin profile and personality analysis.',
};

export default function ProfilePage() {
  return <TwinProfileLayout />;
}