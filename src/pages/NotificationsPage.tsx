import { useQuery } from '@tanstack/react-query';
import { notificationsApi } from '../api/notifications';
import { Spinner } from '../components/ui/Spinner';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { Bell, CheckCheck } from 'lucide-react';

export function NotificationsPage() {
  const { isAuthenticated } = useAuth();

  const { data: notifsData, isLoading, refetch } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationsApi.list(),
    enabled: isAuthenticated,
  });

  const notifications = (notifsData as any)?.results || (Array.isArray(notifsData) ? notifsData : []);

  const handleMarkAll = async () => {
    await notificationsApi.markAllRead();
    refetch();
  };

  if (!isAuthenticated) {
    return (
      <div className="py-16 text-center text-xs text-[#786875] dark:text-[#C9B8C7]">
        Please sign in to view notifications.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-[#352633] dark:text-[#FCE4EC] tracking-tight">Notifications</h1>
          <p className="text-xs text-[#786875] dark:text-[#C9B8C7] mt-1">Updates on your inquiries, rescues, and favorited companions.</p>
        </div>
        {notifications.length > 0 && (
          <Button size="sm" variant="outline" onClick={handleMarkAll} className="text-xs">
            <CheckCheck className="h-3.5 w-3.5 mr-1" /> Mark All as Read
          </Button>
        )}
      </div>

      {isLoading ? (
        <Spinner size="lg" />
      ) : notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((n: any) => (
            <div
              key={n.id}
              className={`p-4 rounded-2xl border transition-all text-xs flex items-start gap-3 ${
                n.is_read
                  ? 'bg-white dark:bg-[#2A1A2A] border-[#F1D5DF] dark:border-[#4D2E4D]'
                  : 'bg-[#FCE4EC]/50 dark:bg-[#382338]/60 border-[#F48FB1] dark:border-[#E94EAA]/50'
              }`}
            >
              <div className="p-2 rounded-xl bg-white dark:bg-[#2A1A2A] border border-[#F1D5DF] dark:border-[#4D2E4D] text-[#F4435A] dark:text-[#F48FB1] shrink-0 mt-0.5">
                <Bell className="h-4 w-4" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-[#352633] dark:text-[#FCE4EC]">{n.title}</h4>
                  <span className="text-[10px] text-[#786875] dark:text-[#C9B8C7]">
                    {new Date(n.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-[#786875] dark:text-[#C9B8C7] leading-relaxed">{n.message}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No notifications yet"
          description="You will receive alerts here when a shelter reviews your application or a favorite pet's status changes."
        />
      )}
    </div>
  );
}
