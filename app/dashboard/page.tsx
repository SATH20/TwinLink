import { Metadata } from 'next';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

export const metadata: Metadata = {
  title: 'Dashboard - TwinLink',
  description: 'Your TwinLink dashboard - manage your digital twin and discover matches.',
};

export default function DashboardPage() {
  return <DashboardLayout />;
}