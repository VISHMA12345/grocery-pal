import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import { useAppStore } from '@/stores/appStore';
import { createCategory } from '@/api/categoryApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

const iconOptions = ['🍎', '🥦', '🥛', '🍞', '🍫', '🥩', '🍚', '🧂', '🥕', '🍌', '🧀', '🍗', '🥚', '🍿', '🧈', '🌽', '🍇', '🥜', '🫘', '🍯'];

const CategoryCreate = () => {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('🍎');
  const [description, setDescription] = useState('');
  const addCategory = useAppStore((s) => s.addCategory);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) { toast.error('Name is required'); return; }
    const res = await createCategory({ name, icon, description });
    addCategory(res.data);
    toast.success('Category created! 🎉');
    navigate('/categories');
  };

  return (
    <MainLayout title="Create Category">
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
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Fruits" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="desc">Description</Label>
            <Textarea id="desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description" />
          </div>
          <Button type="submit" className="w-full">Create Category</Button>
        </form>
      </div>
    </MainLayout>
  );
};

export default CategoryCreate;
