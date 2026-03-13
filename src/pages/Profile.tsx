import { useState, useEffect } from 'react';
import MainLayout from '@/layouts/MainLayout';
import { useAppStore } from '@/stores/appStore';
import { getAllUsers, selectPartner as selectPartnerApi } from '@/api/partnerApi';
import { Partner } from '@/api/partnerApi';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { LogOut, UserPlus, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Profile = () => {
  const { user, partner, setPartner, logout } = useAppStore();
  const navigate = useNavigate();
  const [users, setUsers] = useState<Partner[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    getAllUsers().then((res) => setUsers(res.data));
  }, []);

  const handleSelectPartner = async (p: Partner) => {
    await selectPartnerApi(p._id);
    setPartner(p);
    toast.success(`${p.name} is now your partner! 🤝`);
    setOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Logged out');
  };

  return (
    <MainLayout title="Profile">
      <div className="space-y-4 animate-fade-in">
        {/* User Card */}
        <div className="grocery-card text-center">
          <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-3">
            <span className="text-4xl">👤</span>
          </div>
          <h2 className="text-xl font-bold text-foreground">{user?.name || 'User'}</h2>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>

        {/* Partner */}
        <div className="grocery-card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-foreground flex items-center gap-2">
              <Users className="w-4 h-4" /> Partner
            </h3>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="sm"><UserPlus className="w-4 h-4 mr-1" /> {partner ? 'Change' : 'Add'}</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Select a Partner</DialogTitle>
                </DialogHeader>
                <div className="space-y-2 mt-4">
                  {users.map((u) => (
                    <button key={u._id} onClick={() => handleSelectPartner(u)}
                      className="w-full grocery-card-hover flex items-center gap-3 text-left">
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                        <span className="text-xl">👤</span>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{u.name}</p>
                        <p className="text-xs text-muted-foreground">{u.email}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>
          {partner ? (
            <div className="flex items-center gap-3 bg-secondary rounded-xl p-3">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center"><span className="text-xl">👥</span></div>
              <div>
                <p className="font-semibold text-foreground">{partner.name}</p>
                <p className="text-xs text-muted-foreground">{partner.email}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No partner added yet</p>
          )}
        </div>

        {/* Logout */}
        <Button variant="outline" onClick={handleLogout} className="w-full text-destructive hover:text-destructive">
          <LogOut className="w-4 h-4 mr-2" /> Logout
        </Button>
      </div>
    </MainLayout>
  );
};

export default Profile;
