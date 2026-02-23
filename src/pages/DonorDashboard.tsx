import { useApp } from '@/context/AppContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Heart, AlertTriangle, Activity, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const DonorDashboard = () => {
  const { user, toggleAvailability, emergencies, donations } = useApp();
  const { toast } = useToast();

  if (!user) return null;

  const myDonations = donations.filter(d => d.donor_id === user.id);
  const openEmergencies = emergencies.filter(e => e.status === 'open' && e.city.toLowerCase() === user.city.toLowerCase());

  const handleToggle = () => {
    toggleAvailability();
    toast({
      title: !user.available ? "You are now available to save lives" : "You are currently unavailable",
      variant: !user.available ? "default" : "destructive",
    });
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-1">Welcome, {user.full_name}</h1>
        <p className="text-muted-foreground">Your donor dashboard</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Blood Type', value: user.blood_type, icon: Heart, color: 'text-primary' },
          { label: 'Donations', value: myDonations.length, icon: Activity, color: 'text-primary' },
          { label: 'Status', value: user.available ? 'Available' : 'Unavailable', icon: Users, color: user.available ? 'text-success' : 'text-muted-foreground' },
          { label: 'Nearby Emergencies', value: openEmergencies.length, icon: AlertTriangle, color: 'text-warning' },
        ].map((stat, i) => (
          <div key={i} className="bg-card rounded-lg border p-4">
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </div>
            <p className="text-xl font-bold text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Availability */}
      <div className="bg-card rounded-lg border p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Availability</h2>
            <p className="text-sm text-muted-foreground">
              {user.available ? 'You are visible to hospitals in need' : 'Toggle to start receiving emergency requests'}
            </p>
          </div>
          <Button
            onClick={handleToggle}
            variant={user.available ? 'default' : 'outline'}
            className={user.available ? 'bg-success hover:bg-success/90' : ''}
          >
            {user.available ? 'Available' : 'Go Available'}
          </Button>
        </div>
      </div>

      {/* Nearby Emergencies */}
      <div className="bg-card rounded-lg border p-6 mb-8">
        <h2 className="text-lg font-semibold text-foreground mb-4">Nearby Emergencies</h2>
        {openEmergencies.length === 0 ? (
          <p className="text-sm text-muted-foreground">No active emergencies in your area</p>
        ) : (
          <div className="space-y-3">
            {openEmergencies.map(e => (
              <Link key={e.id} to={`/emergency/${e.id}`} className="block">
                <div className="flex items-center justify-between p-3 rounded-md border hover:bg-accent transition-colors">
                  <div>
                    <p className="font-medium text-foreground">{e.hospital}</p>
                    <p className="text-sm text-muted-foreground">Needs {e.blood_type_needed} · {e.units_needed} units</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    e.urgency_level === 'Critical' ? 'bg-destructive/10 text-destructive' :
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
      <div className="bg-card rounded-lg border p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Donation History</h2>
        {myDonations.length === 0 ? (
          <p className="text-sm text-muted-foreground">No donations yet</p>
        ) : (
          <div className="space-y-2">
            {myDonations.map(d => (
              <div key={d.id} className="flex items-center justify-between p-3 rounded-md border">
                <span className="text-sm text-foreground">{new Date(d.date).toLocaleDateString()}</span>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
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
