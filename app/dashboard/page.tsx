'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { checkUserTwin } from '@/lib/api';

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [twinId, setTwinId] = useState<string | null>(null);

  useEffect(() => {
    async function checkTwin() {
      if (!isLoaded) return;

      if (!user) {
        router.push('/sign-in');
        return;
      }

      try {
        const response = await checkUserTwin(user.id);
        
        if (!response.twinId) {
          // User doesn't have a twin, redirect to onboarding
          router.push('/onboarding');
        } else {
          setTwinId(response.twinId);
          setIsChecking(false);
        }
      } catch (error) {
        console.error('Error checking twin:', error);
        setIsChecking(false);
      }
    }

    checkTwin();
  }, [user, isLoaded, router]);

  if (!isLoaded || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-950">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 dark:text-blue-400 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return <DashboardLayout twinId={twinId} />;
}