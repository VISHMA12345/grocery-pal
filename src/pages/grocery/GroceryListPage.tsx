import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import { useAppStore } from '@/stores/appStore';
import { getGroceryLists, deleteGroceryList as deleteGroceryApi } from '@/api/groceryApi';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, Eye, ShoppingBasket } from 'lucide-react';
import { toast } from 'sonner';

const GroceryListPage = () => {
  const { groceryLists, setGroceryLists, removeGroceryList, addBasket } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    getGroceryLists().then((res) => setGroceryLists(res.data));
  }, []);

  const handleDelete = async (id: string) => {
    await deleteGroceryApi(id);
    removeGroceryList(id);
    toast.success('Grocery list deleted');
  };

  const convertToBasket = (gl: typeof groceryLists[0]) => {
    const basket = {
      id: Date.now().toString(),
      grocery_id: gl.id,
      grocery_name: gl.name,
      store_name: gl.store_name,
      status: 'started' as const,
      items: gl.items.map((i) => ({ ...i, completed: false })),
    };
    addBasket(basket);
    toast.success('Converted to basket! 🧺');
    navigate('/baskets');
  };

  return (
    <MainLayout title="Grocery Lists">
      <div className="space-y-4 animate-fade-in">
        <Button onClick={() => navigate('/grocery-lists/create')} className="w-full">
          <Plus className="w-4 h-4 mr-2" /> New Grocery List
        </Button>

        <div className="space-y-3">
          {groceryLists.map((gl) => (
            <div key={gl.id} className="grocery-card">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">📝</span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-foreground">{gl.name}</p>
                  <p className="text-xs text-muted-foreground">🏪 {gl.store_name} • {gl.items.length} items</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => navigate(`/grocery-lists/${gl.id}`)}>
                  <Eye className="w-3.5 h-3.5 mr-1" /> View
                </Button>
                <Button size="sm" variant="outline" onClick={() => navigate(`/grocery-lists/edit/${gl.id}`)}>
                  <Pencil className="w-3.5 h-3.5 mr-1" /> Edit
                </Button>
                <Button size="sm" variant="outline" onClick={() => convertToBasket(gl)}>
                  <ShoppingBasket className="w-3.5 h-3.5 mr-1" /> Basket
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleDelete(gl.id)} className="text-destructive hover:text-destructive">
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
          {groceryLists.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <span className="text-4xl block mb-2">📝</span>
              No grocery lists yet
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default GroceryListPage;
