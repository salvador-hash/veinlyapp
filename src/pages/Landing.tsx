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
import heroImage from '@/assets/hero-image.png';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }
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
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Nav */}
      <nav className="border-b bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Droplet className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold text-foreground">LifeDrop</span>
          </Link>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
            {user ? (
              <Link to="/dashboard">
                <Button className="gap-2">{t('dashboard')} <ArrowRight className="h-4 w-4" /></Button>
              </Link>
            ) : (
              <>
                <Link to="/login"><Button variant="ghost">{t('signIn')}</Button></Link>
                <Link to="/register"><Button className="gap-2"><Heart className="h-4 w-4" /> {t('getStarted')}</Button></Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}
                className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-6">
                <Heart className="h-4 w-4 animate-pulse-gentle" /> {t('landingBadge')}
              </motion.div>
              <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1}
                className="text-4xl lg:text-7xl font-extrabold text-foreground leading-[1.1] mb-6 tracking-tight">
                {t('landingTitle1')}<br />
                <span className="text-gradient">{t('landingTitle2')}</span>
              </motion.h1>
              <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2}
                className="text-lg lg:text-xl text-muted-foreground mb-8 max-w-lg leading-relaxed">
                {t('landingSubtitle')}
              </motion.p>
              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}
                className="flex flex-wrap gap-4">
                <Link to="/register">
                  <Button size="lg" className="gap-2 text-base px-8 h-13 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]">
                    {t('becomeDonor')} <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="lg" variant="outline" className="text-base px-8 h-13 hover:scale-[1.02] transition-all">
                    {t('registerHospital')}
                  </Button>
                </Link>
              </motion.div>
              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}
                className="flex items-center gap-6 mt-10 text-sm text-muted-foreground">
                <div className="flex items-center gap-2"><Shield className="h-4 w-4 text-success" /><span>{t('verifiedDonors')}</span></div>
                <div className="flex items-center gap-2"><Zap className="h-4 w-4 text-warning" /><span>{t('realtimeMatching')}</span></div>
                <div className="flex items-center gap-2"><Globe className="h-4 w-4 text-primary" /><span>{t('globallyAvailable')}</span></div>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="hidden lg:block"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-success/20 rounded-3xl blur-2xl opacity-50" />
                <img src={heroImage} alt="Blood donation illustration" className="relative w-full max-w-lg mx-auto rounded-2xl shadow-2xl" />
                <motion.div
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  className="absolute -left-6 top-1/4 bg-card border shadow-lg rounded-xl p-3 flex items-center gap-2"
                >
                  <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
                    <Heart className="h-4 w-4 text-success" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">{t('lifeSavedNotif')}</p>
                    <p className="text-[10px] text-muted-foreground">{t('agoMin')}</p>
                  </div>
                </motion.div>
                <motion.div
                  animate={{ y: [5, -5, 5] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="absolute -right-4 bottom-1/4 bg-card border shadow-lg rounded-xl p-3 flex items-center gap-2"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">{t('matchFound')}</p>
                    <p className="text-[10px] text-muted-foreground">{t('matchType')}</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="flex justify-center pb-8"
        >
          <ChevronDown className="h-6 w-6 text-muted-foreground/50" />
        </motion.div>
      </section>

      {/* Live Stats */}
      <section className="border-y bg-card/50">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: 12500, suffix: '+', label: t('registeredDonors'), icon: Users, color: 'text-primary' },
              { value: 3800, suffix: '+', label: t('livesSaved'), icon: Heart, color: 'text-success' },
              { value: 450, suffix: '+', label: t('connectedHospitals'), icon: Award, color: 'text-warning' },
              { value: 98, suffix: '%', label: t('successRate'), icon: TrendingUp, color: 'text-primary' },
            ].map((stat, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
                className="text-center">
                <stat.icon className={`h-6 w-6 ${stat.color} mx-auto mb-2`} />
                <div className="text-3xl lg:text-4xl font-extrabold text-foreground">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-16">
            <span className="text-primary text-sm font-semibold uppercase tracking-wider">{t('simpleProcess')}</span>
            <h2 className="text-3xl lg:text-5xl font-bold text-foreground mt-2 mb-4">{t('howItWorks')}</h2>
            <p className="text-muted-foreground max-w-md mx-auto text-lg">{t('howItWorksSubtitle')}</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-16 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-primary/20 via-warning/20 to-success/20" />
            {[
              { icon: Users, title: t('step1Title'), desc: t('step1Desc'), color: 'bg-primary/10 text-primary', border: 'hover:border-primary/30' },
              { icon: Zap, title: t('step2Title'), desc: t('step2Desc'), color: 'bg-warning/10 text-warning', border: 'hover:border-warning/30' },
              { icon: Heart, title: t('step3Title'), desc: t('step3Desc'), color: 'bg-success/10 text-success', border: 'hover:border-success/30' },
            ].map((f, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
                className={`bg-card rounded-2xl p-8 border text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 ${f.border} relative`}>
                <div className={`w-16 h-16 rounded-2xl ${f.color} flex items-center justify-center mx-auto mb-6`}>
                  <f.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Blood Compatibility */}
      <section id="compatibility" className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-12">
            <span className="text-primary text-sm font-semibold uppercase tracking-wider">{t('vitalInfo')}</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mt-2 mb-4">{t('compatibilityTable')}</h2>
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
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-16">
            <span className="text-primary text-sm font-semibold uppercase tracking-wider">{t('testimonials')}</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mt-2 mb-4">{t('testimonialsTitle')}</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((tItem, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
                className="bg-card rounded-2xl border p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: tItem.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-warning text-warning" />
                  ))}
                </div>
                <p className="text-foreground leading-relaxed mb-6 italic">"{tItem.text}"</p>
                <div className="flex items-center gap-3 border-t pt-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">{tItem.avatar}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{tItem.name}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      {tItem.role} · <MapPin className="h-3 w-3" /> {tItem.city}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-12">
            <span className="text-primary text-sm font-semibold uppercase tracking-wider">{t('faq')}</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mt-2 mb-4">{t('faqTitle')}</h2>
          </motion.div>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="bg-card border rounded-xl px-6 data-[state=open]:shadow-md transition-shadow">
                  <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary transition-colors py-4">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="max-w-2xl mx-auto relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-2xl opacity-40" />
            <div className="relative bg-secondary rounded-2xl p-12 lg:p-16">
              <Heart className="h-12 w-12 text-primary mx-auto mb-5" />
              <h2 className="text-3xl lg:text-4xl font-bold text-secondary-foreground mb-4">{t('readyToSave')}</h2>
              <p className="text-secondary-foreground/70 mb-8 text-lg">{t('readyToSaveSubtitle')}</p>
              <Link to="/register">
                <Button size="lg" className="gap-2 text-base px-10 h-13 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all">
                  {t('startFree')} <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Droplet className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold text-foreground">LifeDrop</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{t('footerDesc')}</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">{t('platform')}</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <Link to="/register" className="block hover:text-primary transition-colors">{t('register')}</Link>
                <Link to="/login" className="block hover:text-primary transition-colors">{t('signIn')}</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">{t('resources')}</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <Link to="/donation-guide" className="block hover:text-primary transition-colors">{t('donationGuide')}</Link>
                <a href="#compatibility" className="block hover:text-primary transition-colors">{t('compatibility')}</a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">{t('contact')}</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2"><Phone className="h-3 w-3" /> blooddonation854@gmail.com</div>
                <div className="flex items-center gap-2"><Globe className="h-3 w-3" /> lifedrop.app</div>
              </div>
            </div>
          </div>
          <div className="border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">{t('allRightsReserved')}</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
