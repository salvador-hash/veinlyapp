import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Droplet, Loader2, Mail, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const { toast } = useToast();
  const email = (location.state as { email?: string })?.email || '';
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async () => {
    if (code.length !== 8) return;
    setError('');
    setLoading(true);
    try {
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token: code,
        type: 'signup',
      });
      if (verifyError) {
        setError(verifyError.message);
      } else {
        const pendingProfile = localStorage.getItem('pending_profile');
        if (pendingProfile) {
          try {
            const profileData = JSON.parse(pendingProfile);
            await supabase.from('profiles').upsert(profileData);
            localStorage.removeItem('pending_profile');
          } catch (e) {
            console.warn('Pending profile creation failed:', e);
          }
        }
        toast({ title: t('emailVerified') });
        navigate('/dashboard');
      }
    } catch {
      setError(t('verifyError'));
    }
    setLoading(false);
  };

  const handleResend = async () => {
    const { error } = await supabase.auth.resend({ type: 'signup', email });
    if (error) {
      toast({ title: t('resendError'), description: error.message, variant: 'destructive' });
    } else {
      toast({ title: t('codeResent'), description: t('checkInbox') });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2">
            <Droplet className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">Veinly</span>
          </Link>
        </div>

        <div className="bg-card rounded-xl border p-8 shadow-sm text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">{t('verifyEmail')}</h1>
          <p className="text-muted-foreground mb-1">{t('codeSentTo')}</p>
          <p className="text-foreground font-medium mb-6">{email || t('yourEmail')}</p>

          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg mb-4 flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          <div className="flex justify-center mb-6">
            <InputOTP maxLength={8} value={code} onChange={setCode}>
              <InputOTPGroup>
                {Array.from({ length: 8 }).map((_, i) => (
                  <InputOTPSlot key={i} index={i} />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>

          <Button onClick={handleVerify} className="w-full h-11 mb-4" disabled={code.length !== 8 || loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
            {t('verifyCode')}
          </Button>

          <p className="text-sm text-muted-foreground">
            {t('didntReceive')}{' '}
            <button onClick={handleResend} className="text-primary hover:underline font-medium">
              {t('resend')}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
