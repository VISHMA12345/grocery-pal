import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import { useAppStore } from '@/stores/appStore';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShoppingBasket } from 'lucide-react';
import { toast } from 'sonner';

const GroceryDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { groceryLists, addBasket } = useAppStore();
  const navigate = useNavigate();
  const gl = groceryLists.find((g) => g.id === id);

  if (!gl) return <MainLayout title="Grocery Details"><p className="text-muted-foreground">Not found</p></MainLayout>;

  const convertToBasket = () => {
    addBasket({
      id: Date.now().toString(), grocery_id: gl.id, grocery_name: gl.name,
      store_name: gl.store_name, status: 'started',
      items: gl.items.map((i) => ({ ...i, completed: false })),
    });
    toast.success('Converted to basket! 🧺');
    navigate('/baskets');
  };

  return (
    <MainLayout title="Grocery Details">
      <div className="animate-fade-in space-y-4">
        <button onClick={() => navigate('/grocery-lists')} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="grocery-card">
          <h2 className="text-xl font-bold text-foreground">{gl.name}</h2>
          <p className="text-sm text-muted-foreground">🏪 {gl.store_name}</p>
        </div>

        <div className="space-y-2">
          {gl.items.map((item) => (
            <div key={item.product_id} className="grocery-card flex items-center justify-between">
              <div>
                <p className="font-semibold text-foreground">{item.product_name}</p>
                <p className="text-xs text-muted-foreground">{item.quantity} {item.unit} • Assigned to: {item.assign_to === 'me' ? '👤 Me' : '👥 Partner'}</p>
              </div>
            </div>
          ))}
        </div>

        <Button onClick={convertToBasket} className="w-full">
          <ShoppingBasket className="w-4 h-4 mr-2" /> Convert to Basket
        </Button>
      </div>
    </MainLayout>
  );
};

export default GroceryDetails;
