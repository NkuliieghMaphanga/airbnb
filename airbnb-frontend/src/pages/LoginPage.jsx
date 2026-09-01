import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import '../styles/auth.css';

function validateEmail(email) {
  return /^\S+@\S+\.\S+$/.test(email);
}

export default function LoginPage() {
  const { login, register, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);

  const initialMode =
    params.get('mode') === 'register' ? 'register' : 'login';

  const initialRole =
    params.get('role') === 'host' ? 'host' : 'user';

  const [mode, setMode] = useState(initialMode);

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    role: initialRole,
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((current) => ({
      ...current,
      [field]: e.target.value,
    }));
  };

  const validate = () => {
    const nextErrors = {};

    if (mode === 'register' && !form.username.trim()) {
      nextErrors.username = 'Username is required.';
    }

    if (!form.email.trim()) {
      nextErrors.email = 'Email is required.';
    } else if (!validateEmail(form.email.trim())) {
      nextErrors.email = 'Enter a valid email address.';
    }

    if (!form.password) {
      nextErrors.password = 'Password is required.';
    } else if (form.password.length < 6) {
      nextErrors.password =
        'Password must be at least 6 characters.';
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitError('');

    if (!validate()) {
      return;
    }

    try {
      setSubmitting(true);

      const email = form.email.trim();
      const password = form.password;

      console.log('Attempting login:', {
        email,
        passwordLength: password.length,
      });

      if (mode === 'login') {
        const loggedInUser = await login(email, password);

        console.log('Login successful:', loggedInUser);

        // Admin accounts belong in the admin portal, not here.
        if (loggedInUser.role === 'admin') {
          // Log them back out so no admin token sits in this app's storage.
          logout();
          setSubmitError(
            'Admin accounts must log in through the Admin Portal, not this page.'
          );
          return;
        }

        if (loggedInUser.role === 'host') {
          navigate('/host');
        } else {
          navigate('/');
        }
      } else {
        const newUser = await register({
          username: form.username.trim(),
          email,
          password,
          role: form.role,
        });

        console.log('Registration successful:', newUser);

        if (newUser.role === 'host') {
          navigate('/host');
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      console.error('Authentication error:', err);

      const message =
        err.response?.data?.message ||
        'Invalid email or password. Please try again.';

      setSubmitError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setErrors({});
    setSubmitError('');
  };

  return (
    <div className="auth-page container">
      <div className="auth-card">
        <h1>
          {mode === 'login' ? 'Log in' : 'Create an account'}
        </h1>

        <p className="auth-card__subtitle">
          {mode === 'login'
            ? 'Welcome back to airbnb.'
            : 'Join airbnb to book or host your next stay.'}
        </p>

        <form onSubmit={handleSubmit} noValidate>
          {mode === 'register' && (
            <label className="auth-field">
              Username

              <input
                type="text"
                value={form.username}
                onChange={handleChange('username')}
                autoComplete="username"
              />

              {errors.username && (
                <span className="auth-field__error">
                  {errors.username}
                </span>
              )}
            </label>
          )}

          <label className="auth-field">
            Email

            <input
              type="email"
              value={form.email}
              onChange={handleChange('email')}
              autoComplete="email"
              placeholder="host@airbnb.demo"
            />

            {errors.email && (
              <span className="auth-field__error">
                {errors.email}
              </span>
            )}
          </label>

          <label className="auth-field">
            Password

            <input
              type="password"
              value={form.password}
              onChange={handleChange('password')}
              autoComplete={
                mode === 'login'
                  ? 'current-password'
                  : 'new-password'
              }
              placeholder="Enter your password"
            />

            {errors.password && (
              <span className="auth-field__error">
                {errors.password}
              </span>
            )}
          </label>

          {mode === 'register' && (
            <fieldset className="auth-role-fieldset">
              <legend>I want to</legend>

              <div className="auth-role-options">
                <label
                  className={`auth-role-option ${
                    form.role === 'user'
                      ? 'auth-role-option--active'
                      : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="user"
                    checked={form.role === 'user'}
                    onChange={handleChange('role')}
                  />

                  <span className="auth-role-option__icon">
                    🧳
                  </span>

                  <div>
                    <strong>Book stays</strong>
                    <p>
                      Find and book amazing places to stay.
                    </p>
                  </div>
                </label>

                <label
                  className={`auth-role-option ${
                    form.role === 'host'
                      ? 'auth-role-option--active'
                      : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="host"
                    checked={form.role === 'host'}
                    onChange={handleChange('role')}
                  />

                  <span className="auth-role-option__icon">
                    🏠
                  </span>

                  <div>
                    <strong>Host my place</strong>
                    <p>
                      List your space and earn extra income.
                    </p>
                  </div>
                </label>
              </div>
            </fieldset>
          )}

          {submitError && (
            <p className="auth-card__submit-error">
              {submitError}
            </p>
          )}

          <button
            type="submit"
            className="auth-card__submit"
            disabled={submitting}
          >
            {submitting
              ? 'Please wait…'
              : mode === 'login'
              ? 'Log in'
              : form.role === 'host'
              ? 'Sign up as host'
              : 'Sign up'}
          </button>
        </form>

        <p className="auth-card__switch">
          {mode === 'login' ? (
            <>
              <span>Don't have an account? </span>

              <button
                type="button"
                onClick={() => switchMode('register')}
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              <span>Already have an account? </span>

              <button
                type="button"
                onClick={() => switchMode('login')}
              >
                Log in
              </button>
            </>
          )}
        </p>

        <Link to="/" className="auth-card__back">
          Back to home
        </Link>

        {mode === 'login' && (
          <div className="auth-card__hint">
            <p><strong>Demo credentials</strong></p>
            <p>Host — <code>host@airbnb.demo</code> / <code>Host1234!</code></p>
            <p>Guest — <code>user@airbnb.demo</code> / <code>User1234!</code></p>
            <p className="auth-card__hint-note">
              Looking for the admin panel?{' '}
              <a href="http://localhost:5173" target="_blank" rel="noreferrer">
                Open Admin Portal
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}