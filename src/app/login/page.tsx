"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import styles from '../../styles/Login.module.css';
import { FaUserShield, FaLock, FaSpinner } from 'react-icons/fa';

const LoginPage = () => {
  const [email, setemail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login, user, error: authError } = useAuth();

  // Redirect if already logged in


  // Update error message from auth context
  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('يرجى إدخال اسم البريد الإلكتروني وكلمة المرور');
      return;
    }
    setIsLoading(true);
    try {
      const success = await login(email, password);
      
      if (success) {
        router.push('/');
      } else {
        setError('اسم البريد الإلكتروني أو كلمة المرور غير صحيحة');
      }
    } catch (error) {
      setError('حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <FaUserShield className={styles.loginIcon} />
          <h1>تسجيل الدخول للإدارة</h1>
        </div>
        
        {error && <div className={styles.errorMessage}>{error}</div>}
        
        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">اسم البريد الإلكتروني</label>
            <div className={styles.inputWithIcon}>
              <FaUserShield className={styles.inputIcon} />
              <input
                className="text-black"
                type="text"
                id="email"
                value={email}
                onChange={(e) => setemail(e.target.value)}
                placeholder="أدخل اسم البريد الإلكتروني"
              />
            </div>
          </div>
          
          <div className={styles.inputGroup}>
            <label htmlFor="password">كلمة المرور</label>
            <div className={styles.inputWithIcon}>
              <FaLock className={styles.inputIcon} />
              <input
                className="text-black"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="أدخل كلمة المرور"
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            className={styles.loginButton}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <FaSpinner className={styles.spinner} /> جاري تسجيل الدخول...
              </>
            ) : (
              'تسجيل الدخول'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
