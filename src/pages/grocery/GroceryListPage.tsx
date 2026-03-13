import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import { useAppStore } from '@/stores/appStore';
import { getGroceryLists, deleteGroceryList as deleteGroceryApi, GroceryList, ProductDetail, convertToBasketWithId } from '@/api/groceryApi';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, Eye, ShoppingBasket, Calendar, MapPin, ListChecks } from 'lucide-react';
import { toast } from 'sonner';
import { createBasket, Basket } from '@/api/basketApi';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

const GroceryListPage = () => {
  const { groceryLists, setGroceryLists, removeGroceryList, addBasket } = useAppStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getGroceryLists().then((data) => {
      setGroceryLists(data);
      setLoading(false);
    });
  }, []);

  const handleDelete = async (_id: string) => {
    try {
      await deleteGroceryApi(_id);
      removeGroceryList(_id);
      toast.success('Grocery list deleted');
    } catch (error) {
      toast.error('Failed to delete grocery list');
    }
  };

  const convertToBasket = async (gl: GroceryList) => {
    try {
      const basket: Basket = {
        _id: Date.now().toString(),
        listName: gl.listName,
        storeName: gl.storeName,
        status: 'started' as const,
        productDetails: gl.productDetails || [],
        itemCount: gl.itemCount || 0,
        createdAt: gl.createdAt,
      };
      addBasket(basket);
      await convertToBasketWithId(gl._id);
      toast.success('Converted to basket! 🧺');
      navigate('/baskets');
    } catch (error) {
      toast.error('Failed to convert to basket');
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'No date';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  return (
    <MainLayout title="Grocery Lists">
      <div className="space-y-6 animate-fade-in pb-10">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-2xl font-bold text-foreground">My Lists</h2>
          <Button onClick={() => navigate('/grocery-lists/create')} size="sm" className="rounded-full shadow-md">
            <Plus className="w-4 h-4 mr-1.5" /> Create New
          </Button>
        </div>

        <div className="grid gap-6 px-2">
          {groceryLists.map((gl) => (
            <Card key={gl._id} className="overflow-hidden border-none shadow-xl bg-card/50 backdrop-blur-sm group hover:shadow-2xl transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-2xl font-black text-foreground group-hover:text-primary transition-colors">
                      {gl.listName}
                    </CardTitle>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground pt-1">
                      <div className="flex items-center gap-1.5 bg-secondary/50 px-2 py-0.5 rounded-md">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span className="font-semibold">{gl.storeName}</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-secondary/50 px-2 py-0.5 rounded-md">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span>{formatDate(gl.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-secondary/50 px-2 py-0.5 rounded-md">
                        <ListChecks className="w-4 h-4 text-primary" />
                        <span>{gl.itemCount} items</span>
                      </div>
                    </div>
                  </div>
                  {gl.converted_to_basket && (
                    <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200 animate-pulse">
                      🧺 IN BASKET
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="rounded-xl border border-border/50 bg-background/30 p-1">
                  {gl.productDetails?.map((product, idx) => (
                    <div key={product._id}>
                      {idx > 0 && <Separator className="opacity-40" />}
                      <div className="grid grid-cols-[60px_1fr_auto] items-center gap-4 p-3 hover:bg-secondary/20 transition-colors">
                        <Avatar className="h-12 w-12 rounded-lg border border-border/50 shadow-sm">
                          <AvatarImage
                            src={product.images?.[0]?.path}
                            alt={product.name}
                            className="object-cover"
                          />
                          <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold uppercase">
                            {product.name?.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="min-w-0">
                          <p className="font-bold text-foreground text-sm truncate">{product.name}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1">{product.description}</p>
                        </div>

                        <div className="text-right">
                          <p className="font-black text-primary text-sm">
                            ₹{product.price}
                          </p>
                          {product.price && (
                            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">
                              {product.qty} {product.unit} @ ₹{product.price}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {(gl.productDetails?.length || 0) === 0 && (
                    <p className="text-center py-6 text-sm text-muted-foreground italic">Your list is currently empty</p>
                  )}
                </div>
              </CardContent>

              <CardFooter className="bg-secondary/20 px-6 py-4 flex flex-wrap gap-2 justify-between items-center">
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" className="h-9 px-4 font-bold" onClick={() => navigate(`/grocery-lists/${gl._id}`)}>
                    <Eye className="w-4 h-4 mr-2" /> Details
                  </Button>
                  <Button size="sm" variant="outline" className="h-9 px-4 font-bold" onClick={() => navigate(`/grocery-lists/edit/${gl._id}`)}>
                    <Pencil className="w-4 h-4 mr-2" /> Edit
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={gl.converted_to_basket ? "ghost" : "default"}
                    className={`h-9 px-6 font-bold transition-all ${gl.converted_to_basket ? 'opacity-50 cursor-not-allowed' : 'shadow-lg hover:shadow-primary/25'}`}
                    onClick={() => !gl.converted_to_basket && convertToBasket(gl)}
                    disabled={gl.converted_to_basket}
                  >
                    <ShoppingBasket className="w-4 h-4 mr-2" /> Go to Store
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDelete(gl._id)}
                    className="h-9 w-9 text-destructive hover:bg-destructive hover:text-white"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
          {!loading && groceryLists.length === 0 && (
            <div className="text-center py-24 bg-card rounded-3xl border-2 border-dashed border-border/50">
              <span className="text-6xl block mb-6 animate-bounce">🛒</span>
              <h3 className="text-xl font-bold text-foreground">Ready to go shopping?</h3>
              <p className="text-muted-foreground max-w-[250px] mx-auto mt-2">
                Create your first grocery list and we'll help you stay organized.
              </p>
              <Button onClick={() => navigate('/grocery-lists/create')} className="mt-8 px-10 rounded-full h-12 text-lg">
                <Plus className="w-5 h-5 mr-2" /> Start Now
              </Button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default GroceryListPage;
