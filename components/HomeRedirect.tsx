'use client';

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { checkUserTwin } from '@/lib/api';

export default function HomeRedirect() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    async function checkAndRedirect() {
      // Only check if Clerk has loaded and user is signed in
      if (!isLoaded) return;
      
      if (user) {
        try {
          // Check if user has a twin
          const response = await checkUserTwin(user.id);
          
          if (response.twinId) {
            // User has a twin, redirect to dashboard
            router.push('/dashboard');
          } else {
            // User doesn't have a twin, redirect to onboarding
            router.push('/onboarding');
          }
        } catch (error) {
          console.error('Error checking user twin:', error);
          // On error, redirect to onboarding to be safe
          router.push('/onboarding');
        }
      }
      // If no user, stay on home page
    }

    checkAndRedirect();
  }, [user, isLoaded, router]);

  // This component doesn't render anything
  return null;
}
