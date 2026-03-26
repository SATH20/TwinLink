'use client';

import { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import DashboardGrid from './DashboardGrid';
import TwinWidget from './TwinWidget';
import MatchesWidget from './MatchesWidget';
import SimulationWidget from './SimulationWidget';
import StatCard from './StatCard';
import { Zap, Heart, Users } from 'lucide-react';
import { getMatches } from '@/lib/api';

interface Match {
  id: string;
  matchScore: number;
  reason: string;
  interests: string[];
}

interface DashboardLayoutProps {
  twinId: string | null;
}

export default function DashboardLayout({ twinId }: DashboardLayoutProps) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoadingMatches, setIsLoadingMatches] = useState(false);

  useEffect(() => {
    async function fetchMatches() {
      if (!twinId) return;

      setIsLoadingMatches(true);
      try {
        const response = await getMatches(twinId);
        if (response.matches) {
          setMatches(response.matches);
        }
      } catch (error) {
        console.error('Error fetching matches:', error);
      } finally {
        setIsLoadingMatches(false);
      }
    }

    fetchMatches();
  }, [twinId]);

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-950 transition-colors duration-300">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 transition-colors duration-300">
              Dashboard
            </h1>
            <p className="text-slate-600 dark:text-slate-400 transition-colors duration-300">
              Welcome back! Here's your digital twin activity overview.
            </p>
          </div>

          {/* Dashboard Grid */}
          <DashboardGrid>
            {/* Twin Widget */}
            <TwinWidget twinId={twinId} />

            {/* Matches Widget */}
            <MatchesWidget matches={matches} isLoading={isLoadingMatches} />

            {/* Simulation Widget */}
            <SimulationWidget />

            {/* Activity Stats */}
            <StatCard title="Simulations Run" value={12} icon={Zap} index={3} />
            <StatCard title="Matches Found" value={matches.length} icon={Heart} index={4} />
            <StatCard title="Connections Made" value={5} icon={Users} index={5} />
          </DashboardGrid>
        </div>
      </main>
    </div>
  );
}
