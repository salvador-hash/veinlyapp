import { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Users, Droplet, MapPin, Phone, Filter, UserCheck, UserX } from 'lucide-react';
import { BLOOD_TYPES, BLOOD_COMPATIBILITY, type BloodType } from '@/types';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.4 } })
};

const DonorDirectory = () => {
  const { users, user } = useApp();
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [bloodFilter, setBloodFilter] = useState<string>('all');
  const [availFilter, setAvailFilter] = useState<string>('all');
  const [cityFilter, setCityFilter] = useState<string>('my_city');

  const donors = useMemo(() => {
    return users.filter(u => {
      if (u.role !== 'donor') return false;
      if (search && !u.full_name.toLowerCase().includes(search.toLowerCase())) return false;
      if (bloodFilter !== 'all' && u.blood_type !== bloodFilter) return false;
      if (availFilter === 'available' && !u.available) return false;
      if (availFilter === 'unavailable' && u.available) return false;
      if (cityFilter === 'my_city' && user && u.city.toLowerCase() !== user.city.toLowerCase()) return false;
      return true;
    });
  }, [users, search, bloodFilter, availFilter, cityFilter, user]);

  const availableCount = donors.filter(d => d.available).length;

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{t('donorDirectoryTitle')}</h1>
              <p className="text-muted-foreground text-sm">{t('donorDirectoryDesc')}</p>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}
          className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-card rounded-xl border p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{donors.length}</p>
            <p className="text-xs text-muted-foreground">{t('totalDonorsFound')}</p>
          </div>
          <div className="bg-success/5 rounded-xl border border-success/20 p-4 text-center">
            <p className="text-2xl font-bold text-success">{availableCount}</p>
            <p className="text-xs text-muted-foreground">{t('availableNow')}</p>
          </div>
          <div className="bg-primary/5 rounded-xl border border-primary/20 p-4 text-center">
            <p className="text-2xl font-bold text-primary">{BLOOD_TYPES.length}</p>
            <p className="text-xs text-muted-foreground">{t('bloodTypesLabel')}</p>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}
          className="bg-card rounded-xl border p-4 mb-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">{t('filterDonors')}</span>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('searchByName')}
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={bloodFilter} onValueChange={setBloodFilter}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allBloodTypes')}</SelectItem>
                {BLOOD_TYPES.map(bt => <SelectItem key={bt} value={bt}>{bt}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={availFilter} onValueChange={setAvailFilter}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allStatus')}</SelectItem>
                <SelectItem value="available">{t('availableOnly')}</SelectItem>
                <SelectItem value="unavailable">{t('unavailableOnly')}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={cityFilter} onValueChange={setCityFilter}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="my_city">{t('myCity')}</SelectItem>
                <SelectItem value="all">{t('allCities')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Donor List */}
        {donors.length === 0 ? (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}
            className="bg-card rounded-xl border p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Users className="h-7 w-7 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground mb-1">{t('noDonorsFound')}</p>
            <p className="text-xs text-muted-foreground">{t('tryDifferentFilters')}</p>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {donors.map((donor, i) => {
              const canDonateTo = Object.entries(BLOOD_COMPATIBILITY)
                .filter(([_, types]) => types.includes(donor.blood_type))
                .map(([recipient]) => recipient);

              return (
                <motion.div key={donor.id} variants={fadeUp} initial="hidden" animate="visible" custom={i + 3}
                  className="bg-card rounded-xl border p-5 hover:shadow-md transition-all duration-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">{donor.full_name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{donor.full_name}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {donor.city}, {donor.country}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-primary text-primary-foreground px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <Droplet className="h-3 w-3" /> {donor.blood_type}
                      </span>
                      {donor.available ? (
                        <span className="bg-success/10 text-success px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                          <UserCheck className="h-3 w-3" /> {t('available')}
                        </span>
                      ) : (
                        <span className="bg-muted text-muted-foreground px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                          <UserX className="h-3 w-3" /> {t('notAvailable')}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                    <Phone className="h-3 w-3" /> {donor.phone}
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground mb-1.5">{t('canDonatToLabel')}:</p>
                    <div className="flex flex-wrap gap-1">
                      {canDonateTo.map(tp => (
                        <span key={tp} className="bg-primary/5 text-primary px-2 py-0.5 rounded text-[10px] font-semibold">{tp}</span>
                      ))}
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

export default DonorDirectory;
