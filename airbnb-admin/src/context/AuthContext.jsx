/**
 * AuthContext — admin portal authentication state management.
 *
 * Similar to the frontend AuthContext, but with an additional role guard:
 * only users whose role === 'admin' are permitted access.  Any token that
 * resolves to a non-admin user is immediately cleared, preventing hosts or
 * regular users from accessing the admin portal even if they somehow obtain
 * a valid JWT.
 *
 * Token storage key: 'admin_token' (separate from the frontend's key so
 * both apps can be open simultaneously without token collision).
 *
 * Usage:
 *   const { user, login, logout } = useAuth();
 */
import { createContext, useContext, useEffect, useState } from 'react';
import { loginRequest, getMeRequest } from '../api/auth';

const AuthContext = createContext(null);

/** localStorage key for the admin JWT — distinct from the frontend's key. */
const TOKEN_KEY = 'admin_token';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // On mount: try to rehydrate session from a stored token.
    // If the token is valid but the user isn't an admin, clear it.
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }
    getMeRequest()
      .then((res) => {
        if (res.data.user.role === 'admin') {
          // Token is valid and user is an admin — restore the session
          setUser(res.data.user);
        } else {
          // Valid token but wrong role — reject silently
          localStorage.removeItem(TOKEN_KEY);
        }
      })
      .catch(() => {
        // Expired or invalid token — clear it
        localStorage.removeItem(TOKEN_KEY);
      })
      .finally(() => setLoading(false));
  }, []);

  /**
   * Authenticate against POST /api/users/login.
   * Throws an error if credentials are wrong OR if the user is not an admin,
   * so the login form can display the appropriate message.
   */
  const login = async (email, password) => {
    const res = await loginRequest(email, password);
    const { token, user: u } = res.data;

    // Enforce admin-only access at the application level
    if (u.role !== 'admin') {
      throw new Error('Access denied. Admin credentials required.');
    }

    localStorage.setItem(TOKEN_KEY, token);
    setUser(u);
    return u;
  };

  /** Remove the stored token and clear state, effectively logging out. */
  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/** Hook to consume AuthContext — throws if used outside AuthProvider. */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
