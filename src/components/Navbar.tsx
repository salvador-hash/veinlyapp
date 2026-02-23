import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Droplet, Home, User, Bell, LogOut, PlusCircle, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout, unreadCount } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: Home },
    { to: '/profile', label: 'Profile', icon: User },
    { to: '/notifications', label: 'Notifications', icon: Bell, badge: unreadCount },
    ...(user.role === 'hospital' ? [{ to: '/create-emergency', label: 'New Emergency', icon: PlusCircle }] : []),
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r bg-card min-h-screen fixed left-0 top-0 z-40">
        <div className="p-6 border-b">
          <Link to="/" className="flex items-center gap-2">
            <Droplet className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold text-foreground">LifeDrop</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                location.pathname === link.to
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              }`}
            >
              <link.icon className="h-5 w-5" />
              {link.label}
              {link.badge ? (
                <span className="ml-auto bg-destructive text-destructive-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {link.badge}
                </span>
              ) : null}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t">
          <div className="text-sm text-muted-foreground mb-2 truncate">{user.full_name}</div>
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-muted-foreground" onClick={handleLogout}>
            <LogOut className="h-4 w-4" /> Sign Out
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b h-14 flex items-center px-4 justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Droplet className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold text-foreground">LifeDrop</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link to="/notifications" className="relative p-2">
            <Bell className="h-5 w-5 text-muted-foreground" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-destructive text-destructive-foreground text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
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
          <div className="absolute right-0 top-14 w-64 bg-card border-l h-full p-4 space-y-1" onClick={e => e.stopPropagation()}>
            {links.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                }`}
              >
                <link.icon className="h-5 w-5" />
                {link.label}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground w-full"
            >
              <LogOut className="h-5 w-5" /> Sign Out
            </button>
          </div>
        </div>
      )}

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t flex justify-around py-2">
        {links.slice(0, 4).map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={`flex flex-col items-center gap-0.5 text-xs relative ${
              location.pathname === link.to ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <link.icon className="h-5 w-5" />
            {link.label}
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
