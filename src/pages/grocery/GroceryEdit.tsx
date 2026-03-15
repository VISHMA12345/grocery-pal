import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import { useAppStore } from '@/stores/appStore';
import { getProducts } from '@/api/productApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { ProductDetail, updateGroceryList as updateGroceryListApi } from '@/api/groceryApi';
import { getCategories, Category } from '@/api/categoryApi';
import { partnerDetail } from '@/api/partnerApi';

const GroceryEdit = () => {
  const { _id } = useParams<{ _id: string }>();
  const { groceryLists, products, setProducts, updateGroceryList, user } = useAppStore();
  const navigate = useNavigate();
  const gl = groceryLists.find((g) => g._id === _id);

  const [name, setName] = useState('');
  const [storeName, setStoreName] = useState('');
  const [items, setItems] = useState<ProductDetail[]>([]);
  const [selProduct, setSelProduct] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [selCategory, setSelCategory] = useState<string>('all');
  const [partners, setPartners] = useState<any[]>([]);

  useEffect(() => {
    getCategories().then((res) => setCategories(res.data));
    partnerDetail().then((res) => {
      const data = res.data || [];
      const myId = user?._id;
      const acceptedArray = data
        .filter((item: any) => item.status === 'accepted')
        .map((item: any) => {
          const other = item.users?.find((u: any) => u._id !== myId);
          return {
            _id: other?._id,
            name: other?.name,
            email: other?.email,
          };
        });
      setPartners(acceptedArray);
    });
  }, [user]);

  useEffect(() => {
    const fetchProps = selCategory !== 'all' && selCategory !== '' ? { categoryId: selCategory } : undefined;
    getProducts(fetchProps).then((res) => setProducts(res.data));
  }, [selCategory]);

  useEffect(() => {
    if (gl) { setName(gl.listName); setStoreName(gl.storeName); setItems(gl.items || []); }
  }, [gl]);

  const addItem = () => {
    const prod = products.find((p) => p._id === selProduct);
    if (!prod) return;
    if (items.find((i) => i.productId === prod._id)) { toast.error('Already added'); return; }
    setItems([...items, { productId: prod._id, name: prod.name, description: prod.description, images: [], quantity: prod.qty, unit: prod.unit, isCompleted: 0, assignedTo: '' }]);
    setSelProduct('');
  };

  const removeItem = (pid: string) => setItems(items.filter((i) => i.productId !== pid));
  const updateItem = (pid: string, field: keyof ProductDetail, value: any) => {
    setItems(items.map((i) => (i.productId === pid ? { ...i, [field]: value } : i)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!_id || !name) { toast.error('Name required'); return; }
    updateGroceryList(_id, { listName: name, storeName: storeName, items: items, itemCount: items.length });
    try {
      await updateGroceryListApi(_id, { listName: name, storeName: storeName, items: items, itemCount: items.length });
    } catch (err) {
      console.error(err);
    }
    toast.success('Grocery list updated!');
    navigate('/grocery-lists');
  };

  if (!gl) return <MainLayout title="Edit"><p className="text-muted-foreground">Not found</p></MainLayout>;

  return (
    <MainLayout title="Edit Grocery List">
      <div className="animate-fade-in">
        <button onClick={() => navigate('/grocery-lists')} className="flex items-center gap-1 text-sm text-muted-foreground mb-4 hover:text-foreground">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grocery-card space-y-4">
            <div className="space-y-2"><Label>List Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
            <div className="space-y-2"><Label>Store Name</Label><Input value={storeName} onChange={(e) => setStoreName(e.target.value)} /></div>
          </div>
          <div className="grocery-card space-y-4">
            <Label className="font-bold">Products</Label>

            <div className="flex gap-2">
              <Select value={selCategory} onValueChange={setSelCategory}>
                <SelectTrigger className="flex-1"><SelectValue placeholder="Select Category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Select value={selProduct} onValueChange={setSelProduct}>
                <SelectTrigger className="flex-1"><SelectValue placeholder="Select product" /></SelectTrigger>
                <SelectContent>{products.map((p) => <SelectItem key={p._id} value={p._id}>{p.name}</SelectItem>)}</SelectContent>
              </Select>
              <Button type="button" size="icon" onClick={addItem}><Plus className="w-4 h-4" /></Button>
            </div>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.productId} className="bg-secondary rounded-xl p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-foreground">{item.name}</span>
                    <button type="button" onClick={() => removeItem(item.productId)} className="text-destructive"><X className="w-4 h-4" /></button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <Input type="number" value={item.quantity} onChange={(e) => updateItem(item.productId, 'quantity', Number(e.target.value))} className="text-sm" placeholder="Qty" />
                    <Select value={item.unit} onValueChange={(v) => updateItem(item.productId, 'unit', v)}>
                      <SelectTrigger className="text-sm border-none bg-background/50"><SelectValue /></SelectTrigger>
                      <SelectContent>{['pcs', 'kg', 'ltr', 'bunch', 'loaf', 'pack'].map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
                    </Select>
                    <Select value={item.assignedTo || 'none'} onValueChange={(v) => updateItem(item.productId, 'assignedTo', v === 'none' ? undefined : v)}>
                      <SelectTrigger className="text-sm border-none bg-background/50"><SelectValue placeholder="Assign To" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Unassigned</SelectItem>
                        {partners.map(p => <SelectItem key={p._id} value={p._id}>{p.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Button type="submit" className="w-full">Save Changes</Button>
        </form>
      </div>
    </MainLayout>
  );
};

export default GroceryEdit;
