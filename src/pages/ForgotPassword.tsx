import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { Droplet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import ThemeToggle from '@/components/ThemeToggle';

const ForgotPassword = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <Droplet className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">LifeDrop</span>
          </Link>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
        </div>
        <div className="bg-card rounded-xl border p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-foreground mb-2">{t('resetPassword')}</h1>
          <p className="text-muted-foreground mb-6">{t('resetSubtitle')}</p>
          {sent ? (
            <div className="bg-success/10 text-success p-3 rounded-md text-sm">
              {t('resetSent')} <Link to="/login" className="underline font-medium">{t('backToLogin')}</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">{t('email')}</Label>
                <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
              </div>
              <Button type="submit" className="w-full" disabled={!email.includes('@')}>{t('sendResetLink')}</Button>
            </form>
          )}
          <p className="text-center text-sm text-muted-foreground mt-6">
            <Link to="/login" className="text-primary hover:underline">{t('backToLogin')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
