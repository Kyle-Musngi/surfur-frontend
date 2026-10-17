import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { ErrorMessage } from '../components/ui/ErrorMessage';

export function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== passwordConfirm) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await authApi.register({
        full_name: fullName,
        email,
        password,
        password_confirm: passwordConfirm,
      });
      // Auto-login
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      const msg = err.response?.data ? JSON.stringify(err.response.data) : 'Registration failed. Check password requirements.';
      setError(msg);
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
          <h1 className="text-2xl font-black text-[#352633] dark:text-[#FCE4EC]">Join SurFur</h1>
          <p className="text-xs text-[#786875] dark:text-[#C9B8C7]">
            Create an adopter account to inquire, save favorites, and connect with shelters.
          </p>
        </div>

        {error && <ErrorMessage message={error} />}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-[#352633] dark:text-[#FCE4EC] mb-1">Full Name</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-2.5 rounded-2xl border border-[#F1D5DF] dark:border-[#4D2E4D] bg-[#FCE4EC]/30 dark:bg-[#231423] text-[#352633] dark:text-[#FCE4EC] focus:ring-2 focus:ring-[#F48FB1] outline-none"
              placeholder="Maria Santos"
            />
          </div>

          <div>
            <label className="block font-bold text-[#352633] dark:text-[#FCE4EC] mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 rounded-2xl border border-[#F1D5DF] dark:border-[#4D2E4D] bg-[#FCE4EC]/30 dark:bg-[#231423] text-[#352633] dark:text-[#FCE4EC] focus:ring-2 focus:ring-[#F48FB1] outline-none"
              placeholder="maria@example.com"
            />
          </div>

          <div>
            <label className="block font-bold text-[#352633] dark:text-[#FCE4EC] mb-1">Password (Min. 8 chars)</label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2.5 rounded-2xl border border-[#F1D5DF] dark:border-[#4D2E4D] bg-[#FCE4EC]/30 dark:bg-[#231423] text-[#352633] dark:text-[#FCE4EC] focus:ring-2 focus:ring-[#F48FB1] outline-none"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block font-bold text-[#352633] dark:text-[#FCE4EC] mb-1">Confirm Password</label>
            <input
              type="password"
              required
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              className="w-full p-2.5 rounded-2xl border border-[#F1D5DF] dark:border-[#4D2E4D] bg-[#FCE4EC]/30 dark:bg-[#231423] text-[#352633] dark:text-[#FCE4EC] focus:ring-2 focus:ring-[#F48FB1] outline-none"
              placeholder="••••••••"
            />
          </div>

          <Button type="submit" size="md" className="w-full font-bold" isLoading={loading}>
            Create Free Account
          </Button>
        </form>

        <div className="text-center text-xs text-[#786875] dark:text-[#C9B8C7] pt-2 border-t border-[#F1D5DF] dark:border-[#4D2E4D]">
          Already registered?{' '}
          <Link to="/login" className="text-[#F4435A] dark:text-[#F48FB1] font-bold hover:underline">
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
}
