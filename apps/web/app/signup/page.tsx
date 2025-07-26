'use client';

import { useRouter } from 'next/navigation';
import AuthForm from '../../components/AuthForm';
import styles from './page.module.css';

export default function SignupPage() {
  const router = useRouter();

  const handleSignupSuccess = () => {
    // Redirect to signin page after successful signup
    setTimeout(() => {
      router.push('/signin');
    }, 2000);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Welcome</h1>
        <p className={styles.subtitle}>Create your account to get started</p>
      </div>
      
      <AuthForm mode="signup" onSuccess={handleSignupSuccess} />
      
      <div className={styles.footer}>
        <p>
          Already have an account?{' '}
          <button
            onClick={() => router.push('/signin')}
            className={styles.link}
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}