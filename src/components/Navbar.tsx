import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';
import { Droplet, Home, User, Bell, LogOut, PlusCircle, Menu, X, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import ThemeToggle from '@/components/ThemeToggle';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const Navbar = () => {
  const { user, logout, unreadCount } = useApp();
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const links = [
    { to: '/dashboard', label: t('dashboard'), icon: Home },
    { to: '/profile', label: t('profile'), icon: User },
    { to: '/notifications', label: t('notifications'), icon: Bell, badge: unreadCount },
    ...(user.role === 'hospital' ? [{ to: '/create-emergency', label: t('newEmergency'), icon: PlusCircle }] : []),
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r bg-card min-h-screen fixed left-0 top-0 z-40">
        <div className="p-6 border-b">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Droplet className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-display font-bold text-foreground tracking-tight">LifeDrop</span>
          </Link>
        </div>
        
        <div className="px-4 py-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-bold text-primary">{user.full_name.charAt(0)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{user.full_name}</p>
              <div className="flex items-center gap-1">
                <Heart className="h-3 w-3 text-primary" />
                <span className="text-xs text-muted-foreground">{user.blood_type} · {user.role === 'donor' ? t('donor') : t('hospital')}</span>
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                location.pathname === link.to
                  ? 'bg-primary/10 text-primary shadow-sm'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              }`}
            >
              <link.icon className="h-5 w-5" />
              {link.label}
              {link.badge ? (
                <span className="ml-auto bg-destructive text-destructive-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse-gentle">
                  {link.badge}
                </span>
              ) : null}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs text-muted-foreground">{t('theme')}</span>
            <div className="flex items-center gap-1">
              <ThemeToggle />
              <LanguageSwitcher />
            </div>
          </div>
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive" onClick={handleLogout}>
            <LogOut className="h-4 w-4" /> {t('logout')}
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-b h-14 flex items-center px-4 justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
            <Droplet className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
          <span className="text-base font-display font-bold text-foreground tracking-tight">LifeDrop</span>
        </Link>
        <div className="flex items-center gap-1">
          <LanguageSwitcher />
          <ThemeToggle />
          <Link to="/notifications" className="relative p-2">
            <Bell className="h-5 w-5 text-muted-foreground" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-destructive text-destructive-foreground text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center animate-pulse-gentle">
                {unreadCount}
              </span>
            )}
          </Link>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm" onClick={() => setMobileOpen(false)}>
          <div className="absolute right-0 top-14 w-72 bg-card border-l shadow-xl h-full p-4 space-y-1 animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 p-3 mb-3 bg-muted rounded-lg">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-bold text-primary">{user.full_name.charAt(0)}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{user.full_name}</p>
                <p className="text-xs text-muted-foreground">{user.blood_type} · {user.role === 'donor' ? t('donor') : t('hospital')}</p>
              </div>
            </div>
            {links.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.to ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                }`}
              >
                <link.icon className="h-5 w-5" />
                {link.label}
              </Link>
            ))}
            <div className="border-t mt-3 pt-3">
              <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-accent w-full">
                <LogOut className="h-5 w-5" /> {t('logout')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-t flex justify-around py-2 px-2">
        {links.slice(0, 4).map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={`flex flex-col items-center gap-0.5 text-xs relative px-3 py-1 rounded-lg transition-colors ${
              location.pathname === link.to ? 'text-primary bg-primary/5' : 'text-muted-foreground'
            }`}
          >
            <link.icon className="h-5 w-5" />
            <span className="text-[10px]">{link.label}</span>
            {link.badge ? (
              <span className="absolute -top-1 right-0 bg-destructive text-destructive-foreground text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {link.badge}
              </span>
            ) : null}
          </Link>
        ))}
      </nav>
    </>
  );
};

export default Navbar;
