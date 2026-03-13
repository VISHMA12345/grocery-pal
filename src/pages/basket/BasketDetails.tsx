import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import { useAppStore } from '@/stores/appStore';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check } from 'lucide-react';
import { toast } from 'sonner';
import { emitSocketEvent, socketEvents } from '@/socket/socket';
import { ProductDetail } from '@/api/groceryApi';

const BasketDetails = () => {
  const { _id } = useParams<{ _id: string }>();
  const { baskets, toggleBasketItem, updateBasketStatus } = useAppStore();
  const navigate = useNavigate();
  const basket = baskets.find((b) => b._id === _id);

  if (!basket) return <MainLayout title="Basket"><p className="text-muted-foreground">Not found</p></MainLayout>;

  const allCompleted = basket.productDetails.every((i) => (i as any).completed);

  const handleToggle = (productId: string) => {
    toggleBasketItem(basket._id, productId);
    const item = basket.productDetails.find((i) => i._id === productId);
    if (item && !(item as any).completed) {
      emitSocketEvent(socketEvents.PRODUCT_COMPLETED, { basketId: basket._id, productId });
      toast.success(`${item.name} completed ✅`);
    }
  };

  const completePurchase = () => {
    updateBasketStatus(basket._id, 'completed');
    toast.success('Purchase completed! 🎉');
    navigate('/baskets');
  };

  const renderItem = (item: ProductDetail) => (
    <div key={item._id} className={`grocery-card flex items-center gap-3 ${(item as any).completed ? 'opacity-60' : ''}`}>
      <Checkbox checked={(item as any).completed} onCheckedChange={() => handleToggle(item._id)} disabled={basket.status !== 'started'} />
      <div className="flex-1">
        <p className={`font-semibold text-foreground ${(item as any).completed ? 'line-through' : ''}`}>{item.name}</p>
        <p className="text-xs text-muted-foreground">{item.qty} {item.unit}</p>
      </div>
      {(item as any).completed && <Check className="w-4 h-4 text-primary" />}
    </div>
  );

  return (
    <MainLayout title="Basket Details">
      <div className="animate-fade-in space-y-4">
        <button onClick={() => navigate('/baskets')} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="grocery-card grocery-gradient text-primary-foreground">
          <h2 className="text-lg font-bold">{basket.listName}</h2>
          <p className="text-primary-foreground/80 text-sm">🏪 {basket.storeName}</p>
        </div>

        {/* All Items */}
        <div>
          <h3 className="font-bold text-foreground mb-2">🛍️ Items ({basket.productDetails.filter(i => (i as any).completed).length}/{basket.productDetails.length})</h3>
          <div className="space-y-2">
            {basket.productDetails.map(renderItem)}
            {basket.productDetails.length === 0 && <p className="text-sm text-muted-foreground">No items in this basket</p>}
          </div>
        </div>

        {basket.status === 'started' && allCompleted && basket.productDetails.length > 0 && (
          <Button onClick={completePurchase} className="w-full">
            Complete Purchase 🎉
          </Button>
        )}
      </div>
    </MainLayout>
  );
};

export default BasketDetails;
