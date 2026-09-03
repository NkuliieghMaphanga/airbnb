/**
 * LoginPage — Admin Portal
 *
 * Provides a login form for administrator accounts only.
 *
 * Validation:
 *   - Email: required + regex format check (fires on blur and on submit)
 *   - Password: required + minimum 6 characters
 *   - Per-field inline error messages with ARIA live regions
 *   - Server error banner for wrong credentials or non-admin accounts
 *
 * Auth flow:
 *   1. Calls AuthContext.login(email, password)
 *   2. AuthContext calls POST /api/users/login
 *   3. If the returned user.role !== 'admin', throws "Access denied"
 *   4. On success, stores JWT as 'admin_token' and navigates to /dashboard
 *
 * The hint box shows demo credentials and a reminder to run `npm run seed`.
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import '../styles/login.css';

function validateEmail(email) {
  return /^\S+@\S+\.\S+$/.test(email);
}

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Inline field-level errors
  const [fieldErrors, setFieldErrors] = useState({ email: '', password: '' });
  // General server / auth error
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);

  // Validate a single field and update its error state
  const validateField = (name, value) => {
    if (name === 'email') {
      if (!value.trim()) return 'Email is required.';
      if (!validateEmail(value)) return 'Enter a valid email address.';
      return '';
    }
    if (name === 'password') {
      if (!value) return 'Password is required.';
      if (value.length < 6) return 'Password must be at least 6 characters.';
      return '';
    }
    return '';
  };

  const handleBlur = (name, value) => {
    setFieldErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    // Full validation pass before submitting
    const emailErr = validateField('email', email);
    const passwordErr = validateField('password', password);
    setFieldErrors({ email: emailErr, password: passwordErr });

    if (emailErr || passwordErr) return;

    try {
      setLoading(true);
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setSubmitError(err.response?.data?.message || err.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {/* Brand */}
        <div className="login-card__brand">
          {/* Pink avatar circle with white person silhouette */}
          <div className="login-card__avatar" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
            </svg>
          </div>
          <h1>Admin Portal</h1>
          <p>Sign in with your administrator credentials</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          {/* Email field */}
          <label className={`field ${fieldErrors.email ? 'field--error' : ''}`}>
            Email address
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                // Clear error as user types
                if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: '' }));
              }}
              onBlur={(e) => handleBlur('email', e.target.value)}
              placeholder="admin@airbnb.demo"
              autoComplete="email"
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby={fieldErrors.email ? 'email-error' : undefined}
            />
            {fieldErrors.email && (
              <span className="field__error" id="email-error" role="alert">
                {fieldErrors.email}
              </span>
            )}
          </label>

          {/* Password field */}
          <label className={`field ${fieldErrors.password ? 'field--error' : ''}`}>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (fieldErrors.password) setFieldErrors((p) => ({ ...p, password: '' }));
              }}
              onBlur={(e) => handleBlur('password', e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              aria-invalid={Boolean(fieldErrors.password)}
              aria-describedby={fieldErrors.password ? 'password-error' : undefined}
            />
            {fieldErrors.password && (
              <span className="field__error" id="password-error" role="alert">
                {fieldErrors.password}
              </span>
            )}
          </label>

          {/* Server / auth error */}
          {submitError && (
            <div className="login-card__submit-error" role="alert">
              ⚠ {submitError}
            </div>
          )}

          <button
            type="submit"
            className="btn btn--primary btn--block"
            disabled={loading}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        {/* Hint box */}
        <div className="login-card__hint">
          <p><strong>Demo credentials</strong></p>
          <p>Email: <code>admin@airbnb.demo</code></p>
          <p>Password: <code>Admin1234!</code></p>
          <p className="login-card__hint-note">
            Run <code>npm run seed</code> in the backend to create the demo admin account.
          </p>
        </div>
      </div>
    </div>
  );
}
