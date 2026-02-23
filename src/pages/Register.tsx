import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Droplet, Loader2 } from 'lucide-react';
import { BLOOD_TYPES, type BloodType, type UserRole } from '@/types';

const Register = () => {
  const { register } = useApp();
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
    const success = await register({
      full_name: form.full_name,
      email: form.email,
      blood_type: form.blood_type as BloodType,
      country: form.country,
      city: form.city,
      phone: form.phone,
      role: form.role as UserRole,
    }, form.password);
    setLoading(false);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('An account with this email already exists');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <Droplet className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">LifeDrop</span>
          </Link>
        </div>
        <div className="bg-card rounded-lg border p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-foreground mb-2">Create Account</h1>
          <p className="text-muted-foreground mb-6">Join the network of life savers</p>

          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md mb-4">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="full_name">Full Name *</Label>
              <Input id="full_name" value={form.full_name} onChange={e => update('full_name', e.target.value)} placeholder="John Doe" />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="you@example.com" />
              {form.email && !emailValid && <p className="text-destructive text-xs mt-1">Please enter a valid email</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Blood Type *</Label>
                <Select value={form.blood_type} onValueChange={v => update('blood_type', v)}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {BLOOD_TYPES.map(bt => <SelectItem key={bt} value={bt}>{bt}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Role *</Label>
                <Select value={form.role} onValueChange={v => update('role', v)}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="donor">Donor</SelectItem>
                    <SelectItem value="hospital">Hospital</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="country">Country *</Label>
                <Input id="country" value={form.country} onChange={e => update('country', e.target.value)} placeholder="USA" />
              </div>
              <div>
                <Label htmlFor="city">City *</Label>
                <Input id="city" value={form.city} onChange={e => update('city', e.target.value)} placeholder="New York" />
              </div>
            </div>
            <div>
              <Label htmlFor="phone">Phone *</Label>
              <Input id="phone" value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="+1 234 567 8900" />
            </div>
            <div>
              <Label htmlFor="password">Password *</Label>
              <Input id="password" type="password" value={form.password} onChange={e => update('password', e.target.value)} placeholder="Min 6 characters" />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <Input id="confirmPassword" type="password" value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)} placeholder="••••••••" />
              {form.confirmPassword && form.password !== form.confirmPassword && <p className="text-destructive text-xs mt-1">Passwords don't match</p>}
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="terms" checked={form.terms} onCheckedChange={v => update('terms', v === true)} />
              <Label htmlFor="terms" className="text-sm font-normal">I accept the terms and conditions *</Label>
            </div>
            <Button type="submit" className="w-full" disabled={!isValid || loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Register
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account? <Link to="/login" className="text-primary hover:underline font-medium">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
