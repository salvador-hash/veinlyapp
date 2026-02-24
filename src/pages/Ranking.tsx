import { useApp } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Trophy, Medal, Crown, Star, Heart, TrendingUp, Flame, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';

const XP_PER_DONATION = 100;
const XP_PER_AVAILABLE = 20;

interface DonorStats {
  id: string;
  name: string;
  blood_type: string;
  city: string;
  completedDonations: number;
  totalXP: number;
  level: number;
  available: boolean;
}

function getLevel(xp: number): number {
  if (xp >= 2000) return 10;
  if (xp >= 1500) return 9;
  if (xp >= 1200) return 8;
  if (xp >= 1000) return 7;
  if (xp >= 800) return 6;
  if (xp >= 600) return 5;
  if (xp >= 400) return 4;
  if (xp >= 250) return 3;
  if (xp >= 100) return 2;
  return 1;
}

function getLevelName(level: number, t: (key: any) => string): string {
  const names: Record<number, string> = {
    1: t('levelNovice'),
    2: t('levelApprentice'),
    3: t('levelHelper'),
    4: t('levelGuardian'),
    5: t('levelProtector'),
    6: t('levelSavior'),
    7: t('levelChampion'),
    8: t('levelHero'),
    9: t('levelLegend'),
    10: t('levelMythic'),
  };
  return names[level] || t('levelNovice');
}

function getXPForNextLevel(level: number): number {
  const thresholds = [0, 100, 250, 400, 600, 800, 1000, 1200, 1500, 2000, Infinity];
  return thresholds[level] || Infinity;
}

const Ranking = () => {
  const { users, donations, user } = useApp();
  const { t } = useLanguage();

  const donorStats: DonorStats[] = users
    .filter(u => u.role === 'donor')
    .map(u => {
      const completed = donations.filter(d => d.donor_id === u.id && d.status === 'completed').length;
      const totalXP = completed * XP_PER_DONATION + (u.available ? XP_PER_AVAILABLE : 0);
      return {
        id: u.id,
        name: u.full_name,
        blood_type: u.blood_type,
        city: u.city,
        completedDonations: completed,
        totalXP,
        level: getLevel(totalXP),
        available: u.available,
      };
    })
    .sort((a, b) => b.totalXP - a.totalXP);

  const myStats = user ? donorStats.find(d => d.id === user.id) : null;
  const myRank = myStats ? donorStats.indexOf(myStats) + 1 : null;

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-6 w-6 text-warning" />;
    if (rank === 2) return <Medal className="h-6 w-6 text-muted-foreground" />;
    if (rank === 3) return <Medal className="h-6 w-6 text-warning/60" />;
    return <span className="text-sm font-bold text-muted-foreground w-6 text-center">{rank}</span>;
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-1 flex items-center gap-2">
          <Trophy className="h-7 w-7 text-warning" /> {t('rankingTitle')}
        </h1>
        <p className="text-muted-foreground">{t('rankingSubtitle')}</p>
      </motion.div>

      {/* My Progress */}
      {myStats && user?.role === 'donor' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-primary/10 via-warning/10 to-success/10 rounded-2xl border border-primary/20 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground">{t('yourProgress')}</p>
              <p className="text-2xl font-bold text-foreground">{t('level')} {myStats.level} — {getLevelName(myStats.level, t)}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-extrabold text-primary">{myStats.totalXP} XP</p>
              <p className="text-xs text-muted-foreground">{t('rank')} #{myRank} {t('of')} {donorStats.length}</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{t('level')} {myStats.level}</span>
              <span>{t('level')} {Math.min(myStats.level + 1, 10)}</span>
            </div>
            <Progress 
              value={myStats.level >= 10 ? 100 : ((myStats.totalXP - getXPForNextLevel(myStats.level - 1)) / (getXPForNextLevel(myStats.level) - getXPForNextLevel(myStats.level - 1))) * 100}
              className="h-3 bg-muted"
            />
            <p className="text-xs text-muted-foreground">
              {myStats.level >= 10 
                ? `🎉 ${t('maxLevelReached')}` 
                : `${getXPForNextLevel(myStats.level) - myStats.totalXP} XP ${t('toNextLevel')}`}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center p-3 rounded-xl bg-card/50 border">
              <Heart className="h-5 w-5 text-primary mx-auto mb-1" />
              <p className="text-lg font-bold text-foreground">{myStats.completedDonations}</p>
              <p className="text-[10px] text-muted-foreground">{t('donationsLabel')}</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-card/50 border">
              <Flame className="h-5 w-5 text-warning mx-auto mb-1" />
              <p className="text-lg font-bold text-foreground">{myStats.totalXP}</p>
              <p className="text-[10px] text-muted-foreground">XP {t('total')}</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-card/50 border">
              <Star className="h-5 w-5 text-warning mx-auto mb-1" />
              <p className="text-lg font-bold text-foreground">{myStats.level}</p>
              <p className="text-[10px] text-muted-foreground">{t('level')}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* XP system explanation */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="bg-card rounded-xl border p-5 mb-6">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Zap className="h-4 w-4 text-warning" /> {t('howXPWorks')}
        </h3>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
            <Heart className="h-3.5 w-3.5 text-primary" />
            <span className="text-muted-foreground">{t('xpPerDonation')}</span>
            <span className="ml-auto font-bold text-foreground">+100 XP</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
            <TrendingUp className="h-3.5 w-3.5 text-success" />
            <span className="text-muted-foreground">{t('xpForAvailability')}</span>
            <span className="ml-auto font-bold text-foreground">+20 XP</span>
          </div>
        </div>
      </motion.div>

      {/* Leaderboard */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="bg-card rounded-2xl border overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-foreground">{t('leaderboard')}</h2>
        </div>
        {donorStats.length === 0 ? (
          <div className="p-12 text-center">
            <Trophy className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">{t('noRankingYet')}</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {donorStats.slice(0, 20).map((donor, i) => (
              <div key={donor.id}
                className={`flex items-center gap-4 p-4 transition-colors hover:bg-accent/50 ${
                  donor.id === user?.id ? 'bg-primary/5 border-l-4 border-l-primary' : ''
                }`}
              >
                <div className="w-8 flex-shrink-0 flex justify-center">
                  {getRankIcon(i + 1)}
                </div>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary">{donor.name.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">
                    {donor.name} {donor.id === user?.id && <span className="text-xs text-primary">({t('you')})</span>}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {donor.blood_type} · {donor.city} · Lv.{donor.level} {getLevelName(donor.level, t)}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-foreground">{donor.totalXP} XP</p>
                  <p className="text-xs text-muted-foreground">{donor.completedDonations} {t('donationsLabel').toLowerCase()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
};

export default Ranking;
