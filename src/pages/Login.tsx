import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Droplet, Loader2, Heart, ArrowLeft } from 'lucide-react';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import ThemeToggle from '@/components/ThemeToggle';

const Login = () => {
  const { login } = useApp();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isValid = email.includes('@') && password.length >= 6;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (success) {
      navigate('/dashboard');
    } else {
      setError(t('invalidCredentials'));
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left side - Visual */}
      <div className="hidden lg:flex lg:w-1/2 bg-foreground items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
        <div className="absolute inset-0 opacity-[0.03]">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="absolute rounded-full border border-background/10"
              style={{
                width: `${150 + i * 80}px`, height: `${150 + i * 80}px`,
                top: `${20 + i * 5}%`, left: `${10 + i * 8}%`,
              }}
            />
          ))}
        </div>
        <div className="text-center relative z-10">
          <Heart className="h-14 w-14 text-primary mx-auto mb-6 animate-pulse-gentle" />
          <h2 className="text-3xl font-display font-bold text-background mb-3 tracking-tight">{t('everyDropCounts')}</h2>
          <p className="text-background/50 max-w-sm text-sm">{t('joinThousands')}</p>
        </div>
      </div>
      
      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="flex items-center justify-between mb-10">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Droplet className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-display font-bold text-foreground tracking-tight">LifeDrop</span>
            </Link>
            <div className="flex items-center gap-1">
              <ThemeToggle />
              <LanguageSwitcher />
            </div>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-display font-bold text-foreground mb-2 tracking-tight">{t('welcomeBack')}</h1>
            <p className="text-muted-foreground text-sm">{t('signInSubtitle')}</p>
          </div>
          
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg mb-4 flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-xs font-medium">{t('email')}</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="mt-1.5 h-11 rounded-lg" />
            </div>
            <div>
              <Label htmlFor="password" className="text-xs font-medium">{t('password')}</Label>
              <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="mt-1.5 h-11 rounded-lg" />
            </div>
            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-xs text-primary hover:underline">{t('forgotPassword')}</Link>
            </div>
            <Button type="submit" className="w-full h-11 rounded-lg" disabled={!isValid || loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {t('signIn')}
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-6">
            {t('noAccount')} <Link to="/register" className="text-primary hover:underline font-medium">{t('register')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
