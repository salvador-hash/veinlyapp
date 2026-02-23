import { useParams } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { AlertTriangle, MapPin, Phone, User, Heart } from 'lucide-react';
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
        <p className="text-muted-foreground">Emergency not found</p>
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
      toast({ title: `Contacted ${contactModal.donorName} successfully` });
      setContactModal(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        {/* Emergency Info */}
        <div className="bg-card rounded-lg border p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{emergency.patient_name}</h1>
              <p className="text-muted-foreground">{emergency.hospital}</p>
            </div>
            <div className="flex gap-2">
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                emergency.urgency_level === 'Critical' ? 'bg-destructive/10 text-destructive' :
                emergency.urgency_level === 'Urgent' ? 'bg-warning/10 text-warning' :
                'bg-muted text-muted-foreground'
              }`}>
                {emergency.urgency_level}
              </span>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                emergency.status === 'open' ? 'bg-warning/10 text-warning' :
                emergency.status === 'in_progress' ? 'bg-primary/10 text-primary' :
                'bg-success/10 text-success'
              }`}>
                {emergency.status.replace('_', ' ')}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Blood Type</p>
              <p className="font-bold text-primary text-lg">{emergency.blood_type_needed}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Units Needed</p>
              <p className="font-bold text-foreground text-lg">{emergency.units_needed}</p>
            </div>
            <div className="flex items-start gap-1">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Location</p>
                <p className="text-sm text-foreground">{emergency.address}, {emergency.city}</p>
              </div>
            </div>
            <div className="flex items-start gap-1">
              <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Contact</p>
                <p className="text-sm text-foreground">{emergency.contact_number}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Matching Donors */}
        <div className="bg-card rounded-lg border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Compatible Donors ({matchingDonors.length})
          </h2>
          {matchingDonors.length === 0 ? (
            <div className="text-center py-8">
              <AlertTriangle className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No compatible donors available in this area</p>
            </div>
          ) : (
            <div className="space-y-3">
              {matchingDonors.map(donor => (
                <div key={donor.id} className="flex items-center justify-between p-4 rounded-md border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{donor.full_name}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Heart className="h-3 w-3" /> {donor.blood_type}
                        <span>·</span>
                        <MapPin className="h-3 w-3" /> {donor.city}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-success/10 text-success">
                      Available
                    </span>
                    {user?.role === 'hospital' && emergency.status === 'open' && (
                      <Button
                        size="sm"
                        onClick={() => setContactModal({ donorId: donor.id, donorName: donor.full_name })}
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact Donor</DialogTitle>
            <DialogDescription>
              Are you sure you want to contact {contactModal?.donorName} for this emergency? This will change the request status to "In Progress".
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setContactModal(null)}>Cancel</Button>
            <Button onClick={handleContact}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default EmergencyDetail;
