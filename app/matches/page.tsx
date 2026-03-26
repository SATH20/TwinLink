'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import MatchRecommendationsLayout from '@/components/matches/MatchRecommendationsLayout';
import { checkUserTwin, getMatches } from '@/lib/api';

interface Match {
  id: string;
  matchScore: number;
  reason: string;
  interests: string[];
}

export default function MatchesPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoadingMatches, setIsLoadingMatches] = useState(false);

  useEffect(() => {
    async function checkAndFetchMatches() {
      if (!isLoaded) return;

      if (!user) {
        router.push('/sign-in');
        return;
      }

      try {
        const response = await checkUserTwin(user.id);
        
        if (!response.twinId) {
          router.push('/onboarding');
          return;
        }

        setIsChecking(false);
        setIsLoadingMatches(true);

        // Fetch matches
        const matchResponse = await getMatches(response.twinId);
        if (matchResponse.matches) {
          setMatches(matchResponse.matches);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoadingMatches(false);
      }
    }

    checkAndFetchMatches();
  }, [user, isLoaded, router]);

  if (!isLoaded || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-950">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 dark:text-blue-400 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Loading matches...</p>
        </div>
      </div>
    );
  }

  return <MatchRecommendationsLayout matches={matches} isLoading={isLoadingMatches} />;
}
