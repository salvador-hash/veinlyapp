import { Link } from 'react-router-dom';
import { Droplet, Heart, Clock, Shield, ArrowRight, Users, Zap } from 'lucide-react';
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
                <Button className="gap-2">Go to Dashboard <ArrowRight className="h-4 w-4" /></Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link to="/register">
                  <Button className="gap-2"><Heart className="h-4 w-4" /> Get Started</Button>
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
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <Heart className="h-4 w-4 animate-pulse-gentle" /> Saving lives together
            </div>
            <h1 className="text-4xl lg:text-6xl font-extrabold text-foreground leading-tight mb-6">
              Every Drop<br />
              <span className="text-gradient">Counts</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-lg leading-relaxed">
              Connect blood donors with patients in real-time emergencies. Fast matching, instant notifications, lives saved.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/register">
                <Button size="lg" className="gap-2 text-base px-8 h-12 shadow-lg hover:shadow-xl transition-shadow">
                  Become a Donor <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="outline" className="text-base px-8 h-12">
                  Register Hospital
                </Button>
              </Link>
            </div>
            
            {/* Trust indicators */}
            <div className="flex items-center gap-6 mt-10 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-success" />
                <span>Verified donors</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-warning" />
                <span>Real-time matching</span>
              </div>
            </div>
          </div>
          <div className="hidden lg:block animate-fade-in">
            <img src={heroImage} alt="Blood donation illustration" className="w-full max-w-lg mx-auto rounded-2xl shadow-2xl" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-muted py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-3">How It Works</h2>
            <p className="text-muted-foreground max-w-md mx-auto">Three simple steps to start saving lives in your community</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Users, title: '1. Register', desc: 'Create your profile with blood type and location. It takes less than a minute.', color: 'bg-primary/10 text-primary' },
              { icon: Zap, title: '2. Get Matched', desc: 'Our system instantly matches donors with compatible emergencies nearby.', color: 'bg-warning/10 text-warning' },
              { icon: Heart, title: '3. Save Lives', desc: 'Respond to emergencies and become a hero in your community.', color: 'bg-success/10 text-success' },
            ].map((f, i) => (
              <div key={i} className="bg-card rounded-xl p-8 border text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className={`w-14 h-14 rounded-2xl ${f.color} flex items-center justify-center mx-auto mb-5`}>
                  <f.icon className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto bg-secondary rounded-2xl p-12">
            <Heart className="h-10 w-10 text-primary mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-secondary-foreground mb-3">Ready to save lives?</h2>
            <p className="text-secondary-foreground/70 mb-8">Join thousands of donors making a difference every day.</p>
            <Link to="/register">
              <Button size="lg" className="gap-2 text-base px-8 h-12">
                Get Started Free <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Droplet className="h-5 w-5 text-primary" />
            <span className="font-semibold text-foreground">LifeDrop</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 LifeDrop. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
