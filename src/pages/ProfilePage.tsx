import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authApi } from '../api/auth';
import { Button } from '../components/ui/Button';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { User, Shield, CheckCircle2 } from 'lucide-react';

export function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phone_number || '');
  const [city, setCity] = useState(user?.city || '');
  const [emailNotifications, setEmailNotifications] = useState(user?.email_notifications ?? true);

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="py-16 text-center text-xs text-[#786875] dark:text-[#C9B8C7]">
        Please sign in to view your profile.
      </div>
    );
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setSaving(true);

    try {
      await authApi.updateProfile({
        full_name: fullName,
        phone_number: phoneNumber,
        city,
        email_notifications: emailNotifications,
      });
      await refreshUser();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.response?.data ? JSON.stringify(err.response.data) : 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-black text-[#352633] dark:text-[#FCE4EC] tracking-tight">Your Profile</h1>
        <p className="text-xs text-[#786875] dark:text-[#C9B8C7] mt-1">Manage your contact details and preferences.</p>
      </div>

      <div className="bg-white dark:bg-[#2A1A2A] p-6 sm:p-8 rounded-3xl border border-[#F1D5DF] dark:border-[#4D2E4D] shadow-sm space-y-6 text-xs">
        {error && <ErrorMessage message={error} />}
        {success && (
          <div className="p-3 bg-[#DDF5D5]/60 dark:bg-[#223323] border border-[#DDF5D5] dark:border-[#382338] text-[#2D6A4F] dark:text-[#74C69D] rounded-xl font-bold flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" /> Profile updated successfully!
          </div>
        )}

        <div className="flex items-center gap-4 pb-4 border-b border-[#F1D5DF] dark:border-[#4D2E4D]">
          <div className="w-14 h-14 rounded-2xl bg-[#FCE4EC] dark:bg-[#382338] text-[#F4435A] dark:text-[#F48FB1] flex items-center justify-center text-xl font-bold">
            {user.full_name?.charAt(0) || 'U'}
          </div>
          <div>
            <h3 className="font-bold text-sm text-[#352633] dark:text-[#FCE4EC]">{user.full_name}</h3>
            <p className="text-[#786875] dark:text-[#C9B8C7]">{user.email}</p>
            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-[#FCE4EC]/50 dark:bg-[#382338] text-[10px] font-bold uppercase text-[#F4435A] dark:text-[#F48FB1]">
              Role: {user.role.replace('_', ' ')}
            </span>
          </div>
        </div>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block font-bold text-[#352633] dark:text-[#FCE4EC] mb-1">Full Name</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#F1D5DF] dark:border-[#4D2E4D] bg-white dark:bg-[#231423] text-[#352633] dark:text-[#FCE4EC] outline-none focus:ring-2 focus:ring-[#F48FB1]"
            />
          </div>

          <div>
            <label className="block font-bold text-[#352633] dark:text-[#FCE4EC] mb-1">Phone Number (PH)</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="0917 XXX XXXX"
              className="w-full p-2.5 rounded-xl border border-[#F1D5DF] dark:border-[#4D2E4D] bg-white dark:bg-[#231423] text-[#352633] dark:text-[#FCE4EC] outline-none focus:ring-2 focus:ring-[#F48FB1]"
            />
          </div>

          <div>
            <label className="block font-bold text-[#352633] dark:text-[#FCE4EC] mb-1">Cebu Municipality / City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Cebu City"
              className="w-full p-2.5 rounded-xl border border-[#F1D5DF] dark:border-[#4D2E4D] bg-white dark:bg-[#231423] text-[#352633] dark:text-[#FCE4EC] outline-none focus:ring-2 focus:ring-[#F48FB1]"
            />
          </div>

          <div className="pt-2 border-t border-[#F1D5DF] dark:border-[#4D2E4D]">
            <label className="flex items-center gap-2 cursor-pointer font-medium text-[#352633] dark:text-[#FCE4EC]">
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="rounded accent-[#F4435A]"
              />
              <span>Receive email notifications for adoption inquiry updates</span>
            </label>
          </div>

          <Button type="submit" size="md" className="w-full font-bold bg-[#F4435A] hover:bg-[#C62845] text-white border-0 shadow-md shadow-[#F4435A]/20" isLoading={saving}>
            Save Changes
          </Button>
        </form>
      </div>
    </div>
  );
}
