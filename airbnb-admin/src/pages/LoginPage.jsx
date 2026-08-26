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
          <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false" className="login-card__logo">
            <path
              d="M16 1C7.163 1 0 8.163 0 17c0 8.836 7.163 16 16 16s16-7.164 16-16C32 8.163 24.837 1 16 1zm0 4c1.657 0 3 1.343 3 3s-1.343 3-3 3-3-1.343-3-3 1.343-3 3-3zm5.5 18H10.5a.5.5 0 0 1-.5-.5v-.5c0-3.038 2.686-5.5 6-5.5s6 2.462 6 5.5v.5a.5.5 0 0 1-.5.5z"
              fill="#ff385c"
            />
          </svg>
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
