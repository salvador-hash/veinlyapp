import { useApp } from '@/context/AppContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { PlusCircle, AlertTriangle, Clock, CheckCircle, Activity, Users, TrendingUp, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } })
};

const HospitalDashboard = () => {
  const { user, emergencies, donations, users, updateEmergencyStatus } = useApp();

  if (!user) return null;

  const myEmergencies = emergencies.filter(e => e.created_by === user.id);
  const openCount = myEmergencies.filter(e => e.status === 'open').length;
  const inProgressCount = myEmergencies.filter(e => e.status === 'in_progress').length;
  const completedCount = myEmergencies.filter(e => e.status === 'completed').length;
  const totalDonors = users.filter(u => u.role === 'donor' && u.city.toLowerCase() === user.city.toLowerCase()).length;
  const availableDonors = users.filter(u => u.role === 'donor' && u.available && u.city.toLowerCase() === user.city.toLowerCase()).length;

  const pieData = [
    { name: 'Abiertas', value: openCount, color: 'hsl(38, 92%, 50%)' },
    { name: 'En Progreso', value: inProgressCount, color: 'hsl(355, 82%, 41%)' },
    { name: 'Completadas', value: completedCount, color: 'hsl(142, 71%, 45%)' },
  ].filter(d => d.value > 0);

  return (
    <DashboardLayout>
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}
        className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-1">Panel del Hospital 🏥</h1>
          <p className="text-muted-foreground">Gestiona tus solicitudes de sangre de emergencia</p>
        </div>
        <Link to="/create-emergency">
          <Button className="gap-2 shadow-md hover:shadow-lg hover:scale-[1.02] transition-all">
            <PlusCircle className="h-4 w-4" /> Nueva Emergencia
          </Button>
        </Link>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {[
          { label: 'Abiertas', value: openCount, icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/5' },
          { label: 'En Progreso', value: inProgressCount, icon: Clock, color: 'text-primary', bg: 'bg-primary/5' },
          { label: 'Completadas', value: completedCount, icon: CheckCircle, color: 'text-success', bg: 'bg-success/5' },
          { label: 'Donantes en tu Ciudad', value: totalDonors, icon: Users, color: 'text-foreground', bg: 'bg-muted' },
          { label: 'Disponibles Ahora', value: availableDonors, icon: TrendingUp, color: 'text-success', bg: 'bg-success/5' },
        ].map((s, i) => (
          <motion.div key={i} variants={fadeUp} initial="hidden" animate="visible" custom={i + 1}
            className={`${s.bg} rounded-xl border p-5 transition-all hover:shadow-md`}>
            <div className="flex items-center gap-2 mb-3">
              <s.icon className={`h-4 w-4 ${s.color}`} />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{s.label}</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Chart + Recent */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Pie chart */}
        {myEmergencies.length > 0 && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={6}
            className="bg-card rounded-xl border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Resumen</h2>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-2">
              {pieData.map((d, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-muted-foreground">{d.name} ({d.value})</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Emergency list */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={7}
          className={`bg-card rounded-xl border p-6 ${myEmergencies.length > 0 ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          <h2 className="text-lg font-semibold text-foreground mb-4">Tus Solicitudes</h2>
          {myEmergencies.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Activity className="h-7 w-7 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground mb-1">Aún no hay solicitudes de emergencia</p>
              <p className="text-xs text-muted-foreground mb-4">Crea tu primera solicitud para encontrar donantes</p>
              <Link to="/create-emergency">
                <Button className="gap-2"><PlusCircle className="h-4 w-4" /> Crear Primera Solicitud</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
              {myEmergencies.map(e => (
                <div key={e.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{e.patient_name}</p>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold text-primary">{e.blood_type_needed}</span> · {e.units_needed} unidades
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {e.hospital} · {new Date(e.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      e.urgency_level === 'Critical' ? 'bg-destructive/10 text-destructive' :
                      e.urgency_level === 'Urgent' ? 'bg-warning/10 text-warning' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {e.urgency_level === 'Critical' ? '🔴' : e.urgency_level === 'Urgent' ? '🟡' : '🟢'} {e.urgency_level}
                    </span>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      e.status === 'open' ? 'bg-warning/10 text-warning' :
                      e.status === 'in_progress' ? 'bg-primary/10 text-primary' :
                      'bg-success/10 text-success'
                    }`}>
                      {e.status === 'open' ? 'Abierta' : e.status === 'in_progress' ? 'En Progreso' : 'Completada'}
                    </span>
                    {e.status !== 'completed' && (
                      <div className="flex gap-1">
                        <Link to={`/emergency/${e.id}`}>
                          <Button variant="outline" size="sm">Ver</Button>
                        </Link>
                        <Button variant="outline" size="sm" onClick={() => updateEmergencyStatus(e.id, 'completed')}>
                          Completar
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default HospitalDashboard;
