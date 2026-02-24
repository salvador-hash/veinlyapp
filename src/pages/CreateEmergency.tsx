import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, AlertTriangle, Info } from 'lucide-react';
import { BLOOD_TYPES, BLOOD_COMPATIBILITY, type BloodType, type UrgencyLevel } from '@/types';
import AddressAutocomplete from '@/components/AddressAutocomplete';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

const CreateEmergency = () => {
  const { user, createEmergency, users } = useApp();
  const { t } = useLanguage();
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

  const availableDonorsList = form.blood_type_needed && form.city
    ? users.filter(u => {
        const compatibleTypes = BLOOD_COMPATIBILITY[form.blood_type_needed as BloodType] || [];
        return u.role === 'donor' && u.available &&
          u.city.toLowerCase() === form.city.toLowerCase() &&
          compatibleTypes.includes(u.blood_type);
      })
    : [];

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
    toast({ title: t('emergencyCreated') });
    navigate('/dashboard');
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="h-5 w-5 text-destructive" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t('newEmergencyRequest')}</h1>
            <p className="text-muted-foreground text-sm">{t('fillDetails')}</p>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="lg:col-span-2 bg-card rounded-xl border p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="patient_name">{t('patientName')}</Label>
                <Input id="patient_name" value={form.patient_name} onChange={e => update('patient_name', e.target.value)} className="mt-1.5" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{t('bloodTypeNeeded')}</Label>
                  <Select value={form.blood_type_needed} onValueChange={v => update('blood_type_needed', v)}>
                    <SelectTrigger className="mt-1.5"><SelectValue placeholder={t('select')} /></SelectTrigger>
                    <SelectContent>
                      {BLOOD_TYPES.map(bt => <SelectItem key={bt} value={bt}>{bt}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="units">{t('unitsNeeded')}</Label>
                  <Input id="units" type="number" min="1" value={form.units_needed} onChange={e => update('units_needed', e.target.value)} className="mt-1.5" />
                </div>
              </div>
              <div>
                <Label htmlFor="hospital">{t('hospitalName')}</Label>
                <Input id="hospital" value={form.hospital} onChange={e => update('hospital', e.target.value)} className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="address">{t('address')}</Label>
                <AddressAutocomplete
                  value={form.address}
                  onChange={v => update('address', v)}
                  onSelectPlace={place => {
                    if (place.name && !form.hospital) update('hospital', place.name);
                    if (place.city && !form.city) update('city', place.city);
                  }}
                  placeholder={t('searchAddress')}
                  className="mt-1.5"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">{t('city')}</Label>
                  <Input id="city" value={form.city} onChange={e => update('city', e.target.value)} className="mt-1.5" />
                </div>
                <div>
                  <Label>{t('urgencyLevel')}</Label>
                  <Select value={form.urgency_level} onValueChange={v => update('urgency_level', v)}>
                    <SelectTrigger className="mt-1.5"><SelectValue placeholder={t('select')} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Normal">🟢 {t('normal')}</SelectItem>
                      <SelectItem value="Urgent">🟡 {t('urgent')}</SelectItem>
                      <SelectItem value="Critical">🔴 {t('critical')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="contact">{t('contactNumber')}</Label>
                <Input id="contact" value={form.contact_number} onChange={e => update('contact_number', e.target.value)} className="mt-1.5" placeholder="+1 234 567 8900" />
              </div>
              <Button type="submit" className="w-full h-11 mt-2" disabled={!isValid || loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <AlertTriangle className="h-4 w-4 mr-2" />}
                {t('submitEmergency')}
              </Button>
            </form>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="space-y-4">
            <div className="bg-card rounded-xl border p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Info className="h-4 w-4 text-primary" /> {t('preview')}
              </h3>
              {form.blood_type_needed && form.city ? (
                <>
                  <p className="text-xs text-muted-foreground mb-3">
                    {t('compatibleDonorsIn')} <span className="font-semibold text-primary">{form.blood_type_needed}</span> - <span className="font-semibold">{form.city}</span>
                  </p>
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <p className="text-3xl font-bold text-foreground">{availableDonorsList.length}</p>
                    <p className="text-xs text-muted-foreground mt-1">{t('availableDonors')}</p>
                  </div>
                  {availableDonorsList.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {availableDonorsList.slice(0, 3).map(d => (
                        <div key={d.id} className="flex items-center gap-2 text-xs p-2 rounded bg-muted/30">
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-[10px] font-bold text-primary">{d.full_name.charAt(0)}</span>
                          </div>
                          <span className="text-foreground">{d.full_name}</span>
                          <span className="ml-auto text-primary font-semibold">{d.blood_type}</span>
                        </div>
                      ))}
                      {availableDonorsList.length > 3 && (
                        <p className="text-[10px] text-muted-foreground text-center">+{availableDonorsList.length - 3} {t('more')}</p>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <p className="text-xs text-muted-foreground">{t('selectBloodAndCity')}</p>
              )}
            </div>

            {form.urgency_level && (
              <div className={`rounded-xl border p-4 ${
                form.urgency_level === 'Critical' ? 'bg-destructive/5 border-destructive/20' :
                form.urgency_level === 'Urgent' ? 'bg-warning/5 border-warning/20' :
                'bg-success/5 border-success/20'
              }`}>
                <p className="text-xs font-semibold text-foreground">
                  {form.urgency_level === 'Critical' ? t('criticalLevel') :
                   form.urgency_level === 'Urgent' ? t('urgentLevel') : t('normalLevel')}
                </p>
                <p className="text-[11px] text-muted-foreground mt-1">
                  {form.urgency_level === 'Critical' ? t('criticalNotif') :
                   form.urgency_level === 'Urgent' ? t('urgentNotif') : t('normalNotif')}
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateEmergency;
