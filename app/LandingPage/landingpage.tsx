'use client';

import React, { useState } from 'react';

export default function LandingPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [userType, setUserType] = useState<'student' | 'schoolRep'>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const headingText = mode === 'login' ? 'Login' : 'Create an account';
  const submitText = mode === 'login' ? 'Login' : 'Sign Up';
  const footerText = mode === 'login' ? "Don't have an account?" : 'Already have an account?';
  const footerAction = mode === 'login' ? 'Sign up' : 'Login';

  return (
    <div className='landing-page'>
      <section className='hero'>
        <div className='hero__content'>
          <p className='hero__eyebrow'>COLLAPP</p>
          <h1 className='hero__heading'>Streamline your college journey from application to acceptance.</h1>
          <p className='hero__subtext'>Build a polished application workflow for students and school representatives, from program search to submission review.</p>
          <div className='hero__actions'>
            <a href='#login' className='button button--primary' onClick={() => setMode('login')}>Login</a>
            <a href='#login' className='button button--secondary' onClick={() => setMode('signup')}>Sign Up</a>
          </div>
        </div>
      </section>

      <section className='login-panel' id='login'>
        <div className='login-panel__card'>
          <div className='login-panel__header'>
            <h2 className='login-panel__title'>{headingText}</h2>
            <div className='login-panel__modes'>
              <button
                type='button'
                className={`login-panel__mode ${userType === 'student' ? 'login-panel__mode--active' : ''}`}
                onClick={() => setUserType('student')}
              >
                Student
              </button>
              <button
                type='button'
                className={`login-panel__mode ${userType === 'schoolRep' ? 'login-panel__mode--active' : ''}`}
                onClick={() => setUserType('schoolRep')}
              >
                School Rep
              </button>
            </div>
          </div>

          <form className='login-panel__form'>
            {mode === 'signup' && (
              <>
                <div className='form-field'>
                  <label htmlFor='fullName'>Full Name</label>
                  <input id='fullName' name='fullName' type='text' placeholder='Enter your full name' />
                </div>

                <div className='form-field'>
                  <label htmlFor='email'>Email</label>
                  <input id='email' name='email' type='email' placeholder='Enter your email' />
                </div>
              </>
            )}

            <div className='form-field'>
              <label htmlFor='username'>Username</label>
              <input id='username' name='username' type='text' placeholder='Enter your username' />
            </div>

            <div className='form-field password-field'>
              <label htmlFor='password'>Password</label>
              <input
                id='password'
                name='password'
                type={showPassword ? 'text' : 'password'}
                placeholder='Enter your password'
              />
              <button
                type='button'
                className='password-toggle'
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            {mode === 'signup' && (
              <div className='form-field password-field'>
                <label htmlFor='confirmPassword'>Confirm Password</label>
                <input
                  id='confirmPassword'
                  name='confirmPassword'
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder='Confirm your password'
                />
                <button
                  type='button'
                  className='password-toggle'
                  onClick={() => setShowConfirmPassword((current) => !current)}
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            )}

            <button type='submit' className='login-panel__submit'>{submitText}</button>

            <p className='login-panel__footer'>
              {footerText}{' '}
              <button type='button' className='login-panel__footer-action' onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
                {footerAction}
              </button>
            </p>
          </form>
        </div>
      </section>
    </div>
  );
}

