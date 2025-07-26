'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image, { type ImageProps } from "next/image";
import { Button } from "@repo/ui/button";
import { authUtils } from "../lib/api";
import styles from "./page.module.css";

type Props = Omit<ImageProps, "src"> & {
  srcLight: string;
  srcDark: string;
};

const ThemeImage = (props: Props) => {
  const { srcLight, srcDark, ...rest } = props;

  return (
    <>
      <Image {...rest} src={srcLight} className="imgLight" />
      <Image {...rest} src={srcDark} className="imgDark" />
    </>
  );
};

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsAuthenticated(authUtils.isAuthenticated());
  }, []);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.hero}>
          <h1 className={styles.heroTitle}>Welcome to Our App</h1>
          <p className={styles.heroSubtitle}>
            A full-stack application with authentication powered by Next.js and Express
          </p>
        </div>

        <div className={styles.ctas}>
          {isAuthenticated ? (
            <Button
              onClick={() => router.push('/dashboard')}
              className={styles.primary}
            >
              Go to Dashboard
            </Button>
          ) : (
            <>
              <Button
                onClick={() => router.push('/signin')}
                className={styles.primary}
              >
                Sign In
              </Button>
              <Button
                onClick={() => router.push('/signup')}
                className={styles.secondary}
              >
                Create Account
              </Button>
            </>
          )}
        </div>

        <div className={styles.features}>
          <div className={styles.feature}>
            <h3>🔐 Authentication</h3>
            <p>Secure user registration and login with JWT tokens</p>
          </div>
          <div className={styles.feature}>
            <h3>🚀 Full Stack</h3>
            <p>Next.js frontend connected to Express.js backend</p>
          </div>
          <div className={styles.feature}>
            <h3>📱 Responsive</h3>
            <p>Beautiful, modern UI that works on all devices</p>
          </div>
        </div>
      </main>
      <footer className={styles.footer}>
        <a
          href="https://vercel.com/templates?search=turborepo&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          href="https://turborepo.com?utm_source=create-turbo"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to turborepo.com →
        </a>
      </footer>
    </div>
  );
}
