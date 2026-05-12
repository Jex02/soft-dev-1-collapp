'use client';

import { useState } from 'react';

type SignUpProps = {
  onSwitchToLogin: () => void;
};

export default function SignUp({ onSwitchToLogin }: SignUpProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <section className="login-panel" id="signup">
      <div className="login-panel__card">
        <div className="login-panel__header">
          <h2 className="login-panel__title">Sign Up</h2>
          <p className="login-panel__subtitle">Create a student account</p>
        </div>

        <form className="login-panel__form">
          <div className="form-field">
            <label htmlFor="fullName">Full Name</label>
            <input id="fullName" name="fullName" type="text" placeholder="Enter your full name" />
          </div>

          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" placeholder="Enter your email" />
          </div>

          <div className="form-field password-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

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

          <button type="submit" className="login-panel__submit">
            Create account
          </button>

          <p className="login-panel__footer">
            Already have an account?{' '}
            <button type="button" className="login-panel__footer-action" onClick={onSwitchToLogin}>
              Login
            </button>
          </p>
        </form>
      </div>
    </section>
  );
}