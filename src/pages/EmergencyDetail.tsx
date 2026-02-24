import { useParams } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { AlertTriangle, MapPin, Phone, User, Heart, Clock, Shield, Activity } from 'lucide-react';
import { BLOOD_COMPATIBILITY } from '@/types';
import { useState } from 'react';
import { motion } from 'framer-motion';
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
  const { emergencies, users, user, contactDonor, donations } = useApp();
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
          <p className="text-muted-foreground">Emergencia no encontrada</p>
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

  const alreadyContacted = donations
    .filter(d => d.emergency_id === emergency.id)
    .map(d => d.donor_id);

  const handleContact = () => {
    if (contactModal) {
      contactDonor(contactModal.donorId, emergency.id);
      toast({ title: `✅ ¡Se contactó a ${contactModal.donorName} exitosamente!` });
      setContactModal(null);
    }
  };

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return 'Hace menos de 1 hora';
    if (hours < 24) return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
    const days = Math.floor(hours / 24);
    return `Hace ${days} día${days > 1 ? 's' : ''}`;
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        {/* Emergency Info */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl border p-6 mb-6 shadow-sm">
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
                {emergency.urgency_level === 'Critical' ? '🔴 Crítico' : emergency.urgency_level === 'Urgent' ? '🟡 Urgente' : '🟢 Normal'}
              </span>
              <span className={`text-xs font-medium px-3 py-1.5 rounded-full ${
                emergency.status === 'open' ? 'bg-warning/10 text-warning' :
                emergency.status === 'in_progress' ? 'bg-primary/10 text-primary' :
                'bg-success/10 text-success'
              }`}>
                {emergency.status === 'open' ? 'Abierta' : emergency.status === 'in_progress' ? 'En Progreso' : 'Completada'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Tipo de Sangre', value: emergency.blood_type_needed, icon: Heart, color: 'text-primary' },
              { label: 'Unidades', value: emergency.units_needed, icon: Activity, color: 'text-warning' },
              { label: 'Ubicación', value: emergency.city, icon: MapPin, color: 'text-muted-foreground' },
              { label: 'Contacto', value: emergency.contact_number, icon: Phone, color: 'text-muted-foreground' },
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
            {timeAgo(emergency.created_at)} · {new Date(emergency.created_at).toLocaleString()}
          </div>

          {/* Compatible types info */}
          <div className="mt-4 p-4 rounded-lg border border-primary/10 bg-primary/[0.02]">
            <p className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-primary" /> Tipos de sangre compatibles para {emergency.blood_type_needed}:
            </p>
            <div className="flex flex-wrap gap-2">
              {compatibleTypes.map(t => (
                <span key={t} className="bg-primary/10 text-primary px-2.5 py-1 rounded-full text-xs font-semibold">{t}</span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Matching Donors */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl border p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Donantes Compatibles <span className="text-primary">({matchingDonors.length})</span>
          </h2>
          {matchingDonors.length === 0 ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                <User className="h-7 w-7 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground mb-1">No hay donantes compatibles disponibles</p>
              <p className="text-xs text-muted-foreground">Notificaremos a los donantes cuando estén disponibles</p>
            </div>
          ) : (
            <div className="space-y-3">
              {matchingDonors.map((donor, i) => {
                const contacted = alreadyContacted.includes(donor.id);
                return (
                  <motion.div key={donor.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center justify-between p-4 rounded-lg border hover:border-primary/30 hover:bg-accent/50 transition-all duration-200"
                  >
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
                      {contacted ? (
                        <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-primary/10 text-primary">
                          ✓ Contactado
                        </span>
                      ) : (
                        <>
                          <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-success/10 text-success">
                            ● Disponible
                          </span>
                          {user?.role === 'hospital' && emergency.status !== 'completed' && (
                            <Button
                              size="sm"
                              onClick={() => setContactModal({ donorId: donor.id, donorName: donor.full_name })}
                              className="shadow-sm"
                            >
                              Contactar
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>

      {/* Contact Confirmation Modal */}
      <Dialog open={!!contactModal} onOpenChange={() => setContactModal(null)}>
        <DialogContent className="rounded-xl">
          <DialogHeader>
            <DialogTitle>Contactar Donante</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de contactar a <span className="font-medium text-foreground">{contactModal?.donorName}</span>? Esto cambiará el estado de la solicitud a "En Progreso".
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setContactModal(null)}>Cancelar</Button>
            <Button onClick={handleContact}>Confirmar Contacto</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default EmergencyDetail;
