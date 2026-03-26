import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { checkUserTwin } from '@/lib/api';

export function useUserTwin() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [twinId, setTwinId] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    async function checkTwin() {
      if (!isLoaded) return;

      if (!user) {
        setIsChecking(false);
        return;
      }

      try {
        const response = await checkUserTwin(user.id);
        setTwinId(response.twinId);
      } catch (error) {
        console.error('Error checking twin:', error);
      } finally {
        setIsChecking(false);
      }
    }

    checkTwin();
  }, [user, isLoaded]);

  return { twinId, isChecking, hasTwin: !!twinId };
}

// Hook to redirect based on twin status
export function useRedirectByTwinStatus(redirectTo: 'dashboard' | 'onboarding') {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    async function checkAndRedirect() {
      if (!isLoaded) return;

      if (!user) {
        router.push('/sign-in');
        return;
      }

      try {
        const response = await checkUserTwin(user.id);
        
        if (redirectTo === 'dashboard' && !response.twinId) {
          // User doesn't have a twin, redirect to onboarding
          router.push('/onboarding');
        } else if (redirectTo === 'onboarding' && response.twinId) {
          // User already has a twin, redirect to dashboard
          router.push('/dashboard');
        } else {
          setIsChecking(false);
        }
      } catch (error) {
        console.error('Error checking twin:', error);
        setIsChecking(false);
      }
    }

    checkAndRedirect();
  }, [user, isLoaded, router, redirectTo]);

  return { isChecking };
}
