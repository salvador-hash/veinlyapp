import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Droplet, Loader2, Heart } from 'lucide-react';
import { BLOOD_TYPES, type BloodType, type UserRole } from '@/types';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import ThemeToggle from '@/components/ThemeToggle';

const Register = () => {
  const { register } = useApp();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    blood_type: '' as BloodType | '',
    country: '',
    city: '',
    phone: '',
    role: '' as UserRole | '',
    password: '',
    confirmPassword: '',
    terms: false,
  });

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const isValid = form.full_name && emailValid && form.blood_type && form.country && form.city && form.phone && form.role && form.password.length >= 6 && form.password === form.confirmPassword && form.terms;

  const update = (field: string, value: string | boolean) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setError('');
    setLoading(true);
    const result = await register({
      full_name: form.full_name,
      email: form.email,
      blood_type: form.blood_type as BloodType,
      country: form.country,
      city: form.city,
      phone: form.phone,
      role: form.role as UserRole,
    }, form.password);
    setLoading(false);
    if (result.success) {
      navigate('/verify-email', { state: { email: form.email } });
    } else if (result.error === 'already_exists') {
      setError(t('accountExists'));
    } else {
      setError(result.error || t('somethingWentWrong'));
    }
  };

  return (
    <div className="min-h-screen flex bg-muted">
      <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-secondary to-secondary/80 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-40 h-40 rounded-full border-2 border-primary-foreground/20" />
          <div className="absolute bottom-32 right-16 w-64 h-64 rounded-full border-2 border-primary-foreground/10" />
        </div>
        <div className="text-center relative">
          <Heart className="h-16 w-16 text-primary mx-auto mb-6 animate-pulse-gentle" />
          <h2 className="text-3xl font-bold text-secondary-foreground mb-4">{t('joinLifeDrop')}</h2>
          <p className="text-secondary-foreground/70 max-w-sm">{t('joinLifeDropDesc')}</p>
        </div>
      </div>
      
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-between mb-6">
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
            <h1 className="text-2xl font-bold text-foreground mb-2">{t('createAccount')}</h1>
            <p className="text-muted-foreground mb-6">{t('joinNetwork')}</p>

            {error && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg mb-4 flex items-center gap-2">
                <span>⚠️</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="full_name">{t('fullName')}</Label>
                <Input id="full_name" value={form.full_name} onChange={e => update('full_name', e.target.value)} placeholder="John Doe" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="email">{t('email')} *</Label>
                <Input id="email" type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="you@example.com" className="mt-1.5" />
                {form.email && !emailValid && <p className="text-destructive text-xs mt-1">{t('invalidEmail')}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{t('bloodType')}</Label>
                  <Select value={form.blood_type} onValueChange={v => update('blood_type', v)}>
                    <SelectTrigger className="mt-1.5"><SelectValue placeholder={t('select')} /></SelectTrigger>
                    <SelectContent>
                      {BLOOD_TYPES.map(bt => <SelectItem key={bt} value={bt}>{bt}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>{t('role')}</Label>
                  <Select value={form.role} onValueChange={v => update('role', v)}>
                    <SelectTrigger className="mt-1.5"><SelectValue placeholder={t('select')} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="donor">🩸 {t('donor')}</SelectItem>
                      <SelectItem value="hospital">🏥 {t('hospital')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="country">{t('country')}</Label>
                  <Input id="country" value={form.country} onChange={e => update('country', e.target.value)} className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="city">{t('city')}</Label>
                  <Input id="city" value={form.city} onChange={e => update('city', e.target.value)} className="mt-1.5" />
                </div>
              </div>
              <div>
                <Label htmlFor="phone">{t('phone')}</Label>
                <Input id="phone" value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="+1 234 567 8900" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="password">{t('password')} *</Label>
                <Input id="password" type="password" value={form.password} onChange={e => update('password', e.target.value)} placeholder="Min 6 characters" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="confirmPassword">{t('confirmPassword')}</Label>
                <Input id="confirmPassword" type="password" value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)} placeholder="••••••••" className="mt-1.5" />
                {form.confirmPassword && form.password !== form.confirmPassword && <p className="text-destructive text-xs mt-1">{t('passwordsDontMatch')}</p>}
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                <Checkbox id="terms" checked={form.terms} onCheckedChange={v => update('terms', v === true)} />
                <Label htmlFor="terms" className="text-sm font-normal">{t('acceptTerms')}</Label>
              </div>
              <Button type="submit" className="w-full h-11" disabled={!isValid || loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                {t('createAccount').replace(' ✨', '')}
              </Button>
            </form>
            <p className="text-center text-sm text-muted-foreground mt-6">
              {t('alreadyHaveAccount')} <Link to="/login" className="text-primary hover:underline font-medium">{t('signIn')}</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
