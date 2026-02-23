import { useApp } from '@/context/AppContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Bell, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Notifications = () => {
  const { user, notifications, markNotificationRead } = useApp();

  if (!user) return null;

  const myNotifications = notifications
    .filter(n => n.user_id === user.id)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-foreground mb-6">Notifications</h1>
      {myNotifications.length === 0 ? (
        <div className="bg-card rounded-lg border p-12 text-center">
          <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {myNotifications.map(n => (
            <div key={n.id} className={`bg-card rounded-lg border p-4 flex items-start justify-between gap-4 ${!n.read ? 'border-primary/30' : ''}`}>
              <div className="flex-1">
                <p className={`text-sm ${!n.read ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>{n.message}</p>
                <p className="text-xs text-muted-foreground mt-1">{new Date(n.created_at).toLocaleString()}</p>
                {n.emergency_id && (
                  <Link to={`/emergency/${n.emergency_id}`} className="text-xs text-primary hover:underline mt-1 inline-block">
                    View Emergency →
                  </Link>
                )}
              </div>
              {!n.read && (
                <Button variant="ghost" size="sm" onClick={() => markNotificationRead(n.id)}>
                  <Check className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Notifications;
