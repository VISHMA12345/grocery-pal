import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingBasket, ClipboardList, Grid3X3, User, UserPlus } from 'lucide-react';

const tabs = [
  { path: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { path: '/baskets', label: 'Basket', icon: ShoppingBasket },
  { path: '/grocery-lists', label: 'Lists', icon: ClipboardList },
  { path: '/categories', label: 'Category', icon: Grid3X3 },
  { path: '/users', label: 'Users', icon: UserPlus },
  { path: '/profile', label: 'Profile', icon: User },
];

const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <div className="max-w-lg mx-auto flex justify-around items-center h-16 px-2">
        {tabs.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname.startsWith(path);
          return (
            <NavLink
              key={path}
              to={path}
              className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-colors ${isActive ? 'bg-secondary' : ''}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-semibold">{label}</span>
            </NavLink>
          );
        })}
      </div>
      {/* Safe area for iOS */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
};

export default BottomNav;
