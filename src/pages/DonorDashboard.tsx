import { useApp } from '@/context/AppContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Heart, AlertTriangle, Activity, Users, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const DonorDashboard = () => {
  const { user, toggleAvailability, emergencies, donations } = useApp();
  const { toast } = useToast();

  if (!user) return null;

  const myDonations = donations.filter(d => d.donor_id === user.id);
  const completedDonations = myDonations.filter(d => d.status === 'completed').length;
  const openEmergencies = emergencies.filter(e => e.status === 'open' && e.city.toLowerCase() === user.city.toLowerCase());

  const handleToggle = () => {
    toggleAvailability();
    toast({
      title: !user.available ? "🎉 You are now available to save lives!" : "You are currently unavailable",
      variant: !user.available ? "default" : "destructive",
    });
  };

  return (
    <DashboardLayout>
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-1">
          Welcome back, {user.full_name.split(' ')[0]} 👋
        </h1>
        <p className="text-muted-foreground">Here's what's happening in your area</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Blood Type', value: user.blood_type, icon: Heart, color: 'text-primary', bg: 'bg-primary/5' },
          { label: 'Donations', value: myDonations.length, icon: Activity, color: 'text-primary', bg: 'bg-primary/5' },
          { label: 'Status', value: user.available ? 'Available' : 'Unavailable', icon: Users, color: user.available ? 'text-success' : 'text-muted-foreground', bg: user.available ? 'bg-success/5' : 'bg-muted' },
          { label: 'Nearby Emergencies', value: openEmergencies.length, icon: AlertTriangle, color: openEmergencies.length > 0 ? 'text-warning' : 'text-muted-foreground', bg: openEmergencies.length > 0 ? 'bg-warning/5' : 'bg-muted' },
        ].map((stat, i) => (
          <div key={i} className={`${stat.bg} rounded-xl border p-5 transition-all hover:shadow-md`}>
            <div className="flex items-center gap-2 mb-3">
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Lives saved banner */}
      {completedDonations > 0 && (
        <div className="bg-gradient-to-r from-primary/10 to-success/10 rounded-xl border border-primary/20 p-6 mb-8 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-lg font-bold text-foreground">You helped save {completedDonations} {completedDonations === 1 ? 'life' : 'lives'}!</p>
            <p className="text-sm text-muted-foreground">Thank you for being a hero in your community.</p>
          </div>
        </div>
      )}

      {/* Availability */}
      <div className="bg-card rounded-xl border p-6 mb-8 hover:shadow-sm transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-1">Availability</h2>
            <p className="text-sm text-muted-foreground">
              {user.available ? '✅ You are visible to hospitals in need' : 'Toggle to start receiving emergency requests'}
            </p>
          </div>
          <Button
            onClick={handleToggle}
            variant={user.available ? 'default' : 'outline'}
            className={`min-w-[120px] ${user.available ? 'bg-success hover:bg-success/90' : ''}`}
          >
            {user.available ? '● Available' : 'Go Available'}
          </Button>
        </div>
      </div>

      {/* Nearby Emergencies */}
      <div className="bg-card rounded-xl border p-6 mb-8">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Nearby Emergencies {openEmergencies.length > 0 && <span className="text-primary">({openEmergencies.length})</span>}
        </h2>
        {openEmergencies.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
              <Heart className="h-7 w-7 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground mb-1">No active emergencies in your area</p>
            <p className="text-xs text-muted-foreground">We'll notify you when someone needs help</p>
          </div>
        ) : (
          <div className="space-y-3">
            {openEmergencies.map(e => (
              <Link key={e.id} to={`/emergency/${e.id}`} className="block group">
                <div className="flex items-center justify-between p-4 rounded-lg border hover:border-primary/30 hover:bg-accent/50 transition-all duration-200">
                  <div>
                    <p className="font-medium text-foreground group-hover:text-primary transition-colors">{e.hospital}</p>
                    <p className="text-sm text-muted-foreground">Needs <span className="font-semibold text-primary">{e.blood_type_needed}</span> · {e.units_needed} units</p>
                  </div>
                  <span className={`text-xs font-medium px-3 py-1.5 rounded-full ${
                    e.urgency_level === 'Critical' ? 'bg-destructive/10 text-destructive animate-pulse-gentle' :
                    e.urgency_level === 'Urgent' ? 'bg-warning/10 text-warning' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {e.urgency_level}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* History */}
      <div className="bg-card rounded-xl border p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Donation History</h2>
        {myDonations.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
              <Activity className="h-7 w-7 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground mb-1">No donations yet</p>
            <p className="text-xs text-muted-foreground">Your donation history will appear here</p>
          </div>
        ) : (
          <div className="space-y-2">
            {myDonations.map(d => (
              <div key={d.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors">
                <span className="text-sm text-foreground">{new Date(d.date).toLocaleDateString()}</span>
                <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                  d.status === 'completed' ? 'bg-success/10 text-success' :
                  d.status === 'pending' ? 'bg-warning/10 text-warning' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {d.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DonorDashboard;
