'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient, authUtils } from '../../lib/api';
import { Button } from '@repo/ui/button';
import styles from './page.module.css';

interface UserProfile {
  id: string;
  email: string;
  username: string;
}

export default function DashboardPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    if (!authUtils.isAuthenticated()) {
      router.push('/signin');
      return;
    }

    // Fetch user profile
    const fetchProfile = async () => {
      try {
        const response = await apiClient.getProfile();
        if (response.data) {
          setProfile(response.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load profile');
        // If token is invalid, redirect to signin
        if (err instanceof Error && err.message.includes('unauthorized')) {
          authUtils.removeToken();
          router.push('/signin');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleLogout = () => {
    authUtils.removeToken();
    router.push('/');
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingSpinner}>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error}</div>
        <Button onClick={() => router.push('/signin')}>
          Go to Sign In
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
        <Button 
          onClick={handleLogout}
          className={styles.logoutButton}
        >
          Logout
        </Button>
      </div>

      {profile && (
        <div className={styles.profileCard}>
          <h2 className={styles.profileTitle}>Your Profile</h2>
          <div className={styles.profileInfo}>
            <div className={styles.infoRow}>
              <span className={styles.label}>Username:</span>
              <span className={styles.value}>{profile.username}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Email:</span>
              <span className={styles.value}>{profile.email}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>User ID:</span>
              <span className={styles.value}>{profile.id}</span>
            </div>
          </div>
        </div>
      )}

      <div className={styles.actions}>
        <Button 
          onClick={() => router.push('/')}
          className={styles.homeButton}
        >
          Go to Home
        </Button>
      </div>
    </div>
  );
}