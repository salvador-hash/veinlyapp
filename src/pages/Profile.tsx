import { useApp } from '@/context/AppContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Heart, MapPin, Phone, Mail, Sparkles, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const { user, toggleAvailability, donations } = useApp();
  const { toast } = useToast();

  if (!user) return null;

  const myDonations = donations.filter(d => d.donor_id === user.id);
  const completedDonations = myDonations.filter(d => d.status === 'completed').length;

  const handleToggle = () => {
    toggleAvailability();
    toast({
      title: !user.available ? "🎉 You are now available to save lives!" : "You are currently unavailable",
    });
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="bg-card rounded-xl border overflow-hidden shadow-sm">
          {/* Header */}
          <div className="bg-gradient-to-br from-secondary to-secondary/80 p-10 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 left-8 w-20 h-20 rounded-full border-2 border-primary-foreground/20" />
              <div className="absolute bottom-4 right-12 w-32 h-32 rounded-full border-2 border-primary-foreground/10" />
            </div>
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 ring-4 ring-primary/30">
                <span className="text-3xl font-bold text-primary-foreground">{user.full_name.charAt(0)}</span>
              </div>
              <h1 className="text-xl font-bold text-secondary-foreground">{user.full_name}</h1>
              <p className="text-secondary-foreground/70 text-sm capitalize flex items-center justify-center gap-1 mt-1">
                <Shield className="h-3 w-3" /> {user.role}
              </p>
              <div className="inline-flex items-center gap-1.5 mt-4 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                <Heart className="h-4 w-4" /> {user.blood_type}
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-3 text-sm p-3 rounded-lg bg-muted/50">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground">{user.email}</span>
            </div>
            <div className="flex items-center gap-3 text-sm p-3 rounded-lg bg-muted/50">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground">{user.phone}</span>
            </div>
            <div className="flex items-center gap-3 text-sm p-3 rounded-lg bg-muted/50">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground">{user.city}, {user.country}</span>
            </div>

            {user.role === 'donor' && (
              <>
                <div className="border-t pt-4 mt-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium text-foreground">Availability</p>
                      <p className="text-sm text-muted-foreground">
                        {user.available ? '✅ Visible to hospitals' : '⏸️ Not visible'}
                      </p>
                    </div>
                    <Button
                      onClick={handleToggle}
                      variant={user.available ? 'default' : 'outline'}
                      size="sm"
                      className={user.available ? 'bg-success hover:bg-success/90' : ''}
                    >
                      {user.available ? '● Available' : 'Unavailable'}
                    </Button>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="text-center p-6 rounded-xl bg-gradient-to-br from-primary/5 to-success/5 border border-primary/10">
                    <Sparkles className="h-6 w-6 text-primary mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground mb-1">Lives helped</p>
                    <p className="text-4xl font-bold text-primary">{completedDonations}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
