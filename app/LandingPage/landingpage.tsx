'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import './landingpage.css';

const accounts: Record<string, { password: string; route: string }> = {
  student: { password: '12345', route: '/StudentDashboard' },
  school1: { password: '12345', route: '/schoolrep' },
};

export default function LandingPage() {
  const router = useRouter();
  const [showPanel, setShowPanel] = useState(false);
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userType, setUserType] = useState<'student' | 'schoolRep'>('student');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (showPanel) {
      panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [showPanel]);

  const openPanel = (newMode: 'login' | 'signup') => {
    setMode(newMode);
    setShowPanel(true);
    setError('');
    setUsername('');
    setPassword('');
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (mode === 'login') {
      const account = accounts[username.trim()];
      if (!account || account.password !== password) {
        setError('Invalid username or password.');
        return;
      }
      setError('');
      router.push(account.route);
      return;
    }

    setError('Sign up is disabled in this demo. Use a pre-made profile.');
  };

  return (
    <main className="landing-page">
      <section className={`hero ${showPanel ? 'hero--compact' : ''}`}>
        <div className="hero__content">
          <p className="hero__eyebrow">COLLAPP</p>
          <h1 className="hero__heading">
            Streamline your college journey from application to acceptance.
          </h1>
          <p className="hero__subtext">
            Build a polished application workflow for students and school representatives, from
            program search to submission review.
          </p>

          <div className="hero__actions">
            <button
              type="button"
              className={`button ${mode === 'login' ? 'button--primary' : 'button--secondary'}`}
              onClick={() => openPanel('login')}
            >
              Login
            </button>
            <button
              type="button"
              className={`button ${mode === 'signup' ? 'button--primary' : 'button--secondary'}`}
              onClick={() => openPanel('signup')}
            >
              Sign Up
            </button>
          </div>
        </div>
      </section>

      {showPanel && (
        <section className="login-panel" ref={panelRef}>
          <div className="login-panel__card">
            <div className="login-panel__header">
              <h2 className="login-panel__title">{mode === 'login' ? 'Login' : 'Sign Up'}</h2>
              {mode === 'login' ? (
                <div className="login-panel__modes">
                  <button
                    type="button"
                    className={`login-panel__mode ${
                      userType === 'student' ? 'login-panel__mode--active' : ''
                    }`}
                    onClick={() => setUserType('student')}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    className={`login-panel__mode ${
                      userType === 'schoolRep' ? 'login-panel__mode--active' : ''
                    }`}
                    onClick={() => setUserType('schoolRep')}
                  >
                    School Rep
                  </button>
                </div>
              ) : (
                <p className="login-panel__subtitle">Create a student account</p>
              )}
            </div>

            <form className="login-panel__form" onSubmit={handleSubmit}>
              {mode === 'signup' && (
                <>
                  <div className="form-field">
                    <label htmlFor="fullName">Full Name</label>
                    <input id="fullName" name="fullName" type="text" placeholder="Enter your full name" />
                  </div>

                  <div className="form-field">
                    <label htmlFor="email">Email</label>
                    <input id="email" name="email" type="email" placeholder="Enter your email" />
                  </div>
                </>
              )}

              <div className="form-field">
                <label htmlFor="username">Username</label>
                <input
                  id="username"
                  name="username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError('');
                  }}
                  type="text"
                  placeholder="Enter your username"
                />
              </div>

              <div className="form-field password-field">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  type={showPassword ? 'text' : 'password'}
                  placeholder={mode === 'login' ? 'Enter your password' : 'Create a password'}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>

              {mode === 'signup' && (
                <div className="form-field password-field">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                  >
                    {showConfirmPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              )}

              {error && <div className="alert">{error}</div>}

              <button type="submit" className="login-panel__submit">
                {mode === 'login' ? 'Login' : 'Create account'}
              </button>

              <p className="login-panel__footer">
                {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
                <button
                  type="button"
                  className="login-panel__footer-action"
                  onClick={() => openPanel(mode === 'login' ? 'signup' : 'login')}
                >
                  {mode === 'login' ? 'Sign up' : 'Login'}
                </button>
              </p>
            </form>
          </div>
        </section>
      )}
    </main>
  );
}