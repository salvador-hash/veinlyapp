import { Link } from 'react-router-dom';
import { Droplet, Heart, Clock, Shield, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';
import heroImage from '@/assets/hero-image.png';

const Landing = () => {
  const { user } = useApp();

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Droplet className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold text-foreground">LifeDrop</span>
          </Link>
          <div className="flex items-center gap-3">
            {user ? (
              <Link to="/dashboard">
                <Button>Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link to="/register">
                  <Button>Register</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="container mx-auto px-4 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-6">
              <Heart className="h-4 w-4" /> Saving lives together
            </div>
            <h1 className="text-4xl lg:text-6xl font-extrabold text-foreground leading-tight mb-6">
              Every Drop<br />
              <span className="text-primary">Counts</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-lg">
              Connect blood donors with patients in real-time emergencies. Fast matching, instant notifications, lives saved.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/register">
                <Button size="lg" className="gap-2">
                  Become a Donor <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="outline">
                  Register Hospital
                </Button>
              </Link>
            </div>
          </div>
          <div className="hidden lg:block animate-fade-in">
            <img src={heroImage} alt="Blood donation illustration" className="w-full max-w-lg mx-auto rounded-2xl shadow-lg" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-muted py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Heart, title: 'Register', desc: 'Create your profile with blood type and location info.' },
              { icon: Clock, title: 'Get Matched', desc: 'Our system instantly matches donors with compatible emergencies.' },
              { icon: Shield, title: 'Save Lives', desc: 'Respond to emergencies and help save lives in your community.' },
            ].map((f, i) => (
              <div key={i} className="bg-card rounded-lg p-6 border text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2026 LifeDrop. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Landing;
