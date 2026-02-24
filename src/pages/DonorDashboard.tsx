import { useApp } from '@/context/AppContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Heart, AlertTriangle, Activity, Users, Sparkles, Award, TrendingUp, Clock, MapPin, Droplet } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import BloodCompatibilityChart from '@/components/BloodCompatibilityChart';
import { BLOOD_COMPATIBILITY } from '@/types';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } })
};

const DonorDashboard = () => {
  const { user, toggleAvailability, emergencies, donations, users } = useApp();
  const { toast } = useToast();

  if (!user) return null;

  const myDonations = donations.filter(d => d.donor_id === user.id);
  const completedDonations = myDonations.filter(d => d.status === 'completed').length;
  const pendingDonations = myDonations.filter(d => d.status === 'pending').length;
  const openEmergencies = emergencies.filter(e => e.status === 'open' && e.city.toLowerCase() === user.city.toLowerCase());
  const compatibleTypes = Object.entries(BLOOD_COMPATIBILITY)
    .filter(([_, donors]) => donors.includes(user.blood_type))
    .map(([recipient]) => recipient);

  // Achievement badges
  const badges = [
    { name: 'Primera Donación', icon: Heart, unlocked: completedDonations >= 1, desc: 'Completaste tu primera donación' },
    { name: 'Héroe Local', icon: Award, unlocked: completedDonations >= 5, desc: '5 donaciones completadas' },
    { name: 'Leyenda', icon: Sparkles, unlocked: completedDonations >= 10, desc: '10 donaciones completadas' },
    { name: 'Siempre Listo', icon: TrendingUp, unlocked: user.available, desc: 'Disponibilidad activa' },
  ];

  const handleToggle = () => {
    toggleAvailability();
    toast({
      title: !user.available ? "🎉 ¡Ahora estás disponible para salvar vidas!" : "Actualmente no estás disponible",
      variant: !user.available ? "default" : "destructive",
    });
  };

  return (
    <DashboardLayout>
      {/* Welcome */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0} className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-1">
          Bienvenido, {user.full_name.split(' ')[0]} 👋
        </h1>
        <p className="text-muted-foreground">Aquí está lo que sucede en tu área</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Tipo de Sangre', value: user.blood_type, icon: Droplet, color: 'text-primary', bg: 'bg-primary/5', subtitle: `Compatible con ${compatibleTypes.length} tipos` },
          { label: 'Donaciones', value: myDonations.length, icon: Activity, color: 'text-primary', bg: 'bg-primary/5', subtitle: `${pendingDonations} pendientes` },
          { label: 'Estado', value: user.available ? 'Disponible' : 'No disponible', icon: Users, color: user.available ? 'text-success' : 'text-muted-foreground', bg: user.available ? 'bg-success/5' : 'bg-muted', subtitle: user.available ? 'Visible para hospitales' : 'No visible' },
          { label: 'Emergencias Cercanas', value: openEmergencies.length, icon: AlertTriangle, color: openEmergencies.length > 0 ? 'text-warning' : 'text-muted-foreground', bg: openEmergencies.length > 0 ? 'bg-warning/5' : 'bg-muted', subtitle: `en ${user.city}` },
        ].map((stat, i) => (
          <motion.div key={i} variants={fadeUp} initial="hidden" animate="visible" custom={i + 1}
            className={`${stat.bg} rounded-xl border p-5 transition-all hover:shadow-md`}>
            <div className="flex items-center gap-2 mb-3">
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
          </motion.div>
        ))}
      </div>

      {/* Lives saved banner */}
      {completedDonations > 0 && (
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5}
          className="bg-gradient-to-r from-primary/10 via-success/10 to-primary/10 rounded-xl border border-primary/20 p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
              <Sparkles className="h-7 w-7 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-xl font-bold text-foreground">¡Has ayudado a salvar {completedDonations} {completedDonations === 1 ? 'vida' : 'vidas'}!</p>
              <p className="text-sm text-muted-foreground">Gracias por ser un héroe en tu comunidad.</p>
            </div>
            <div className="hidden md:block text-right">
              <p className="text-4xl font-extrabold text-primary">{completedDonations}</p>
              <p className="text-xs text-muted-foreground">vidas salvadas</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Badges */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={6}
        className="bg-card rounded-xl border p-6 mb-8">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Award className="h-5 w-5 text-warning" /> Logros
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {badges.map((badge, i) => (
            <div key={i} className={`rounded-xl border p-4 text-center transition-all ${
              badge.unlocked ? 'bg-warning/5 border-warning/20 shadow-sm' : 'bg-muted/50 opacity-50'
            }`}>
              <badge.icon className={`h-6 w-6 mx-auto mb-2 ${badge.unlocked ? 'text-warning' : 'text-muted-foreground'}`} />
              <p className="text-xs font-semibold text-foreground">{badge.name}</p>
              <p className="text-[10px] text-muted-foreground mt-1">{badge.desc}</p>
              {badge.unlocked && <span className="text-[10px] text-warning font-bold mt-1 block">✓ Desbloqueado</span>}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Availability */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={7}
        className="bg-card rounded-xl border p-6 mb-8 hover:shadow-sm transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-1">Disponibilidad</h2>
            <p className="text-sm text-muted-foreground">
              {user.available ? '✅ Eres visible para hospitales que necesitan ayuda' : 'Activa tu disponibilidad para recibir solicitudes de emergencia'}
            </p>
          </div>
          <Button
            onClick={handleToggle}
            variant={user.available ? 'default' : 'outline'}
            className={`min-w-[140px] ${user.available ? 'bg-success hover:bg-success/90' : ''}`}
          >
            {user.available ? '● Disponible' : 'Activar'}
          </Button>
        </div>
      </motion.div>

      {/* Two columns: Emergencies + Compatibility */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Nearby Emergencies */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={8}
          className="bg-card rounded-xl border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Emergencias Cercanas {openEmergencies.length > 0 && <span className="text-primary">({openEmergencies.length})</span>}
          </h2>
          {openEmergencies.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                <Heart className="h-7 w-7 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground mb-1">No hay emergencias activas</p>
              <p className="text-xs text-muted-foreground">Te notificaremos cuando alguien necesite ayuda</p>
            </div>
          ) : (
            <div className="space-y-3">
              {openEmergencies.slice(0, 5).map(e => (
                <Link key={e.id} to={`/emergency/${e.id}`} className="block group">
                  <div className="flex items-center justify-between p-4 rounded-lg border hover:border-primary/30 hover:bg-accent/50 transition-all duration-200">
                    <div>
                      <p className="font-medium text-foreground group-hover:text-primary transition-colors">{e.hospital}</p>
                      <p className="text-sm text-muted-foreground">
                        Necesita <span className="font-semibold text-primary">{e.blood_type_needed}</span> · {e.units_needed} unidades
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3" /> {new Date(e.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`text-xs font-medium px-3 py-1.5 rounded-full ${
                      e.urgency_level === 'Critical' ? 'bg-destructive/10 text-destructive animate-pulse-gentle' :
                      e.urgency_level === 'Urgent' ? 'bg-warning/10 text-warning' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {e.urgency_level === 'Critical' ? '🔴 Crítico' : e.urgency_level === 'Urgent' ? '🟡 Urgente' : '🟢 Normal'}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </motion.div>

        {/* Blood Compatibility */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={9}
          className="bg-card rounded-xl border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-2">Tu Compatibilidad</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Como <span className="font-bold text-primary">{user.blood_type}</span>, puedes donar a {compatibleTypes.length} tipos
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {compatibleTypes.map(t => (
              <span key={t} className="bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-semibold">{t}</span>
            ))}
          </div>
          <BloodCompatibilityChart highlightType={user.blood_type} />
        </motion.div>
      </div>

      {/* Donation History */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={10}
        className="bg-card rounded-xl border p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Historial de Donaciones</h2>
        {myDonations.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
              <Activity className="h-7 w-7 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground mb-1">Aún no hay donaciones</p>
            <p className="text-xs text-muted-foreground">Tu historial aparecerá aquí</p>
          </div>
        ) : (
          <div className="space-y-2">
            {myDonations.map(d => {
              const emergency = emergencies.find(e => e.id === d.emergency_id);
              return (
                <div key={d.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-foreground">{emergency?.hospital || 'Hospital'}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {emergency?.city || user.city} · {new Date(d.date).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`text-xs font-medium px-3 py-1.5 rounded-full ${
                    d.status === 'completed' ? 'bg-success/10 text-success' :
                    d.status === 'pending' ? 'bg-warning/10 text-warning' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {d.status === 'completed' ? '✓ Completada' : d.status === 'pending' ? '⏳ Pendiente' : '✗ Cancelada'}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
};

export default DonorDashboard;
