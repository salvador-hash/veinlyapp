import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { Droplet, ArrowLeft, Heart, Clock, CheckCircle, AlertTriangle, Shield, Apple, Dumbbell, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import ThemeToggle from '@/components/ThemeToggle';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } })
};

const DonationGuide = () => {
  const { t } = useLanguage();

  const requirements = [
    { icon: CheckCircle, text: t('guideReq1'), color: 'text-success' },
    { icon: CheckCircle, text: t('guideReq2'), color: 'text-success' },
    { icon: CheckCircle, text: t('guideReq3'), color: 'text-success' },
    { icon: AlertTriangle, text: t('guideReq4'), color: 'text-warning' },
    { icon: AlertTriangle, text: t('guideReq5'), color: 'text-warning' },
  ];

  const steps = [
    { icon: Shield, title: t('guideStep1Title'), desc: t('guideStep1Desc') },
    { icon: Heart, title: t('guideStep2Title'), desc: t('guideStep2Desc') },
    { icon: Clock, title: t('guideStep3Title'), desc: t('guideStep3Desc') },
    { icon: CheckCircle, title: t('guideStep4Title'), desc: t('guideStep4Desc') },
  ];

  const tips = [
    { icon: Apple, title: t('guideTip1Title'), desc: t('guideTip1Desc') },
    { icon: Moon, title: t('guideTip2Title'), desc: t('guideTip2Desc') },
    { icon: Dumbbell, title: t('guideTip3Title'), desc: t('guideTip3Desc') },
  ];

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Droplet className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold text-foreground">LifeDrop</span>
          </Link>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
            <Link to="/"><Button variant="ghost" size="sm" className="gap-1"><ArrowLeft className="h-4 w-4" /> {t('backToHome')}</Button></Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <Heart className="h-4 w-4" /> {t('guideTitle')}
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-foreground mb-4">{t('guideHeadline')}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t('guideSubtitle')}</p>
        </motion.div>

        {/* Requirements */}
        <motion.section variants={fadeUp} initial="hidden" animate="visible" custom={1} className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">{t('guideRequirements')}</h2>
          <div className="bg-card rounded-2xl border p-6 space-y-4">
            {requirements.map((req, i) => (
              <div key={i} className="flex items-start gap-3">
                <req.icon className={`h-5 w-5 ${req.color} mt-0.5 flex-shrink-0`} />
                <p className="text-foreground">{req.text}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Steps */}
        <motion.section variants={fadeUp} initial="hidden" animate="visible" custom={2} className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">{t('guideProcess')}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {steps.map((step, i) => (
              <div key={i} className="bg-card rounded-2xl border p-6 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <step.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Tips */}
        <motion.section variants={fadeUp} initial="hidden" animate="visible" custom={3} className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">{t('guideTips')}</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {tips.map((tip, i) => (
              <div key={i} className="bg-card rounded-2xl border p-6 text-center hover:shadow-md transition-shadow">
                <tip.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-bold text-foreground mb-2">{tip.title}</h3>
                <p className="text-sm text-muted-foreground">{tip.desc}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* CTA */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}
          className="bg-gradient-to-r from-primary/10 to-success/10 rounded-2xl border border-primary/20 p-8 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-3">{t('guideReady')}</h2>
          <p className="text-muted-foreground mb-6">{t('guideReadyDesc')}</p>
          <Link to="/register">
            <Button size="lg" className="gap-2"><Heart className="h-4 w-4" /> {t('becomeDonor')}</Button>
          </Link>
        </motion.div>
      </div>

      <footer className="border-t py-8 mt-16 bg-card/50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">{t('allRightsReserved')}</p>
          <p className="text-xs text-muted-foreground mt-1">blooddonation854@gmail.com</p>
        </div>
      </footer>
    </div>
  );
};

export default DonationGuide;
