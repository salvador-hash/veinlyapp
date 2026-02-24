import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, AlertTriangle, Info } from 'lucide-react';
import { BLOOD_TYPES, BLOOD_COMPATIBILITY, type BloodType, type UrgencyLevel } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

const CreateEmergency = () => {
  const { user, createEmergency, users } = useApp();
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

  // Preview available donors
  const availableDonors = form.blood_type_needed && form.city
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
    toast({ title: '🎉 ¡Solicitud de emergencia creada exitosamente!' });
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
            <h1 className="text-2xl font-bold text-foreground">Nueva Solicitud de Emergencia</h1>
            <p className="text-muted-foreground text-sm">Completa los detalles para encontrar donantes compatibles</p>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="lg:col-span-2 bg-card rounded-xl border p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="patient_name">Nombre del Paciente *</Label>
                <Input id="patient_name" value={form.patient_name} onChange={e => update('patient_name', e.target.value)} className="mt-1.5" placeholder="Nombre completo del paciente" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Tipo de Sangre Necesario *</Label>
                  <Select value={form.blood_type_needed} onValueChange={v => update('blood_type_needed', v)}>
                    <SelectTrigger className="mt-1.5"><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                    <SelectContent>
                      {BLOOD_TYPES.map(bt => <SelectItem key={bt} value={bt}>{bt}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="units">Unidades Necesarias *</Label>
                  <Input id="units" type="number" min="1" value={form.units_needed} onChange={e => update('units_needed', e.target.value)} className="mt-1.5" placeholder="ej. 2" />
                </div>
              </div>
              <div>
                <Label htmlFor="hospital">Hospital *</Label>
                <Input id="hospital" value={form.hospital} onChange={e => update('hospital', e.target.value)} className="mt-1.5" placeholder="Nombre del hospital" />
              </div>
              <div>
                <Label htmlFor="address">Dirección *</Label>
                <Input id="address" value={form.address} onChange={e => update('address', e.target.value)} className="mt-1.5" placeholder="Dirección completa" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">Ciudad *</Label>
                  <Input id="city" value={form.city} onChange={e => update('city', e.target.value)} className="mt-1.5" />
                </div>
                <div>
                  <Label>Nivel de Urgencia *</Label>
                  <Select value={form.urgency_level} onValueChange={v => update('urgency_level', v)}>
                    <SelectTrigger className="mt-1.5"><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Normal">🟢 Normal</SelectItem>
                      <SelectItem value="Urgent">🟡 Urgente</SelectItem>
                      <SelectItem value="Critical">🔴 Crítico</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="contact">Número de Contacto *</Label>
                <Input id="contact" value={form.contact_number} onChange={e => update('contact_number', e.target.value)} className="mt-1.5" placeholder="+1 234 567 8900" />
              </div>
              <Button type="submit" className="w-full h-11 mt-2" disabled={!isValid || loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <AlertTriangle className="h-4 w-4 mr-2" />}
                Enviar Solicitud de Emergencia
              </Button>
            </form>
          </motion.div>

          {/* Side preview */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="space-y-4">
            <div className="bg-card rounded-xl border p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Info className="h-4 w-4 text-primary" /> Vista Previa
              </h3>
              {form.blood_type_needed && form.city ? (
                <>
                  <p className="text-xs text-muted-foreground mb-3">
                    Donantes <span className="font-semibold text-primary">{form.blood_type_needed}</span> compatibles en <span className="font-semibold">{form.city}</span>
                  </p>
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <p className="text-3xl font-bold text-foreground">{availableDonors.length}</p>
                    <p className="text-xs text-muted-foreground mt-1">donantes disponibles</p>
                  </div>
                  {availableDonors.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {availableDonors.slice(0, 3).map(d => (
                        <div key={d.id} className="flex items-center gap-2 text-xs p-2 rounded bg-muted/30">
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-[10px] font-bold text-primary">{d.full_name.charAt(0)}</span>
                          </div>
                          <span className="text-foreground">{d.full_name}</span>
                          <span className="ml-auto text-primary font-semibold">{d.blood_type}</span>
                        </div>
                      ))}
                      {availableDonors.length > 3 && (
                        <p className="text-[10px] text-muted-foreground text-center">+{availableDonors.length - 3} más</p>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <p className="text-xs text-muted-foreground">Selecciona un tipo de sangre y ciudad para ver donantes disponibles</p>
              )}
            </div>

            {form.urgency_level && (
              <div className={`rounded-xl border p-4 ${
                form.urgency_level === 'Critical' ? 'bg-destructive/5 border-destructive/20' :
                form.urgency_level === 'Urgent' ? 'bg-warning/5 border-warning/20' :
                'bg-success/5 border-success/20'
              }`}>
                <p className="text-xs font-semibold text-foreground">
                  {form.urgency_level === 'Critical' ? '🔴 Nivel Crítico' :
                   form.urgency_level === 'Urgent' ? '🟡 Nivel Urgente' : '🟢 Nivel Normal'}
                </p>
                <p className="text-[11px] text-muted-foreground mt-1">
                  {form.urgency_level === 'Critical' ? 'Los donantes recibirán notificaciones con alerta máxima' :
                   form.urgency_level === 'Urgent' ? 'Los donantes serán notificados con prioridad' :
                   'Los donantes recibirán una notificación estándar'}
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
