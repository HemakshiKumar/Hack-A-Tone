'use client';

import { useState } from 'react';
import { apiClient, authUtils, SignupData, SigninData } from '../lib/api';
import { Button } from '@repo/ui/button';
import styles from './AuthForm.module.css';

interface AuthFormProps {
  mode: 'signup' | 'signin';
  onSuccess?: () => void;
}

export default function AuthForm({ mode, onSuccess }: AuthFormProps) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (mode === 'signup') {
        const response = await apiClient.signup(formData as SignupData);
        setSuccess(response.message || 'Account created successfully!');
        setFormData({ username: '', email: '', password: '' });
      } else {
        const signinData: SigninData = {
          email: formData.email,
          password: formData.password,
        };
        const response = await apiClient.signin(signinData);
        
        if (response.token) {
          authUtils.setToken(response.token);
          setSuccess('Signed in successfully!');
          onSuccess?.();
        } else {
          setError('No token received');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        {mode === 'signup' ? 'Create Account' : 'Sign In'}
      </h2>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        {mode === 'signup' && (
          <div className={styles.fieldGroup}>
            <label htmlFor="username" className={styles.label}>
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
              maxLength={50}
              className={styles.input}
              placeholder="Enter your username"
            />
          </div>
        )}
        
        <div className={styles.fieldGroup}>
          <label htmlFor="email" className={styles.label}>
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className={styles.input}
            placeholder="Enter your email"
          />
        </div>
        
        <div className={styles.fieldGroup}>
          <label htmlFor="password" className={styles.label}>
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            className={styles.input}
            placeholder="Enter your password"
          />
        </div>
        
        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}
        
        <Button
          type="submit"
          disabled={loading}
          className={styles.submitButton}
        >
          {loading ? 'Loading...' : (mode === 'signup' ? 'Create Account' : 'Sign In')}
        </Button>
      </form>
    </div>
  );
}