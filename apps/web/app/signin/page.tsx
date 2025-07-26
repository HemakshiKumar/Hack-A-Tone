'use client';

import { useRouter } from 'next/navigation';
import AuthForm from '../../components/AuthForm';
import styles from './page.module.css';

export default function SigninPage() {
  const router = useRouter();

  const handleSigninSuccess = () => {
    // Redirect to dashboard/profile after successful signin
    setTimeout(() => {
      router.push('/dashboard');
    }, 1000);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Welcome Back</h1>
        <p className={styles.subtitle}>Sign in to your account</p>
      </div>
      
      <AuthForm mode="signin" onSuccess={handleSigninSuccess} />
      
      <div className={styles.footer}>
        <p>
          Don't have an account?{' '}
          <button
            onClick={() => router.push('/signup')}
            className={styles.link}
          >
            Create one
          </button>
        </p>
      </div>
    </div>
  );
}