import { useApp } from '@/context/AppContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Heart, MapPin, Phone, Mail } from 'lucide-react';
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
      title: !user.available ? "You are now available to save lives" : "You are currently unavailable",
    });
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="bg-card rounded-lg border overflow-hidden">
          {/* Header */}
          <div className="bg-secondary p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary">{user.full_name.charAt(0)}</span>
            </div>
            <h1 className="text-xl font-bold text-secondary-foreground">{user.full_name}</h1>
            <p className="text-secondary-foreground/70 text-sm capitalize">{user.role}</p>
            <div className="inline-flex items-center gap-1 mt-3 bg-primary/20 text-primary-foreground px-3 py-1 rounded-full text-sm font-bold">
              <Heart className="h-4 w-4" /> {user.blood_type}
            </div>
          </div>

          {/* Info */}
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground">{user.email}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground">{user.phone}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground">{user.city}, {user.country}</span>
            </div>

            {user.role === 'donor' && (
              <>
                <div className="border-t pt-4 mt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Availability</p>
                      <p className="text-sm text-muted-foreground">
                        {user.available ? 'You are visible to hospitals' : 'You are not visible'}
                      </p>
                    </div>
                    <Button
                      onClick={handleToggle}
                      variant={user.available ? 'default' : 'outline'}
                      size="sm"
                      className={user.available ? 'bg-success hover:bg-success/90' : ''}
                    >
                      {user.available ? 'Available' : 'Unavailable'}
                    </Button>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground">Lives helped</p>
                  <p className="text-3xl font-bold text-primary">{completedDonations}</p>
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
