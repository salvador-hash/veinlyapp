import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, AlertTriangle } from 'lucide-react';
import { BLOOD_TYPES, type BloodType, type UrgencyLevel } from '@/types';
import { useToast } from '@/hooks/use-toast';

const CreateEmergency = () => {
  const { user, createEmergency } = useApp();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    patient_name: '',
    blood_type_needed: '' as BloodType | '',
    units_needed: '',
    hospital: '',
    address: '',
    urgency_level: '' as UrgencyLevel | '',
    contact_number: '',
    city: user?.city || '',
  });

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));
  const isValid = form.patient_name && form.blood_type_needed && form.units_needed && form.hospital && form.address && form.urgency_level && form.contact_number && form.city;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    createEmergency({
      patient_name: form.patient_name,
      blood_type_needed: form.blood_type_needed as BloodType,
      units_needed: parseInt(form.units_needed),
      hospital: form.hospital,
      address: form.address,
      urgency_level: form.urgency_level as UrgencyLevel,
      contact_number: form.contact_number,
      city: form.city,
    });
    setLoading(false);
    toast({ title: '🎉 Emergency request created successfully!' });
    navigate('/dashboard');
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="h-5 w-5 text-destructive" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">New Emergency Request</h1>
            <p className="text-muted-foreground text-sm">Fill in the details to find compatible donors</p>
          </div>
        </div>

        <div className="bg-card rounded-xl border p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="patient_name">Patient Name *</Label>
              <Input id="patient_name" value={form.patient_name} onChange={e => update('patient_name', e.target.value)} className="mt-1.5" placeholder="Enter patient name" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Blood Type Needed *</Label>
                <Select value={form.blood_type_needed} onValueChange={v => update('blood_type_needed', v)}>
                  <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {BLOOD_TYPES.map(bt => <SelectItem key={bt} value={bt}>{bt}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="units">Units Needed *</Label>
                <Input id="units" type="number" min="1" value={form.units_needed} onChange={e => update('units_needed', e.target.value)} className="mt-1.5" placeholder="e.g. 2" />
              </div>
            </div>
            <div>
              <Label htmlFor="hospital">Hospital *</Label>
              <Input id="hospital" value={form.hospital} onChange={e => update('hospital', e.target.value)} className="mt-1.5" placeholder="Hospital name" />
            </div>
            <div>
              <Label htmlFor="address">Address *</Label>
              <Input id="address" value={form.address} onChange={e => update('address', e.target.value)} className="mt-1.5" placeholder="Full address" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City *</Label>
                <Input id="city" value={form.city} onChange={e => update('city', e.target.value)} className="mt-1.5" />
              </div>
              <div>
                <Label>Urgency Level *</Label>
                <Select value={form.urgency_level} onValueChange={v => update('urgency_level', v)}>
                  <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Normal">🟢 Normal</SelectItem>
                    <SelectItem value="Urgent">🟡 Urgent</SelectItem>
                    <SelectItem value="Critical">🔴 Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="contact">Contact Number *</Label>
              <Input id="contact" value={form.contact_number} onChange={e => update('contact_number', e.target.value)} className="mt-1.5" placeholder="+1 234 567 8900" />
            </div>
            <Button type="submit" className="w-full h-11 mt-2" disabled={!isValid || loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <AlertTriangle className="h-4 w-4 mr-2" />}
              Submit Emergency Request
            </Button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateEmergency;
