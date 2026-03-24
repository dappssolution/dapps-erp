import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Wallet, CalendarDays, Menu, X, Building2, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { authService } from '@/services/auth';
import ThemeToggle from '@/components/ThemeToggle';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/business', label: 'Business Numbers', icon: Users },
  { path: '/expenses', label: 'Expenses', icon: Wallet },
  { path: '/leave', label: 'Leave', icon: CalendarDays },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authService.logout();
    navigate('/login', { replace: true });
  };

  return (
    <>
      <button onClick={() => setMobileOpen(true)} className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-card border border-border md:hidden">
        <Menu className="w-5 h-5" />
      </button>

      {mobileOpen && <div className="fixed inset-0 z-40 bg-background/80 md:hidden" onClick={() => setMobileOpen(false)} />}

      <aside className={cn(
        "fixed top-0 left-0 z-50 h-full bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-60",
        mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <Building2 className="w-6 h-6 text-primary" />
              <span className="font-bold text-lg text-gradient">CRM Manager</span>
            </div>
          )}
          <button onClick={() => { setCollapsed(!collapsed); setMobileOpen(false); }} className="p-1.5 rounded-md hover:bg-sidebar-accent transition-colors">
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

        <nav className="flex-1 py-4 space-y-1 px-2">
          {navItems.map(({ path, label, icon: Icon }) => {
            const active = location.pathname === path;
            return (
              <NavLink key={path} to={path} onClick={() => setMobileOpen(false)}
                className={cn("flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium",
                  active ? "bg-primary/15 text-primary glow-border" : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}>
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span>{label}</span>}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-3 border-t border-sidebar-border space-y-2">
          <div className={cn("flex items-center", collapsed ? "justify-center" : "justify-between px-1")}>
            {!collapsed && <span className="text-xs text-muted-foreground">Theme</span>}
            <ThemeToggle />
          </div>
          <button onClick={handleLogout} className={cn("flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors", collapsed && "justify-center")}>
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
          {!collapsed && <p className="text-xs text-muted-foreground px-1">© 2025 CRM Manager</p>}
        </div>
      </aside>
    </>
  );
}
