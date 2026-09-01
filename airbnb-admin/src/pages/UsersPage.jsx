/**
 * UsersPage
 *
 * Lists every registered user on the platform.
 * Admins can:
 *   - Change a user's role inline via a <select> dropdown
 *     (calls PATCH /api/admin/users/:id/role)
 *   - Delete a user account after confirmation
 *     (calls DELETE /api/admin/users/:id)
 *
 * The currently logged-in admin's own row has its role selector and delete
 * button disabled to prevent accidental self-demotion or self-deletion.
 *
 * Role options are defined in the ROLES constant to stay in sync with the
 * backend User model's enum values.
 */
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import '../styles/table.css';

const ROLES = ['user', 'host', 'admin'];

export default function UsersPage() {
  const { user: me } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    getAllUsers()
      .then((res) => setUsers(res.data.data))
      .catch(() => setError('Could not load users.'))
      .finally(() => setLoading(false));
  }, []);

  const handleRoleChange = async (id, role) => {
    setActionError('');
    try {
      const res = await updateUserRole(id, role);
      setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, role: res.data.data.role } : u)));
    } catch (err) {
      setActionError(err.response?.data?.message || 'Could not update role.');
    }
  };

  const handleDelete = async (id, username) => {
    if (!window.confirm(`Delete user "${username}"? This cannot be undone.`)) return;
    setActionError('');
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      setActionError(err.response?.data?.message || 'Could not delete user.');
    }
  };

  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">Users</h1>
        <span className="page__count">{users.length} total</span>
      </div>

      {loading && <p className="text-muted">Loading…</p>}
      {error && <p className="text-error">{error}</p>}
      {actionError && <p className="text-error">{actionError}</p>}

      {!loading && !error && (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>
                    <strong>{u.username}</strong>
                    {u._id === me?.id && <span className="badge badge--me"> (you)</span>}
                  </td>
                  <td>{u.email}</td>
                  <td>
                    <select
                      className="role-select"
                      value={u.role}
                      onChange={(e) => handleRoleChange(u._id, e.target.value)}
                      disabled={u._id === me?.id}
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn btn--danger btn--sm"
                      onClick={() => handleDelete(u._id, u.username)}
                      disabled={u._id === me?.id}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
