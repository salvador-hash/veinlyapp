import { useParams } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { AlertTriangle, MapPin, Phone, User, Heart, Clock } from 'lucide-react';
import { BLOOD_COMPATIBILITY } from '@/types';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

const EmergencyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { emergencies, users, user, contactDonor } = useApp();
  const { toast } = useToast();
  const [contactModal, setContactModal] = useState<{ donorId: string; donorName: string } | null>(null);

  const emergency = emergencies.find(e => e.id === id);
  if (!emergency) {
    return (
      <DashboardLayout>
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-7 w-7 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">Emergency not found</p>
        </div>
      </DashboardLayout>
    );
  }

  const compatibleTypes = BLOOD_COMPATIBILITY[emergency.blood_type_needed] || [];
  const matchingDonors = users.filter(u =>
    u.role === 'donor' &&
    u.available &&
    compatibleTypes.includes(u.blood_type) &&
    u.city.toLowerCase() === emergency.city.toLowerCase()
  );

  const handleContact = () => {
    if (contactModal) {
      contactDonor(contactModal.donorId, emergency.id);
      toast({ title: `✅ Contacted ${contactModal.donorName} successfully!` });
      setContactModal(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        {/* Emergency Info */}
        <div className="bg-card rounded-xl border p-6 mb-6 shadow-sm">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{emergency.patient_name}</h1>
              <p className="text-muted-foreground flex items-center gap-1.5 mt-1">
                <MapPin className="h-3.5 w-3.5" /> {emergency.hospital}
              </p>
            </div>
            <div className="flex gap-2">
              <span className={`text-xs font-medium px-3 py-1.5 rounded-full ${
                emergency.urgency_level === 'Critical' ? 'bg-destructive/10 text-destructive animate-pulse-gentle' :
                emergency.urgency_level === 'Urgent' ? 'bg-warning/10 text-warning' :
                'bg-muted text-muted-foreground'
              }`}>
                {emergency.urgency_level}
              </span>
              <span className={`text-xs font-medium px-3 py-1.5 rounded-full ${
                emergency.status === 'open' ? 'bg-warning/10 text-warning' :
                emergency.status === 'in_progress' ? 'bg-primary/10 text-primary' :
                'bg-success/10 text-success'
              }`}>
                {emergency.status.replace('_', ' ')}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Blood Type', value: emergency.blood_type_needed, icon: Heart, color: 'text-primary' },
              { label: 'Units Needed', value: emergency.units_needed, icon: AlertTriangle, color: 'text-warning' },
              { label: 'Location', value: `${emergency.city}`, icon: MapPin, color: 'text-muted-foreground' },
              { label: 'Contact', value: emergency.contact_number, icon: Phone, color: 'text-muted-foreground' },
            ].map((item, i) => (
              <div key={i} className="p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-1.5 mb-1">
                  <item.icon className={`h-3.5 w-3.5 ${item.color}`} />
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                </div>
                <p className={`font-bold ${i === 0 ? 'text-primary text-lg' : 'text-foreground'}`}>{item.value}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 rounded-lg bg-muted/50 flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            Created {new Date(emergency.created_at).toLocaleString()}
          </div>
        </div>

        {/* Matching Donors */}
        <div className="bg-card rounded-xl border p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Compatible Donors <span className="text-primary">({matchingDonors.length})</span>
          </h2>
          {matchingDonors.length === 0 ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                <User className="h-7 w-7 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground mb-1">No compatible donors available</p>
              <p className="text-xs text-muted-foreground">We'll notify matching donors when they become available</p>
            </div>
          ) : (
            <div className="space-y-3">
              {matchingDonors.map(donor => (
                <div key={donor.id} className="flex items-center justify-between p-4 rounded-lg border hover:border-primary/30 hover:bg-accent/50 transition-all duration-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">{donor.full_name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{donor.full_name}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Heart className="h-3 w-3 text-primary" /> {donor.blood_type}
                        <span>·</span>
                        <MapPin className="h-3 w-3" /> {donor.city}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-success/10 text-success">
                      ● Available
                    </span>
                    {user?.role === 'hospital' && emergency.status === 'open' && (
                      <Button
                        size="sm"
                        onClick={() => setContactModal({ donorId: donor.id, donorName: donor.full_name })}
                        className="shadow-sm"
                      >
                        Contact
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Contact Confirmation Modal */}
      <Dialog open={!!contactModal} onOpenChange={() => setContactModal(null)}>
        <DialogContent className="rounded-xl">
          <DialogHeader>
            <DialogTitle>Contact Donor</DialogTitle>
            <DialogDescription>
              Are you sure you want to contact <span className="font-medium text-foreground">{contactModal?.donorName}</span> for this emergency? This will change the request status to "In Progress".
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setContactModal(null)}>Cancel</Button>
            <Button onClick={handleContact}>Confirm Contact</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default EmergencyDetail;
