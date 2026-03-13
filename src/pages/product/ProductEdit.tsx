import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import { useAppStore } from '@/stores/appStore';
import { getCategories } from '@/api/categoryApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { updateProductDetails } from '@/api/productApi';

const ProductEdit = () => {
  const { _id } = useParams<{ _id: string }>();
  const { products, categories, setCategories, updateProduct } = useAppStore();
  const navigate = useNavigate();
  const product = products.find((p) => p._id === _id);

  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [unit, setUnit] = useState('pcs');
  const [price, setPrice] = useState('');

  useEffect(() => {
    getCategories().then((res) => setCategories(res.data));
  }, []);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setCategoryId(product.categoryId);
      setDescription(product.description);
      setQuantity(String(product.qty));
      setUnit(product.unit);
      setPrice(product.price ? String(product.price) : '');
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!_id || !name || !categoryId) { toast.error('Name and category required'); return; }
    updateProduct(_id, { name, categoryId, description, qty: Number(quantity), unit, price: price ? Number(price) : undefined });
    await updateProductDetails(_id, { name, categoryId, description, qty: Number(quantity), unit, price: price ? Number(price) : undefined });
    toast.success('Product updated!');
    navigate('/products');
  };

  if (!product) return <MainLayout title="Edit Product"><p className="text-muted-foreground">Product not found</p></MainLayout>;

  return (
    <MainLayout title="Edit Product">
      <div className="animate-fade-in">
        <button onClick={() => navigate('/products')} className="flex items-center gap-1 text-sm text-muted-foreground mb-4 hover:text-foreground">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <form onSubmit={handleSubmit} className="grocery-card space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c._id} value={c._id}>{c.icon} {c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Default Qty</Label>
              <Input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Unit</Label>
              <Select value={unit} onValueChange={setUnit}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['pcs', 'kg', 'ltr', 'bunch', 'loaf', 'pack', 'dozen'].map((u) => (
                    <SelectItem key={u} value={u}>{u}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Price (optional)</Label>
            <Input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} />
          </div>
          <Button type="submit" className="w-full">Save Changes</Button>
        </form>
      </div>
    </MainLayout>
  );
};

export default ProductEdit;
