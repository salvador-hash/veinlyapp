import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { AlertTriangle, MapPin, Phone, User, Heart, Clock, Shield, Activity, MessageCircle, HandHeart } from 'lucide-react';
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
  const navigate = useNavigate();
  const { emergencies, users, user, contactDonor, commitToDonate, donations } = useApp();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [contactModal, setContactModal] = useState<{ donorId: string; donorName: string } | null>(null);
  const [commitModal, setCommitModal] = useState(false);

  const emergency = emergencies.find(e => e.id === id);
  if (!emergency) {
    return (
      <DashboardLayout>
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-7 w-7 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">{t('emergencyNotFound')}</p>
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

  const isDonor = user?.role === 'donor';
  const hasCommitted = isDonor && alreadyContacted.includes(user!.id);
  const isCompatible = isDonor && compatibleTypes.includes(user!.blood_type);
  const requester = users.find(u => u.id === emergency.created_by);

  const handleContact = () => {
    if (contactModal) {
      contactDonor(contactModal.donorId, emergency.id);
      toast({ title: t('contactedSuccess', { name: contactModal.donorName }) });
      setContactModal(null);
    }
  };

  const handleCommit = () => {
    commitToDonate(emergency.id);
    toast({ title: t('commitSuccess') });
    setCommitModal(false);
  };

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return t('lessThanHourAgo');
    if (hours < 24) return t('hoursAgo', { n: hours });
    const days = Math.floor(hours / 24);
    return t('daysAgo', { n: days });
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
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
                {emergency.urgency_level === 'Critical' ? `🔴 ${t('critical')}` : emergency.urgency_level === 'Urgent' ? `🟡 ${t('urgent')}` : `🟢 ${t('normal')}`}
              </span>
              <span className={`text-xs font-medium px-3 py-1.5 rounded-full ${
                emergency.status === 'open' ? 'bg-warning/10 text-warning' :
                emergency.status === 'in_progress' ? 'bg-primary/10 text-primary' :
                'bg-success/10 text-success'
              }`}>
                {emergency.status === 'open' ? t('open') : emergency.status === 'in_progress' ? t('inProgress') : t('completedLabel')}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: t('bloodTypeDetail'), value: emergency.blood_type_needed, icon: Heart, color: 'text-primary' },
              { label: t('unitsLabel'), value: emergency.units_needed, icon: Activity, color: 'text-warning' },
              { label: t('location'), value: emergency.city, icon: MapPin, color: 'text-muted-foreground' },
              { label: t('contactLabel'), value: emergency.contact_number, icon: Phone, color: 'text-muted-foreground' },
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

          <div className="mt-4 p-4 rounded-lg border border-primary/10 bg-primary/[0.02]">
            <p className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-primary" /> {t('compatibleTypesFor')} {emergency.blood_type_needed}:
            </p>
            <div className="flex flex-wrap gap-2">
              {compatibleTypes.map(tp => (
                <span key={tp} className="bg-primary/10 text-primary px-2.5 py-1 rounded-full text-xs font-semibold">{tp}</span>
              ))}
            </div>
          </div>

          {/* Donor action buttons */}
          {isDonor && emergency.status !== 'completed' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="mt-6 p-5 rounded-xl border-2 border-dashed border-primary/30 bg-primary/[0.03]">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <HandHeart className="h-5 w-5 text-primary" /> Acciones de Donante
              </h3>
              <div className="flex flex-wrap gap-3">
                {hasCommitted ? (
                  <span className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-success/10 text-success font-medium text-sm">
                    <Heart className="h-4 w-4" /> {t('alreadyCommitted')}
                  </span>
                ) : (
                  <Button
                    onClick={() => setCommitModal(true)}
                    disabled={!isCompatible}
                    className="bg-primary hover:bg-primary/90 shadow-md"
                  >
                    <HandHeart className="h-4 w-4 mr-1" /> {t('imGoingToDonate')}
                  </Button>
                )}
                {requester && (
                  <Button
                    variant="outline"
                    onClick={() => navigate('/messages')}
                  >
                    <MessageCircle className="h-4 w-4 mr-1" /> {t('messageRequester')}
                  </Button>
                )}
              </div>
              {!isCompatible && !hasCommitted && (
                <p className="text-xs text-muted-foreground mt-2">
                  Tu tipo ({user?.blood_type}) no es compatible con {emergency.blood_type_needed}
                </p>
              )}
            </motion.div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl border p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            {t('compatibleDonors')} <span className="text-primary">({matchingDonors.length})</span>
          </h2>
          {matchingDonors.length === 0 ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                <User className="h-7 w-7 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground mb-1">{t('noCompatibleDonors')}</p>
              <p className="text-xs text-muted-foreground">{t('willNotifyWhenAvailable')}</p>
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
                          {t('contacted')}
                        </span>
                      ) : (
                        <>
                          <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-success/10 text-success">
                            ● {t('available')}
                          </span>
                          {user?.role === 'hospital' && emergency.status !== 'completed' && (
                            <Button
                              size="sm"
                              onClick={() => setContactModal({ donorId: donor.id, donorName: donor.full_name })}
                              className="shadow-sm"
                            >
                              {t('contactDonor')}
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

      <Dialog open={!!contactModal} onOpenChange={() => setContactModal(null)}>
        <DialogContent className="rounded-xl">
          <DialogHeader>
            <DialogTitle>{t('contactDonorTitle')}</DialogTitle>
            <DialogDescription>
              {t('contactDonorDesc')} <span className="font-medium text-foreground">{contactModal?.donorName}</span>{t('contactDonorDesc2')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setContactModal(null)}>{t('cancel')}</Button>
            <Button onClick={handleContact}>{t('confirmContact')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Commit to donate dialog */}
      <Dialog open={commitModal} onOpenChange={setCommitModal}>
        <DialogContent className="rounded-xl">
          <DialogHeader>
            <DialogTitle>{t('commitConfirmTitle')}</DialogTitle>
            <DialogDescription>
              {t('commitConfirmDesc')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCommitModal(false)}>{t('cancel')}</Button>
            <Button onClick={handleCommit} className="bg-primary">
              <HandHeart className="h-4 w-4 mr-1" /> {t('imGoingToDonate')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default EmergencyDetail;
