import { useEffect, useMemo, useState } from 'react';

import { createAdminUser, getAdminUsers, type User } from '../services/api';

const emptyForm = {
  name: '',
  email: '',
  password: '',
  role: 'student' as 'student' | 'faculty',
};

export default function UserManagement({ token }: { token?: string }) {
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const result = await getAdminUsers(token);
        setUsers(result);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Unable to load user records.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  const stats = useMemo(
    () => ({
      total: users.length,
      students: users.filter((user) => user.role === 'student').length,
      faculty: users.filter((user) => user.role === 'faculty').length,
      admins: users.filter((user) => user.role === 'admin').length,
    }),
    [users]
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setError('Please complete all user details.');
      return;
    }

    setSaving(true);

    try {
      const created = await createAdminUser(form, token);
      setUsers((current) => [created, ...current]);
      setForm(emptyForm);
      setSuccess(`Created ${created.name} successfully.`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unable to create this user.'
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="section-heading">
        <div>
          <h1>User Management</h1>
          <p>Manage student and faculty access for InsightEd.</p>
        </div>
      </div>

      {error && <div className="panel">{error}</div>}
      {success && <div className="panel">{success}</div>}

      <div className="stats-grid">
        <div className="panel">
          <h3>Total Users</h3>
          <h2>{stats.total}</h2>
        </div>
        <div className="panel">
          <h3>Students</h3>
          <h2>{stats.students}</h2>
        </div>
        <div className="panel">
          <h3>Faculty</h3>
          <h2>{stats.faculty}</h2>
        </div>
      </div>

      <div className="panel">
        <div className="panel-heading">
          <h2>Create account</h2>
        </div>

        <form onSubmit={handleSubmit} className="feedback-form">
          <div className="form-grid">
            <label>
              Full name
              <input
                value={form.name}
                onChange={(event) =>
                  setForm((current) => ({ ...current, name: event.target.value }))
                }
                placeholder="Enter full name"
              />
            </label>

            <label>
              Role
              <select
                value={form.role}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    role: event.target.value as 'student' | 'faculty',
                  }))
                }
              >
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
              </select>
            </label>

            <label>
              Email address
              <input
                type="email"
                value={form.email}
                onChange={(event) =>
                  setForm((current) => ({ ...current, email: event.target.value }))
                }
                placeholder="name@example.com"
              />
            </label>

            <label>
              Password
              <input
                type="password"
                value={form.password}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    password: event.target.value,
                  }))
                }
                placeholder="Minimum 12 characters"
                minLength={12}
              />
            </label>
          </div>

          <button type="submit" className="submit-button" disabled={saving}>
            {saving ? 'Creating account...' : 'Create user'}
          </button>
        </form>
      </div>

      <div className="panel">
        <div className="panel-heading">
          <h2>Registered users</h2>
        </div>

        {loading ? (
          <p>Loading users...</p>
        ) : users.length === 0 ? (
          <p>No users are available.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th align="left">Name</th>
                  <th align="left">Email</th>
                  <th align="center">Role</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td align="center">{user.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
