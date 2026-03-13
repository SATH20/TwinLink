import { Metadata } from 'next';
import SimulationLayout from '@/components/simulation/SimulationLayout';

export const metadata: Metadata = {
  title: 'Twin Simulation - TwinLink',
  description: 'Watch your digital twin interact with potential matches through AI-powered simulation.',
};

export default function SimulationPage() {
  return <SimulationLayout />;
}