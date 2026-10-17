import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { ErrorMessage } from '../components/ui/ErrorMessage';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white dark:bg-[#2A1A2A] p-8 rounded-3xl border border-[#F1D5DF] dark:border-[#4D2E4D] shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <img
              src="/images/sulfor-logo.jpeg"
              alt="SurFur Logo"
              className="h-14 w-auto object-contain rounded-2xl shadow-xs"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/images/surfur-logo.jpg';
              }}
            />
          </div>
          <h1 className="text-2xl font-black text-[#352633] dark:text-[#FCE4EC]">Log in to SurFur</h1>
          <p className="text-xs text-[#786875] dark:text-[#C9B8C7]">
            Access your saved favorites and track adoption applications.
          </p>
        </div>

        {error && <ErrorMessage message={error} />}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-[#352633] dark:text-[#FCE4EC] mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 rounded-2xl border border-[#F1D5DF] dark:border-[#4D2E4D] bg-[#FCE4EC]/30 dark:bg-[#231423] text-[#352633] dark:text-[#FCE4EC] focus:ring-2 focus:ring-[#F48FB1] outline-none"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block font-bold text-[#352633] dark:text-[#FCE4EC] mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2.5 rounded-2xl border border-[#F1D5DF] dark:border-[#4D2E4D] bg-[#FCE4EC]/30 dark:bg-[#231423] text-[#352633] dark:text-[#FCE4EC] focus:ring-2 focus:ring-[#F48FB1] outline-none"
              placeholder="••••••••"
            />
          </div>

          <Button type="submit" size="md" className="w-full font-bold" isLoading={loading}>
            Sign In
          </Button>
        </form>

        <div className="text-center text-xs text-[#786875] dark:text-[#C9B8C7] pt-2 border-t border-[#F1D5DF] dark:border-[#4D2E4D]">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#F4435A] dark:text-[#F48FB1] font-bold hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}
