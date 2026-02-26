import { Link } from 'react-router-dom';
import { Droplet, Heart, Clock, Shield, ArrowRight, Users, Zap, ChevronDown, Star, MapPin, Phone, Globe, Award, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';
import AnimatedCounter from '@/components/AnimatedCounter';
import BloodCompatibilityChart from '@/components/BloodCompatibilityChart';
import ThemeToggle from '@/components/ThemeToggle';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }
  })
};

const Landing = () => {
  const { user } = useApp();
  const { t } = useLanguage();

  const testimonials = [
    { name: t('testimonial1Name'), role: t('testimonial1Role'), text: t('testimonial1Text'), avatar: 'M', rating: 5, city: 'Madrid' },
    { name: t('testimonial2Name'), role: t('testimonial2Role'), text: t('testimonial2Text'), avatar: 'C', rating: 5, city: 'Barcelona' },
    { name: t('testimonial3Name'), role: t('testimonial3Role'), text: t('testimonial3Text'), avatar: 'A', rating: 5, city: 'Buenos Aires' },
  ];

  const faqs = [
    { q: t('faq1Q'), a: t('faq1A') },
    { q: t('faq2Q'), a: t('faq2A') },
    { q: t('faq3Q'), a: t('faq3A') },
    { q: t('faq4Q'), a: t('faq4A') },
    { q: t('faq5Q'), a: t('faq5A') },
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden grain">
      {/* Nav */}
      <nav className="border-b bg-background/60 glass sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Droplet className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-display font-bold text-foreground tracking-tight">Veinly</span>
          </Link>
          <div className="flex items-center gap-1.5">
            <LanguageSwitcher />
            <ThemeToggle />
            {user ? (
              <Link to="/dashboard">
                <Button size="sm" className="gap-1.5 rounded-full px-5 ml-2">{t('dashboard')} <ArrowRight className="h-3.5 w-3.5" /></Button>
              </Link>
            ) : (
              <div className="flex items-center gap-1 sm:gap-1.5 ml-1 sm:ml-2">
                <Link to="/login"><Button variant="ghost" size="sm" className="rounded-full text-xs sm:text-sm px-2 sm:px-3">{t('signIn')}</Button></Link>
                <Link to="/register"><Button size="sm" className="gap-1 sm:gap-1.5 rounded-full px-3 sm:px-5 text-xs sm:text-sm"><Heart className="h-3 w-3 sm:h-3.5 sm:w-3.5 hidden sm:inline" /> {t('getStarted')}</Button></Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-primary/3 blur-[100px]" />
        </div>
        <div className="container mx-auto px-4 pt-20 pb-16 lg:pt-32 lg:pb-24">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}
              className="inline-flex items-center gap-2 bg-primary/8 text-primary border border-primary/15 px-4 py-1.5 rounded-full text-sm font-medium mb-8">
              <Heart className="h-3.5 w-3.5" /> {t('landingBadge')}
            </motion.div>
            <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1}
              className="text-3xl sm:text-5xl lg:text-[5.5rem] font-display font-bold text-foreground leading-[1.05] mb-6 tracking-tight">
              {t('landingTitle1')}{' '}
              <span className="text-gradient">{t('landingTitle2')}</span>
            </motion.h1>
            <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2}
              className="text-lg lg:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              {t('landingSubtitle')}
            </motion.p>
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}
              className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/register">
                <Button size="lg" className="gap-2 text-base px-8 h-13 rounded-full shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all hover:scale-[1.02]">
                  {t('becomeDonor')} <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="outline" className="text-base px-8 h-13 rounded-full hover:scale-[1.02] transition-all">
                  {t('registerHospital')}
                </Button>
              </Link>
            </motion.div>
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}
              className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mt-8 sm:mt-12 text-xs sm:text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><Shield className="h-4 w-4 text-success" /><span>{t('verifiedDonors')}</span></div>
              <div className="hidden sm:flex items-center gap-2"><Zap className="h-4 w-4 text-warning" /><span>{t('realtimeMatching')}</span></div>
              <div className="flex items-center gap-2"><Globe className="h-4 w-4 text-primary" /><span>{t('globallyAvailable')}</span></div>
            </motion.div>
          </div>

          {/* Floating cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mt-12 sm:mt-16 lg:mt-24 max-w-3xl mx-auto relative px-2 sm:px-0"
          >
            <div className="bg-card border rounded-2xl p-6 shadow-xl shadow-foreground/5">
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center space-y-1">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-2">
                    <Heart className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-2xl lg:text-3xl font-display font-bold text-foreground"><AnimatedCounter end={3800} suffix="+" /></p>
                  <p className="text-xs text-muted-foreground">{t('livesSaved')}</p>
                </div>
                <div className="text-center space-y-1 border-x">
                  <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center mx-auto mb-2">
                    <Users className="h-5 w-5 text-success" />
                  </div>
                  <p className="text-2xl lg:text-3xl font-display font-bold text-foreground"><AnimatedCounter end={12500} suffix="+" /></p>
                  <p className="text-xs text-muted-foreground">{t('registeredDonors')}</p>
                </div>
                <div className="text-center space-y-1">
                  <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center mx-auto mb-2">
                    <TrendingUp className="h-5 w-5 text-warning" />
                  </div>
                  <p className="text-2xl lg:text-3xl font-display font-bold text-foreground"><AnimatedCounter end={98} suffix="%" /></p>
                  <p className="text-xs text-muted-foreground">{t('successRate')}</p>
                </div>
              </div>
            </div>
            {/* Floating mini-cards */}
            <motion.div
              animate={{ y: [-5, 5, -5] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="hidden sm:flex absolute -left-4 -top-4 bg-card border shadow-lg rounded-xl p-3 items-center gap-2"
            >
              <div className="w-7 h-7 rounded-full bg-success/10 flex items-center justify-center">
                <Heart className="h-3.5 w-3.5 text-success" />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">{t('lifeSavedNotif')}</p>
                <p className="text-[10px] text-muted-foreground">{t('agoMin')}</p>
              </div>
            </motion.div>
            <motion.div
              animate={{ y: [5, -5, 5] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="hidden sm:flex absolute -right-4 -bottom-3 bg-card border shadow-lg rounded-xl p-3 items-center gap-2"
            >
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                <Zap className="h-3.5 w-3.5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">{t('matchFound')}</p>
                <p className="text-[10px] text-muted-foreground">{t('matchType')}</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="flex justify-center pb-8"
        >
          <ChevronDown className="h-5 w-5 text-muted-foreground/40" />
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-4">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-16">
            <span className="text-primary text-xs font-semibold uppercase tracking-[0.2em]">{t('simpleProcess')}</span>
            <h2 className="text-3xl lg:text-5xl font-display font-bold text-foreground mt-3 mb-4 tracking-tight">{t('howItWorks')}</h2>
            <p className="text-muted-foreground max-w-md mx-auto text-lg">{t('howItWorksSubtitle')}</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 relative max-w-4xl mx-auto">
            <div className="hidden md:block absolute top-20 left-[16%] right-[16%] h-px bg-border" />
            {[
              { icon: Users, title: t('step1Title'), desc: t('step1Desc'), color: 'bg-primary/8 text-primary', num: '01' },
              { icon: Zap, title: t('step2Title'), desc: t('step2Desc'), color: 'bg-warning/8 text-warning', num: '02' },
              { icon: Heart, title: t('step3Title'), desc: t('step3Desc'), color: 'bg-success/8 text-success', num: '03' },
            ].map((f, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
                className="bg-card rounded-2xl p-8 border text-center hover:shadow-lg transition-all duration-500 hover:-translate-y-1 relative group">
                <span className="absolute top-4 right-5 text-xs font-display font-bold text-muted-foreground/30">{f.num}</span>
                <div className={`w-14 h-14 rounded-2xl ${f.color} flex items-center justify-center mx-auto mb-6`}>
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-display font-bold text-foreground mb-3">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Blood Compatibility */}
      <section id="compatibility" className="py-24 bg-muted/40">
        <div className="container mx-auto px-4">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-12">
            <span className="text-primary text-xs font-semibold uppercase tracking-[0.2em]">{t('vitalInfo')}</span>
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-foreground mt-3 mb-4 tracking-tight">{t('compatibilityTable')}</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">{t('compatibilitySubtitle')}</p>
          </motion.div>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="bg-card rounded-2xl border p-6 lg:p-8 max-w-3xl mx-auto shadow-sm">
            <BloodCompatibilityChart />
            <p className="text-xs text-muted-foreground text-center mt-4">{t('compatibilityNote')}</p>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-4">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-16">
            <span className="text-primary text-xs font-semibold uppercase tracking-[0.2em]">{t('testimonials')}</span>
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-foreground mt-3 mb-4 tracking-tight">{t('testimonialsTitle')}</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {testimonials.map((tItem, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
                className="bg-card rounded-2xl border p-6 hover:shadow-lg transition-all duration-500 hover:-translate-y-1">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: tItem.rating }).map((_, j) => (
                    <Star key={j} className="h-3.5 w-3.5 fill-warning text-warning" />
                  ))}
                </div>
                <p className="text-foreground leading-relaxed mb-6 text-sm">"{tItem.text}"</p>
                <div className="flex items-center gap-3 border-t pt-4">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">{tItem.avatar}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{tItem.name}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      {tItem.role} · <MapPin className="h-2.5 w-2.5" /> {tItem.city}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-muted/40">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-12">
            <span className="text-primary text-xs font-semibold uppercase tracking-[0.2em]">{t('faq')}</span>
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-foreground mt-3 mb-4 tracking-tight">{t('faqTitle')}</h2>
          </motion.div>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <Accordion type="single" collapsible className="space-y-2">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="bg-card border rounded-xl px-5 data-[state=open]:shadow-md transition-shadow">
                  <AccordionTrigger className="text-left font-medium text-foreground hover:text-primary transition-colors py-4 text-sm">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-4 text-sm">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container mx-auto px-4 text-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="max-w-xl mx-auto">
            <div className="bg-foreground rounded-2xl sm:rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent pointer-events-none" />
              <div className="relative">
                <Heart className="h-10 w-10 text-primary-foreground mx-auto mb-5 opacity-80" />
                <h2 className="text-2xl lg:text-3xl font-display font-bold text-background mb-4 tracking-tight">{t('readyToSave')}</h2>
                <p className="text-background/60 mb-8 text-sm">{t('readyToSaveSubtitle')}</p>
                <Link to="/register">
                  <Button size="lg" className="gap-2 rounded-full px-10 h-12 shadow-lg hover:scale-[1.03] transition-all">
                    {t('startFree')} <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
                  <Droplet className="h-3.5 w-3.5 text-primary-foreground" />
                </div>
                <span className="text-base font-display font-bold text-foreground">Veinly</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{t('footerDesc')}</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground text-sm mb-3">{t('platform')}</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <Link to="/register" className="block hover:text-primary transition-colors">{t('register')}</Link>
                <Link to="/login" className="block hover:text-primary transition-colors">{t('signIn')}</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-foreground text-sm mb-3">{t('resources')}</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <Link to="/donation-guide" className="block hover:text-primary transition-colors">{t('donationGuide')}</Link>
                <a href="#compatibility" className="block hover:text-primary transition-colors">{t('compatibility')}</a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-foreground text-sm mb-3">{t('contact')}</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2"><Phone className="h-3 w-3" /> blooddonation854@gmail.com</div>
                <div className="flex items-center gap-2"><Globe className="h-3 w-3" /> lifedrop.app</div>
              </div>
            </div>
          </div>
          <div className="border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">{t('allRightsReserved')}</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <Link to="/privacy" className="hover:text-primary transition-colors">{t('privacy')}</Link>
              <Link to="/terms" className="hover:text-primary transition-colors">{t('terms')}</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
