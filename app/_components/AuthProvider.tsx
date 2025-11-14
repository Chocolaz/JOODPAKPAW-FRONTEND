'use client';

import { useEffect, useState } from 'react';
import { refreshAccessToken } from '@/lib/authenUtils';
import { isAuthenticated } from '@/lib/tokenManager';
import { Spinner } from '@/components/ui/spinner';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated()) {
        try {
          await refreshAccessToken();
        } catch (error) {
          console.error('AuthProvider: Failed to refresh token', error);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  return <>{children}</>;
}
