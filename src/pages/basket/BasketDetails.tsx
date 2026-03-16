import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { emitSocketEvent, socketEvents } from '@/socket/socket';
import { basketDetailsId, toggleProductCompletion } from '@/api/basketApi';

interface BasketItem {
  productId: string;
  quantity: number;
  unit: string;
  isCompleted: number;
  product?: {
    name: string;
  };
  assignedUser?: {
    _id: string;
    name: string;
  };
}

interface BasketData {
  _id: string;
  listName: string;
  storeName: string;
  status: string;
  items: BasketItem[];
}

const BasketDetails = () => {
  const { _id } = useParams<{ _id: string }>();
  const navigate = useNavigate();
  const [basket, setBasket] = useState<BasketData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (_id) {
      fetchBasketDetails();
    }
  }, [_id]);

  const fetchBasketDetails = async () => {
    try {
      setLoading(true);
      const res = await basketDetailsId(_id as string);
      let data = res.data as any;
      if (Array.isArray(data)) {
        data = data[0];
      }
      setBasket(data);
    } catch (error) {
      toast.error('Failed to fetch basket details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <MainLayout title="Basket Details">
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-muted-foreground font-medium">Loading basket...</p>
        </div>
      </MainLayout>
    );
  }

  if (!basket) return <MainLayout title="Basket Details"><p className="text-muted-foreground p-4">Not found</p></MainLayout>;

  const handleToggle = async (productId: string) => {
    if (!basket) return;

    // Optimistic UI update
    setBasket((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        items: prev.items.map(item =>
          item.productId === productId
            ? { ...item, isCompleted: item.isCompleted === 1 ? 0 : 1 }
            : item
        )
      };
    });

    try {
      await toggleProductCompletion(basket._id, productId);

      const item = basket.items.find((i) => i.productId === productId);
      if (item && item.isCompleted === 0) { // meaning it was 0 previously, now 1
        emitSocketEvent(socketEvents.PRODUCT_COMPLETED, { basketId: basket._id, productId });
        toast.success(`${item.product?.name || 'Item'} completed ✅`);
      }
    } catch (error) {
      toast.error('Failed to update item, reverting');
      fetchBasketDetails(); // Revert on failure
    }
  };

  const completePurchase = () => {
    toast.success('Purchase completed! 🎉');
    navigate('/baskets');
  };

  // Group items
  const groupedItems = (basket.items || []).reduce((acc: any, item: BasketItem) => {
    const userId = item.assignedUser?._id || "unassigned";

    if (!acc[userId]) {
      acc[userId] = {
        userName: item.assignedUser?.name || "Unassigned",
        items: []
      };
    }

    acc[userId].items.push(item);
    return acc;
  }, {});

  const allCompleted = (basket.items || []).length > 0 && (basket.items || []).every((i) => i.isCompleted === 1);

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

        {/* Grouped Items */}
        <div className="space-y-6">
          {Object.values(groupedItems).map((group: any) => (
            <div key={group.userName}>
              <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-secondary text-foreground flex items-center justify-center text-sm">
                  👤
                </span>
                {group.userName} ({group.items.filter((i: any) => i.isCompleted === 1).length}/{group.items.length})
              </h3>

              <div className="space-y-2">
                {group.items.map((item: BasketItem) => (
                  <div key={item.productId} className={`grocery-card flex items-center gap-3 ${item.isCompleted === 1 ? 'opacity-60' : ''}`}>
                    <Checkbox
                      checked={item.isCompleted === 1}
                      onCheckedChange={() => handleToggle(item.productId)}
                    />
                    <div className="flex-1">
                      <p className={`font-semibold text-foreground ${item.isCompleted === 1 ? 'line-through' : ''}`}>
                        {item.product?.name || 'Unknown item'}
                      </p>
                      <p className="text-xs text-muted-foreground">{item.quantity} {item.unit}</p>
                    </div>
                    {item.isCompleted === 1 && <Check className="w-4 h-4 text-primary" />}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {(basket.items || []).length === 0 && <p className="text-sm text-muted-foreground p-4 text-center">No items in this basket</p>}
        </div>

        {allCompleted && (basket.items || []).length > 0 && (
          <Button onClick={completePurchase} className="w-full">
            Complete Purchase 🎉
          </Button>
        )}
      </div>
    </MainLayout>
  );
};

export default BasketDetails;
