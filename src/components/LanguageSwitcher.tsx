import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
      title={language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
      className="h-9 w-9"
    >
      <span className="text-xs font-bold">{language === 'es' ? 'EN' : 'ES'}</span>
    </Button>
  );
};

export default LanguageSwitcher;
