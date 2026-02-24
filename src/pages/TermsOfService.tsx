import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { Droplet, ArrowLeft, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import ThemeToggle from '@/components/ThemeToggle';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const TermsOfService = () => {
  const { t } = useLanguage();

  const sections = [
    { title: t('termsSection1Title'), content: t('termsSection1Content') },
    { title: t('termsSection2Title'), content: t('termsSection2Content') },
    { title: t('termsSection3Title'), content: t('termsSection3Content') },
    { title: t('termsSection4Title'), content: t('termsSection4Content') },
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

      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-4xl font-extrabold text-foreground mb-3">{t('termsTitle')}</h1>
          <p className="text-muted-foreground">{t('termsLastUpdated')}</p>
        </motion.div>

        <div className="space-y-8">
          {sections.map((section, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="bg-card rounded-xl border p-6">
              <h2 className="text-lg font-bold text-foreground mb-3">{section.title}</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{section.content}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12 text-sm text-muted-foreground">
          <p>{t('termsContact')}: blooddonation854@gmail.com</p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
