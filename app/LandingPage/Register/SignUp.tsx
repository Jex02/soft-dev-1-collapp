import React from 'react';

export default function SignUp() {
  return (
    <section className='signup-panel' id='signup'>
      <div className='signup-panel__card'>
        <div className='signup-panel__header'>
          <h2 className='signup-panel__title'>Sign Up</h2>
        </div>

        <form className='signup-panel__form'>
          <div className='form-field'>
            <label htmlFor='signup-name'>Full Name</label>
            <input id='signup-name' name='name' type='text' placeholder='Enter your full name' />
          </div>

          <div className='form-field'>
            <label htmlFor='signup-email'>Email</label>
            <input id='signup-email' name='email' type='email' placeholder='Enter your email' />
          </div>

          <div className='form-field'>
            <label htmlFor='signup-password'>Password</label>
            <input id='signup-password' name='password' type='password' placeholder='Create a password' />
          </div>

          <div className='form-field'>
            <label htmlFor='signup-confirm-password'>Confirm Password</label>
            <input id='signup-confirm-password' name='confirmPassword' type='password' placeholder='Confirm your password' />
          </div>

          <button type='submit' className='signup-panel__submit'>Create account</button>

          <p className='signup-panel__footer'>Already have an account? <a href='#login'>Login</a></p>
        </form>
      </div>
    </section>
  );
}