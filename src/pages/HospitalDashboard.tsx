import { useApp } from '@/context/AppContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { PlusCircle, AlertTriangle, Clock, CheckCircle, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

const HospitalDashboard = () => {
  const { user, emergencies, updateEmergencyStatus } = useApp();

  if (!user) return null;

  const myEmergencies = emergencies.filter(e => e.created_by === user.id);
  const openCount = myEmergencies.filter(e => e.status === 'open').length;
  const inProgressCount = myEmergencies.filter(e => e.status === 'in_progress').length;
  const completedCount = myEmergencies.filter(e => e.status === 'completed').length;

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Hospital Dashboard 🏥</h1>
          <p className="text-muted-foreground">Manage your emergency blood requests</p>
        </div>
        <Link to="/create-emergency">
          <Button className="gap-2 shadow-md hover:shadow-lg transition-shadow">
            <PlusCircle className="h-4 w-4" /> New Emergency
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Open', value: openCount, icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/5' },
          { label: 'In Progress', value: inProgressCount, icon: Clock, color: 'text-primary', bg: 'bg-primary/5' },
          { label: 'Completed', value: completedCount, icon: CheckCircle, color: 'text-success', bg: 'bg-success/5' },
        ].map((s, i) => (
          <div key={i} className={`${s.bg} rounded-xl border p-5 transition-all hover:shadow-md`}>
            <div className="flex items-center gap-2 mb-3">
              <s.icon className={`h-4 w-4 ${s.color}`} />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{s.label}</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Emergencies list */}
      <div className="bg-card rounded-xl border p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Your Requests</h2>
        {myEmergencies.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Activity className="h-7 w-7 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground mb-1">No emergency requests yet</p>
            <p className="text-xs text-muted-foreground mb-4">Create your first request to find donors</p>
            <Link to="/create-emergency">
              <Button className="gap-2"><PlusCircle className="h-4 w-4" /> Create Your First Request</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {myEmergencies.map(e => (
              <div key={e.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors">
                <div>
                  <p className="font-medium text-foreground">{e.patient_name}</p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-primary">{e.blood_type_needed}</span> · {e.units_needed} units · {e.hospital}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{new Date(e.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium px-3 py-1.5 rounded-full ${
                    e.urgency_level === 'Critical' ? 'bg-destructive/10 text-destructive' :
                    e.urgency_level === 'Urgent' ? 'bg-warning/10 text-warning' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {e.urgency_level}
                  </span>
                  <span className={`text-xs font-medium px-3 py-1.5 rounded-full ${
                    e.status === 'open' ? 'bg-warning/10 text-warning' :
                    e.status === 'in_progress' ? 'bg-primary/10 text-primary' :
                    'bg-success/10 text-success'
                  }`}>
                    {e.status.replace('_', ' ')}
                  </span>
                  {e.status !== 'completed' && (
                    <div className="flex gap-1">
                      <Link to={`/emergency/${e.id}`}>
                        <Button variant="outline" size="sm">View</Button>
                      </Link>
                      <Button variant="outline" size="sm" onClick={() => updateEmergencyStatus(e.id, 'completed')}>
                        Complete
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default HospitalDashboard;
