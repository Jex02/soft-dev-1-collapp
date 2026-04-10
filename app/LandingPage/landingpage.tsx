import React from 'react';

export default function LandingPage() {
  return (
    <div className='landing-page'>
      <section className='hero'>
        <div className='hero__content'>
          <p className='hero__eyebrow'>COLLAPP</p>
          <h1 className='hero__heading'>Streamline your college journey from application to acceptance.</h1>
          <p className='hero__subtext'>Build a polished application workflow for students and school representatives, from program search to submission review.</p>
          <div className='hero__actions'>
            <a href='#login' className='button button--primary'>Login</a>
            <a href='#login' className='button button--secondary'>Sign Up</a>
          </div>
        </div>
      </section>

      <section className='login-panel' id='login'>
        <div className='login-panel__card'>
          <div className='login-panel__header'>
            <h2 className='login-panel__title'>Login</h2>
            <div className='login-panel__modes'>
              <button type='button' className='login-panel__mode login-panel__mode--active'>Student</button>
              <button type='button' className='login-panel__mode'>School Rep</button>
            </div>
          </div>

          <form className='login-panel__form'>
            <div className='form-field'>
              <label htmlFor='username'>Username</label>
              <input id='username' name='username' type='text' placeholder='Enter your username' />
            </div>

            <div className='form-field'>
              <label htmlFor='password'>Password</label>
              <input id='password' name='password' type='password' placeholder='Enter your password' />
            </div>

            <div className='alert'>Please enter valid login credentials</div>

            <button type='submit' className='login-panel__submit'>Login</button>

            <p className='login-panel__footer'>Don't have an account? <a href='#'>Sign up</a></p>
          </form>
        </div>
      </section>
    </div>
  );
}

