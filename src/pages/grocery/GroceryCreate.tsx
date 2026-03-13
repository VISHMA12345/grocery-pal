import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import { useAppStore } from '@/stores/appStore';
import { getProducts } from '@/api/productApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { createGroceryList, ProductDetail } from '@/api/groceryApi';

const GroceryCreate = () => {
  const { products, setProducts, addGroceryList } = useAppStore();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [storeName, setStoreName] = useState('');
  const [items, setItems] = useState<ProductDetail[]>([]);
  const [selProduct, setSelProduct] = useState('');

  useEffect(() => {
    getProducts().then((res) => setProducts(res.data));
  }, []);

  const addItem = () => {
    const prod = products.find((p) => p._id === selProduct);
    if (!prod) { toast.error('Select a product'); return; }
    if (items.find((i) => i._id === prod._id)) { toast.error('Already added'); return; }
    setItems([...items, { _id: prod._id, name: prod.name, description: prod.description, images: [], qty: prod.qty, unit: prod.unit }]);
    setSelProduct('');
  };

  const removeItem = (pid: string) => setItems(items.filter((i) => i._id !== pid));

  const updateItem = (pid: string, field: keyof ProductDetail, value: any) => {
    setItems(items.map((i) => (i._id === pid ? { ...i, [field]: value } : i)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) { toast.error('Name is required'); return; }
    const newList = { 
      _id: Date.now().toString(), 
      listName: name, 
      storeName: storeName, 
      createdAt: new Date().toISOString(),
      itemCount: items.length,
      productDetails: items, 
      converted_to_basket: false 
    };
    addGroceryList(newList);
    await createGroceryList({ listName: name, storeName: storeName, createdAt: newList.createdAt, itemCount: newList.itemCount, productDetails: items });
    toast.success('Grocery list created! 🎉');
    navigate('/grocery-lists');
  };

  return (
    <MainLayout title="Create Grocery List">
      <div className="animate-fade-in">
        <button onClick={() => navigate('/grocery-lists')} className="flex items-center gap-1 text-sm text-muted-foreground mb-4 hover:text-foreground">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grocery-card space-y-4">
            <div className="space-y-2">
              <Label>List Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Weekly Shopping" />
            </div>
            <div className="space-y-2">
              <Label>Store Name</Label>
              <Input value={storeName} onChange={(e) => setStoreName(e.target.value)} placeholder="e.g. FreshMart" />
            </div>
          </div>

          <div className="grocery-card space-y-4">
            <Label className="font-bold">Products</Label>
            <div className="flex gap-2">
              <Select value={selProduct} onValueChange={setSelProduct}>
                <SelectTrigger className="flex-1"><SelectValue placeholder="Select product" /></SelectTrigger>
                <SelectContent>
                  {products.map((p) => (
                    <SelectItem key={p._id} value={p._id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="button" size="icon" onClick={addItem}><Plus className="w-4 h-4" /></Button>
            </div>

            <div className="space-y-3">
              {items.map((item) => (
                <div key={item._id} className="bg-secondary rounded-xl p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-foreground">{item.name}</span>
                    <button type="button" onClick={() => removeItem(item._id)} className="text-destructive"><X className="w-4 h-4" /></button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Input type="number" value={item.qty} onChange={(e) => updateItem(item._id, 'qty', Number(e.target.value))} className="text-sm" />
                    <Select value={item.unit} onValueChange={(v) => updateItem(item._id, 'unit', v)}>
                      <SelectTrigger className="text-sm border-none bg-background/50"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {['pcs', 'kg', 'ltr', 'bunch', 'loaf', 'pack'].map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full">Create Grocery List</Button>
        </form>
      </div>
    </MainLayout>
  );
};

export default GroceryCreate;
