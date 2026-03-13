import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import { useAppStore } from '@/stores/appStore';
import { getBaskets } from '@/api/basketApi';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Eye, Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

const BasketPage = () => {
  const { baskets, setBaskets, updateBasketStatus } = useAppStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('started');

  useEffect(() => {
    setLoading(true);
    // Fetch based on tab: 'started' tab asks for unconverted (false), others for converted (true)
    const flag = activeTab === 'started' ? 'false' : 'true';
    getBaskets(flag).then((res) => {
      setBaskets(res.data);
      setLoading(false);
    }).catch(() => {
      toast.error('Failed to fetch baskets');
      setLoading(false);
    });
  }, [activeTab]);
  const started = baskets
  const completed = baskets
  const cancelled = baskets

  const cancelBasket = (_id: string) => {
    updateBasketStatus(_id, 'cancelled');
    toast.success('Basket cancelled');
  };

  const renderBasket = (basket: typeof baskets[0], showActions = false) => (
    <div key={basket._id} className="grocery-card space-y-3">
      <div>
        <p className="font-bold text-foreground">{basket.listName}</p>
        <p className="text-xs text-muted-foreground">🏪 {basket.storeName} • {basket.itemCount} items</p>
        <span className={`inline-block mt-1 text-xs font-semibold px-2 py-0.5 rounded-full ${basket.status === 'started' ? 'bg-primary/15 text-primary' :
          basket.status === 'completed' ? 'bg-secondary text-secondary-foreground' :
            'bg-destructive/10 text-destructive'
          }`}>
          {basket.status}
        </span>
      </div>
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={() => navigate(`/baskets/${basket._id}`)}>
          <Eye className="w-3.5 h-3.5 mr-1" /> View
        </Button>
        {showActions && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" variant="outline" className="text-destructive hover:text-destructive">Cancel</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Cancel Purchase?</AlertDialogTitle>
                <AlertDialogDescription>Are you sure you want to cancel this purchase? This action cannot be undone.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>No, keep it</AlertDialogCancel>
                <AlertDialogAction onClick={() => cancelBasket(basket._id)}>Yes, cancel</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  );

  return (
    <MainLayout title="Baskets">
      <div className="animate-fade-in space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-muted-foreground font-medium">Fetching baskets...</p>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="started" className="w-full">
            <TabsList className="w-full bg-secondary/50 p-1 rounded-xl">
              <TabsTrigger value="started" className="flex-1 rounded-lg py-2 transition-all">Start ({started.length})</TabsTrigger>
              <TabsTrigger value="completed" className="flex-1 rounded-lg py-2 transition-all">Done ({completed.length})</TabsTrigger>
              <TabsTrigger value="cancelled" className="flex-1 rounded-lg py-2 transition-all">Cancelled ({cancelled.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="started" className="space-y-4 mt-6">
              {started.length === 0 ? (
                <div className="text-center py-16 bg-card/40 rounded-3xl border-2 border-dashed border-border/50">
                  <span className="text-4xl block mb-2">🛒</span>
                  <p className="text-muted-foreground">No active baskets right now</p>
                </div>
              ) : started.map((b) => renderBasket(b, true))}
            </TabsContent>
            <TabsContent value="completed" className="space-y-4 mt-6">
              {completed.length === 0 ? (
                <div className="text-center py-16 bg-card/40 rounded-3xl border-2 border-dashed border-border/50">
                  <span className="text-4xl block mb-2">✅</span>
                  <p className="text-muted-foreground">No completed purchases yet</p>
                </div>
              ) : completed.map((b) => renderBasket(b))}
            </TabsContent>
            <TabsContent value="cancelled" className="space-y-4 mt-6">
              {cancelled.length === 0 ? (
                <div className="text-center py-16 bg-card/40 rounded-3xl border-2 border-dashed border-border/50">
                  <span className="text-4xl block mb-2">❌</span>
                  <p className="text-muted-foreground">No cancelled baskets</p>
                </div>
              ) : cancelled.map((b) => renderBasket(b))}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </MainLayout>
  );
};

export default BasketPage;
