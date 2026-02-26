import { useApp } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { PlusCircle, AlertTriangle, Clock, CheckCircle, Activity, Users, TrendingUp, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import EmergencyMap from '@/components/EmergencyMap';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } })
};

const HospitalDashboard = () => {
  const { user, emergencies, donations, users, updateEmergencyStatus } = useApp();
  const { t } = useLanguage();

  if (!user) return null;

  const myEmergencies = emergencies.filter(e => e.created_by === user.id);
  const openCount = myEmergencies.filter(e => e.status === 'open').length;
  const inProgressCount = myEmergencies.filter(e => e.status === 'in_progress').length;
  const completedCount = myEmergencies.filter(e => e.status === 'completed').length;
  const totalDonors = users.filter(u => u.role === 'donor' && u.city.toLowerCase() === user.city.toLowerCase()).length;
  const availableDonors = users.filter(u => u.role === 'donor' && u.available && u.city.toLowerCase() === user.city.toLowerCase()).length;

  const pieData = [
    { name: t('open'), value: openCount, color: 'hsl(38, 92%, 50%)' },
    { name: t('inProgress'), value: inProgressCount, color: 'hsl(355, 82%, 41%)' },
    { name: t('completedLabel'), value: completedCount, color: 'hsl(142, 71%, 45%)' },
  ].filter(d => d.value > 0);

  return (
    <DashboardLayout>
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-1">{t('hospitalPanel')}</h1>
          <p className="text-sm text-muted-foreground">{t('manageRequests')}</p>
        </div>
        <Link to="/create-emergency">
          <Button className="gap-2 shadow-md hover:shadow-lg hover:scale-[1.02] transition-all w-full sm:w-auto">
            <PlusCircle className="h-4 w-4" /> {t('newEmergency')}
          </Button>
        </Link>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-8">
        {[
          { label: t('open'), value: openCount, icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/5' },
          { label: t('inProgress'), value: inProgressCount, icon: Clock, color: 'text-primary', bg: 'bg-primary/5' },
          { label: t('completedLabel'), value: completedCount, icon: CheckCircle, color: 'text-success', bg: 'bg-success/5' },
          { label: t('donorsInCity'), value: totalDonors, icon: Users, color: 'text-foreground', bg: 'bg-muted' },
          { label: t('availableNow'), value: availableDonors, icon: TrendingUp, color: 'text-success', bg: 'bg-success/5' },
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
        {myEmergencies.length > 0 && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={6}
            className="bg-card rounded-xl border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">{t('summary')}</h2>
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

        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={7}
          className={`bg-card rounded-xl border p-6 ${myEmergencies.length > 0 ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          <h2 className="text-lg font-semibold text-foreground mb-4">{t('yourRequests')}</h2>
          {myEmergencies.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Activity className="h-7 w-7 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground mb-1">{t('noRequestsYet')}</p>
              <p className="text-xs text-muted-foreground mb-4">{t('createFirstRequest')}</p>
              <Link to="/create-emergency">
                <Button className="gap-2"><PlusCircle className="h-4 w-4" /> {t('createFirst')}</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
              {myEmergencies.map(e => (
                <div key={e.id} className="p-3 sm:p-4 rounded-lg border hover:bg-accent/50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{e.patient_name}</p>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-semibold text-primary">{e.blood_type_needed}</span> · {e.units_needed} {t('units')}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {e.hospital} · {new Date(e.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        e.urgency_level === 'Critical' ? 'bg-destructive/10 text-destructive' :
                        e.urgency_level === 'Urgent' ? 'bg-warning/10 text-warning' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {e.urgency_level === 'Critical' ? `🔴 ${t('critical')}` : e.urgency_level === 'Urgent' ? `🟡 ${t('urgent')}` : `🟢 ${t('normal')}`}
                      </span>
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        e.status === 'open' ? 'bg-warning/10 text-warning' :
                        e.status === 'in_progress' ? 'bg-primary/10 text-primary' :
                        'bg-success/10 text-success'
                      }`}>
                        {e.status === 'open' ? t('open') : e.status === 'in_progress' ? t('inProgress') : t('completedLabel')}
                      </span>
                      {e.status !== 'completed' && (
                        <div className="flex gap-1">
                          <Link to={`/emergency/${e.id}`}>
                            <Button variant="outline" size="sm" className="text-xs">{t('view')}</Button>
                          </Link>
                          <Button variant="outline" size="sm" className="text-xs" onClick={() => updateEmergencyStatus(e.id, 'completed')}>
                            {t('complete')}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Map */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={8}
        className="bg-card rounded-xl border p-6 mb-8">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" /> {t('allEmergenciesMap')}
        </h2>
        <EmergencyMap
          emergencies={emergencies.filter(e => e.status !== 'completed')}
          donors={users.filter(u => u.role === 'donor' && u.available)}
          city={user.city}
          className="h-[350px]"
        />
      </motion.div>
    </DashboardLayout>
  );
};

export default HospitalDashboard;
