import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import { useAppStore } from '@/stores/appStore';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShoppingBasket } from 'lucide-react';
import { toast } from 'sonner';
import { convertToBasketWithId } from '@/api/groceryApi';

const GroceryDetails = () => {
  const { _id } = useParams<{ _id: string }>();
  const { groceryLists, addBasket } = useAppStore();
  const navigate = useNavigate();
  const gl = groceryLists.find((g) => g._id === _id);

  if (!gl) return <MainLayout title="Grocery Details"><p className="text-muted-foreground">Not found</p></MainLayout>;

  const convertToBasket = async () => {
    addBasket({
      _id: Date.now().toString(),
      listName: gl.listName,
      storeName: gl.storeName,
      status: 'started',
      productDetails: gl.productDetails || [],
      itemCount: gl.itemCount || 0,
    });
    await convertToBasketWithId(gl._id);
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
          <h2 className="text-xl font-bold text-foreground">{gl.listName}</h2>
          <p className="text-sm text-muted-foreground">🏪 {gl.storeName}</p>
        </div>

        <div className="space-y-2">
          {gl.productDetails?.map((item) => (
            <div key={item._id} className="grocery-card flex items-center justify-between">
              <div>
                <p className="font-semibold text-foreground">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.qty} {item.unit} • {item.description}</p>
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
