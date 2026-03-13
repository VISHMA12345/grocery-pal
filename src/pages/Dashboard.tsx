import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import { useAppStore } from '@/stores/appStore';
import { getBaskets } from '@/api/basketApi';
import { Button } from '@/components/ui/button';
import { ShoppingBasket, ClipboardList, Grid3X3, Package, ArrowRight } from 'lucide-react';

const Dashboard = () => {
  const { user, baskets, setBaskets } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    getBaskets().then((res) => setBaskets(res.data));
  }, []);

  const activeBasket = baskets.find((b) => b.status === 'started');

  return (
    <MainLayout title="Dashboard">
      <div className="space-y-5 animate-fade-in">
        {/* Greeting */}
        <div className="grocery-card grocery-gradient text-primary-foreground">
          <h2 className="text-xl font-bold">Hello, {user?.name || 'Shopper'} 👋</h2>
          <p className="text-primary-foreground/80 text-sm mt-1">Let's get your groceries sorted!</p>
        </div>

        {/* Active Purchase Alert */}
        {activeBasket && (
          <div className="grocery-card border-2 border-primary bg-secondary">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <ShoppingBasket className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-foreground">Open purchase waiting!</p>
                <p className="text-sm text-muted-foreground">{activeBasket.listName}</p>
              </div>
            </div>
            <Button onClick={() => navigate(`/baskets/${activeBasket._id}`)} className="w-full">
              Go to Basket <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: ClipboardList, label: 'Grocery Lists', path: '/grocery-lists', emoji: '📝' },
            { icon: ShoppingBasket, label: 'Baskets', path: '/baskets', emoji: '🧺' },
            { icon: Grid3X3, label: 'Categories', path: '/categories', emoji: '📂' },
            { icon: Package, label: 'Products', path: '/products', emoji: '📦' },
          ].map(({ label, path, emoji }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="grocery-card-hover text-left"
            >
              <span className="text-3xl">{emoji}</span>
              <p className="font-semibold text-foreground mt-2 text-sm">{label}</p>
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="grocery-card">
          <h3 className="font-bold text-foreground mb-3">Quick Stats</h3>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-secondary rounded-xl p-3">
              <p className="text-2xl font-bold text-primary">{baskets.filter(b => b.status === 'started').length}</p>
              <p className="text-xs text-muted-foreground">Active</p>
            </div>
            <div className="bg-secondary rounded-xl p-3">
              <p className="text-2xl font-bold text-primary">{baskets.filter(b => b.status === 'completed').length}</p>
              <p className="text-xs text-muted-foreground">Done</p>
            </div>
            <div className="bg-secondary rounded-xl p-3">
              <p className="text-2xl font-bold text-primary">{baskets.filter(b => b.status === 'cancelled').length}</p>
              <p className="text-xs text-muted-foreground">Cancelled</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
