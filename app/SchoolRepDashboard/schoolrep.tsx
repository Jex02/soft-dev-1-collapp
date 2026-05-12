'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from '../landingpage.module.css';

export default function LandingPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [userType, setUserType] = useState<'student' | 'schoolRep'>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const headingText = mode === 'login'
    ? userType === 'schoolRep'
      ? 'School Rep login'
      : 'Student login'
    : 'Create a student account';
  const submitText = mode === 'login' ? 'Login' : 'Sign Up';
  const footerText = mode === 'login' ? "Don't have an account?" : 'Already have an account?';
  const footerAction = mode === 'login' ? 'Sign up' : 'Login';

  return (
    <div className='landing-page'>
      <section className={styles.hero}>
        <div className={styles.hero__content}>
          <p className={styles.hero__eyebrow}>COLLAPP</p>
          <h1 className={styles.hero__heading}>APPLY NOW!</h1>
          <p className={styles.hero__subtext}>Where your journey meets success.</p>
          <div className={styles.hero__actions}>
            <a href='#login' className={`${styles.button} ${styles['button--primary']}`} onClick={() => setMode('login')}>Login</a>
            <a href='#login' className={`${styles.button} ${styles['button--secondary']}`} onClick={() => { setMode('signup'); setUserType('student'); }}>Sign Up</a>
          </div>
        </div>
      </section>

      <section className={styles['login-panel']} id='login'>
        <div className={styles['login-panel__card']}>
          <div className={styles['login-panel__header']}>
            <h2 className={styles['login-panel__title']}>{headingText}</h2>
            {mode === 'login' ? (
              <div className={styles['login-panel__modes']}>
                <button type='button' className={`${styles['login-panel__mode']} ${userType === 'student' ? styles['login-panel__mode--active'] : ''}`} onClick={() => setUserType('student')}>
                  Student
                </button>
                <button type='button' className={`${styles['login-panel__mode']} ${userType === 'schoolRep' ? styles['login-panel__mode--active'] : ''}`} onClick={() => setUserType('schoolRep')}>
                  School Rep
                </button>
              </div>
            ) : (
              <p className={styles['login-panel__subtitle']}>Student sign up only</p>
            )}
          </div>

          <form className={styles['login-panel__form']} onSubmit={(event) => {
            event.preventDefault();
            const targetRoute = mode === 'login' && userType === 'schoolRep' ? '/schoolrep' : '/dashboard';
            router.push(targetRoute);
          }}>
            {mode === 'signup' && (
              <>
              </>
            )}
          </form>
        </div>
      </section>
    </div>
  );
}