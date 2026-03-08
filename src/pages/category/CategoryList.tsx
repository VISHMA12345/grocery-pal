import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import { useAppStore } from '@/stores/appStore';
import { getCategories, deleteCategory as deleteCategoryApi } from '@/api/categoryApi';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const CategoryList = () => {
  const { categories, setCategories, removeCategory } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    getCategories().then((res) => setCategories(res.data));
  }, []);

  const handleDelete = async (id: string) => {
    await deleteCategoryApi(id);
    removeCategory(id);
    toast.success('Category deleted');
  };

  return (
    <MainLayout title="Categories">
      <div className="space-y-4 animate-fade-in">
        <Button onClick={() => navigate('/categories/create')} className="w-full">
          <Plus className="w-4 h-4 mr-2" /> Add Category
        </Button>

        <div className="space-y-3">
          {categories.map((cat) => (
            <div key={cat.id} className="grocery-card flex items-center gap-3">
              <span className="text-3xl">{cat.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-foreground">{cat.name}</p>
                <p className="text-sm text-muted-foreground truncate">{cat.description}</p>
              </div>
              <div className="flex gap-1.5">
                <button onClick={() => navigate(`/categories/edit/${cat.id}`)} className="p-2 rounded-xl bg-secondary text-secondary-foreground hover:bg-accent transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(cat.id)} className="p-2 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {categories.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <span className="text-4xl block mb-2">📂</span>
              No categories yet
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default CategoryList;
