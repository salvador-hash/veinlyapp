import { useApp } from '@/context/AppContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Bell, Check, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Notifications = () => {
  const { user, notifications, markNotificationRead } = useApp();

  if (!user) return null;

  const myNotifications = notifications
    .filter(n => n.user_id === user.id)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const unreadCount = myNotifications.filter(n => !n.read).length;

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notifications 🔔</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-muted-foreground">{unreadCount} unread notification{unreadCount > 1 ? 's' : ''}</p>
          )}
        </div>
      </div>

      {myNotifications.length === 0 ? (
        <div className="bg-card rounded-xl border p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Bell className="h-7 w-7 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground mb-1">No notifications yet</p>
          <p className="text-xs text-muted-foreground">You'll be notified when there's an emergency near you</p>
        </div>
      ) : (
        <div className="space-y-2">
          {myNotifications.map(n => (
            <div
              key={n.id}
              className={`bg-card rounded-xl border p-5 flex items-start justify-between gap-4 transition-all hover:shadow-sm ${
                !n.read ? 'border-primary/30 bg-primary/[0.02]' : ''
              }`}
            >
              <div className="flex gap-3 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  !n.read ? 'bg-primary/10' : 'bg-muted'
                }`}>
                  {n.emergency_id ? (
                    <AlertTriangle className={`h-4 w-4 ${!n.read ? 'text-primary' : 'text-muted-foreground'}`} />
                  ) : (
                    <Bell className={`h-4 w-4 ${!n.read ? 'text-primary' : 'text-muted-foreground'}`} />
                  )}
                </div>
                <div className="flex-1">
                  <p className={`text-sm leading-relaxed ${!n.read ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                    {n.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1.5">{new Date(n.created_at).toLocaleString()}</p>
                  {n.emergency_id && (
                    <Link to={`/emergency/${n.emergency_id}`} className="text-xs text-primary hover:underline mt-1.5 inline-block font-medium">
                      View Emergency →
                    </Link>
                  )}
                </div>
              </div>
              {!n.read && (
                <Button variant="ghost" size="sm" onClick={() => markNotificationRead(n.id)} className="text-muted-foreground hover:text-success">
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
