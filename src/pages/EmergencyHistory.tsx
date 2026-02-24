import { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { FileText, AlertTriangle, Clock, CheckCircle, PlusCircle, MapPin, Filter, BarChart3, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.4 } })
};

const EmergencyHistory = () => {
  const { user, emergencies, donations, updateEmergencyStatus } = useApp();
  const { t } = useLanguage();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('all');

  const myEmergencies = useMemo(() => {
    return emergencies
      .filter(e => e.created_by === user?.id)
      .filter(e => statusFilter === 'all' || e.status === statusFilter)
      .filter(e => urgencyFilter === 'all' || e.urgency_level === urgencyFilter)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [emergencies, user, statusFilter, urgencyFilter]);

  const totalRequests = emergencies.filter(e => e.created_by === user?.id).length;
  const openCount = emergencies.filter(e => e.created_by === user?.id && e.status === 'open').length;
  const inProgressCount = emergencies.filter(e => e.created_by === user?.id && e.status === 'in_progress').length;
  const completedCount = emergencies.filter(e => e.created_by === user?.id && e.status === 'completed').length;

  const monthlyData = useMemo(() => {
    const months: Record<string, number> = {};
    emergencies
      .filter(e => e.created_by === user?.id)
      .forEach(e => {
        const month = new Date(e.created_at).toLocaleDateString('default', { month: 'short' });
        months[month] = (months[month] || 0) + 1;
      });
    return Object.entries(months).slice(-6).map(([name, value]) => ({ name, value }));
  }, [emergencies, user]);

  const responseRate = totalRequests > 0 
    ? Math.round(((inProgressCount + completedCount) / totalRequests) * 100) 
    : 0;

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}
          className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{t('emergencyHistoryTitle')}</h1>
              <p className="text-muted-foreground text-sm">{t('emergencyHistoryDesc')}</p>
            </div>
          </div>
          <Link to="/create-emergency">
            <Button className="gap-2">
              <PlusCircle className="h-4 w-4" /> {t('newEmergency')}
            </Button>
          </Link>
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {[
            { label: t('totalLabel'), value: totalRequests, icon: FileText, bg: 'bg-card' },
            { label: t('open'), value: openCount, icon: AlertTriangle, bg: 'bg-warning/5' },
            { label: t('inProgress'), value: inProgressCount, icon: Clock, bg: 'bg-primary/5' },
            { label: t('completedLabel'), value: completedCount, icon: CheckCircle, bg: 'bg-success/5' },
            { label: t('responseRate'), value: `${responseRate}%`, icon: BarChart3, bg: 'bg-primary/5' },
          ].map((s, i) => (
            <motion.div key={i} variants={fadeUp} initial="hidden" animate="visible" custom={i + 1}
              className={`${s.bg} rounded-xl border p-4`}>
              <div className="flex items-center gap-2 mb-2">
                <s.icon className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{s.label}</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Chart + Filters */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {monthlyData.length > 0 && (
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={6}
              className="bg-card rounded-xl border p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" /> {t('monthlyRequests')}
              </h3>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {monthlyData.map((_, i) => (
                        <Cell key={i} fill="hsl(var(--primary))" opacity={0.8} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}

          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={7}
            className={`bg-card rounded-xl border p-5 ${monthlyData.length > 0 ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" /> {t('filterRequests')}
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('allStatuses')}</SelectItem>
                  <SelectItem value="open">{t('open')}</SelectItem>
                  <SelectItem value="in_progress">{t('inProgress')}</SelectItem>
                  <SelectItem value="completed">{t('completedLabel')}</SelectItem>
                </SelectContent>
              </Select>
              <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('allUrgencies')}</SelectItem>
                  <SelectItem value="Critical">🔴 {t('critical')}</SelectItem>
                  <SelectItem value="Urgent">🟡 {t('urgent')}</SelectItem>
                  <SelectItem value="Normal">🟢 {t('normal')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-muted-foreground">
              {t('showing')} <span className="font-semibold text-foreground">{myEmergencies.length}</span> {t('requests')}
            </p>
          </motion.div>
        </div>

        {/* Emergency List */}
        {myEmergencies.length === 0 ? (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={8}
            className="bg-card rounded-xl border p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <FileText className="h-7 w-7 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground mb-1">{t('noRequestsYet')}</p>
            <Link to="/create-emergency">
              <Button className="gap-2 mt-3"><PlusCircle className="h-4 w-4" /> {t('createFirst')}</Button>
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {myEmergencies.map((e, i) => {
              const donorCount = donations.filter(d => d.emergency_id === e.id).length;
              return (
                <motion.div key={e.id} variants={fadeUp} initial="hidden" animate="visible" custom={i + 8}
                  className="bg-card rounded-xl border p-5 hover:shadow-md transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-foreground truncate">{e.patient_name}</p>
                        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                          e.urgency_level === 'Critical' ? 'bg-destructive/10 text-destructive' :
                          e.urgency_level === 'Urgent' ? 'bg-warning/10 text-warning' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {e.urgency_level === 'Critical' ? `🔴 ${t('critical')}` : e.urgency_level === 'Urgent' ? `🟡 ${t('urgent')}` : `🟢 ${t('normal')}`}
                        </span>
                        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                          e.status === 'open' ? 'bg-warning/10 text-warning' :
                          e.status === 'in_progress' ? 'bg-primary/10 text-primary' :
                          'bg-success/10 text-success'
                        }`}>
                          {e.status === 'open' ? t('open') : e.status === 'in_progress' ? t('inProgress') : t('completedLabel')}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-semibold text-primary">{e.blood_type_needed}</span> · {e.units_needed} {t('units')} · {e.hospital}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-3">
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {e.city}</span>
                        <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {donorCount} {t('donorsContacted')}</span>
                        <span>{new Date(e.created_at).toLocaleDateString()}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Link to={`/emergency/${e.id}`}>
                        <Button variant="outline" size="sm">{t('view')}</Button>
                      </Link>
                      {e.status !== 'completed' && (
                        <Button variant="outline" size="sm" onClick={() => updateEmergencyStatus(e.id, 'completed')}>
                          {t('complete')}
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default EmergencyHistory;
