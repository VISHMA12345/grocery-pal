import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import { useAppStore } from '@/stores/appStore';
import { getProducts, deleteProduct as deleteProductApi } from '@/api/productApi';
import { getCategories } from '@/api/categoryApi';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const ProductList = () => {
  const { products, setProducts, removeProduct, categories, setCategories } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    getProducts().then((res) => setProducts(res.data));
    getCategories().then((res) => setCategories(res.data));
  }, []);

  const getCategoryName = (catId: string) => categories.find((c) => c.id === catId)?.name || 'Unknown';
  const getCategoryIcon = (catId: string) => categories.find((c) => c.id === catId)?.icon || '📦';

  const handleDelete = async (id: string) => {
    await deleteProductApi(id);
    removeProduct(id);
    toast.success('Product deleted');
  };

  return (
    <MainLayout title="Products">
      <div className="space-y-4 animate-fade-in">
        <Button onClick={() => navigate('/products/create')} className="w-full">
          <Plus className="w-4 h-4 mr-2" /> Add Product
        </Button>

        <div className="space-y-3">
          {products.map((prod) => (
            <div key={prod.id} className="grocery-card flex items-center gap-3">
              <span className="text-2xl">{getCategoryIcon(prod.category_id)}</span>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-foreground">{prod.name}</p>
                <p className="text-xs text-muted-foreground">{getCategoryName(prod.category_id)} • {prod.default_quantity} {prod.default_unit}</p>
                {prod.price && <p className="text-sm font-semibold text-primary">${prod.price.toFixed(2)}</p>}
              </div>
              <div className="flex gap-1.5">
                <button onClick={() => navigate(`/products/edit/${prod.id}`)} className="p-2 rounded-xl bg-secondary text-secondary-foreground hover:bg-accent transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(prod.id)} className="p-2 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {products.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <span className="text-4xl block mb-2">📦</span>
              No products yet
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default ProductList;
