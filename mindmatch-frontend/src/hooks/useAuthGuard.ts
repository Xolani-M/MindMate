import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState } from '@/providers/authProvider';

/**
 * Authentication guard hook that protects routes
 * Redirects to login if user is not authenticated, but waits for session restoration to complete
 * 
 * @returns Object containing authentication status and loading state
 */
export const useAuthGuard = () => {
    const { user, isSessionLoading } = useAuthState();
    const router = useRouter();

    useEffect(() => {
        // Only run on client side
        if (typeof window === 'undefined') return;
        // Wait for session restoration to complete before checking authentication
        if (isSessionLoading) {
            return;
        }
        // Check if user is authenticated after session restoration is complete
        if (!user?.token && !sessionStorage.getItem('token')) {
            router.push('/auth/login');
            return;
        }
    }, [user, isSessionLoading, router]);

    // Only check session storage on client side
    const hasSessionToken = typeof window !== 'undefined' ? !!sessionStorage.getItem('token') : false;

    return {
        isAuthenticated: !!user?.token || hasSessionToken,
        isLoading: isSessionLoading,
        user
    };
};
