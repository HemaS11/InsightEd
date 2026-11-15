
import { useState } from 'react';

interface LoginProps {
  onLogin: (token: string, user: {
    id: number;
    name: string;
    email: string;
    role: string;
  }) => void;
}

const API_URL = (
  import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'
).replace(/\/$/, '');

export default function Login({ onLogin }: LoginProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}${isRegister ? '/auth/register' : '/auth/login'}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(
            isRegister
              ? { name, email, password, role }
              : { email, password }
          ),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Something went wrong.');
      }

      if (isRegister) {
        setIsRegister(false);
        setPassword('');
        setError('Account created successfully! Please log in.');
        return;
      }

      onLogin(data.access_token, data.user);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unable to connect to server.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-brand">
          <div className="auth-brand-icon">✦</div>
          <h1>InsightEd</h1>
          <p>ACADEMIC INTELLIGENCE</p>
        </div>

        <div className="auth-heading">
          <span className="eyebrow">WELCOME TO INSIGHTED</span>
          <h2>{isRegister ? 'Create your account' : 'Welcome back'}</h2>
          <p>
            {isRegister
              ? 'Join InsightEd to explore academic insights.'
              : 'Sign in to continue to your workspace.'}
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {isRegister && (
            <>
              <label>
                Full name
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </label>

              <label>
                Account type
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="student">Student</option>
                  <option value="faculty">Faculty</option>
                </select>
              </label>
            </>
          )}

          <label>
            Email address
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              minLength={isRegister ? 12 : undefined}
              required
            />
          </label>

          {error && (
            <p className="auth-message" role="status">{error}</p>
          )}

          <button className="auth-submit" type="submit" disabled={loading}>
            {loading
              ? 'Please wait...'
              : isRegister
                ? 'Create Account'
                : 'Sign In'}
          </button>
        </form>

        <div className="auth-switch">
          {isRegister ? 'Already have an account?' : 'New to InsightEd?'}
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
          >
            {isRegister ? 'Sign in' : 'Create an account'}
          </button>
        </div>

        <p className="auth-footer">
          InsightEd · Academic Intelligence Platform
        </p>
      </section>
    </main>
  );
}
