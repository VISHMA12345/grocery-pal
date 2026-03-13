import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import { useAppStore } from '@/stores/appStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { updateCategory } from '@/api/categoryApi';

const iconOptions = ['🍎', '🥦', '🥛', '🍞', '🍫', '🥩', '🍚', '🧂', '🥕', '🍌', '🧀', '🍗', '🥚', '🍿', '🧈', '🌽', '🍇', '🥜', '🫘', '🍯'];

const CategoryEdit = () => {
  const { _id } = useParams<{ _id: string }>();
  const categories = useAppStore((s) => s.categories);
  const updateCat = useAppStore((s) => s.updateCategory);
  const navigate = useNavigate();

  const category = categories.find((c) => c._id === _id);
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('🍎');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (category) {
      setName(category.name);
      setIcon(category.icon);
      setDescription(category.description);
    }
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!_id || !name) { toast.error('Name is required'); return; }
    updateCat(_id, { name, icon, description });
    await updateCategory(_id, { name, icon, description });
    toast.success('Category updated!');
    navigate('/categories');
  };

  if (!category) return <MainLayout title="Edit Category"><p className="text-muted-foreground">Category not found</p></MainLayout>;

  return (
    <MainLayout title="Edit Category">
      <div className="animate-fade-in">
        <button onClick={() => navigate('/categories')} className="flex items-center gap-1 text-sm text-muted-foreground mb-4 hover:text-foreground">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <form onSubmit={handleSubmit} className="grocery-card space-y-4">
          <div className="space-y-2">
            <Label>Icon</Label>
            <div className="flex flex-wrap gap-2">
              {iconOptions.map((ic) => (
                <button key={ic} type="button" onClick={() => setIcon(ic)}
                  className={`text-2xl p-2 rounded-xl transition-all ${icon === ic ? 'bg-primary/20 ring-2 ring-primary scale-110' : 'bg-secondary hover:bg-accent'}`}>
                  {ic}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="desc">Description</Label>
            <Textarea id="desc" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <Button type="submit" className="w-full">Save Changes</Button>
        </form>
      </div>
    </MainLayout>
  );
};

export default CategoryEdit;
