import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Droplet, Loader2, Heart } from 'lucide-react';

const Login = () => {
  const { login } = useApp();
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
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen flex bg-muted">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-secondary to-secondary/80 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-40 h-40 rounded-full border-2 border-primary-foreground/20" />
          <div className="absolute bottom-32 right-16 w-64 h-64 rounded-full border-2 border-primary-foreground/10" />
          <div className="absolute top-1/2 left-1/2 w-32 h-32 rounded-full border-2 border-primary-foreground/15" />
        </div>
        <div className="text-center relative">
          <Heart className="h-16 w-16 text-primary mx-auto mb-6 animate-pulse-gentle" />
          <h2 className="text-3xl font-bold text-secondary-foreground mb-4">Every Drop Counts</h2>
          <p className="text-secondary-foreground/70 max-w-sm">Join thousands of donors and hospitals connected through LifeDrop.</p>
        </div>
      </div>
      
      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2">
              <Droplet className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-foreground">LifeDrop</span>
            </Link>
          </div>
          <div className="bg-card rounded-xl border p-8 shadow-sm">
            <h1 className="text-2xl font-bold text-foreground mb-2">Welcome back 👋</h1>
            <p className="text-muted-foreground mb-6">Sign in to your account to continue</p>
            
            {error && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg mb-4 flex items-center gap-2">
                <span>⚠️</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="mt-1.5" />
              </div>
              <div className="flex justify-end">
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">Forgot password?</Link>
              </div>
              <Button type="submit" className="w-full h-11" disabled={!isValid || loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Sign In
              </Button>
            </form>
            <p className="text-center text-sm text-muted-foreground mt-6">
              Don't have an account? <Link to="/register" className="text-primary hover:underline font-medium">Register</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
