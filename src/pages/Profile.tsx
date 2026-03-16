import { useState, useEffect } from 'react';
import MainLayout from '@/layouts/MainLayout';
import { useAppStore } from '@/stores/appStore';
import { getAllUsers, selectPartner as selectPartnerApi, partnerDetail, acceptPartner, Partner } from '@/api/partnerApi';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { LogOut, UserPlus, Users, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Profile = () => {
  const { user, partner, setPartner, logout } = useAppStore();
  const navigate = useNavigate();

  const [users, setUsers] = useState<Partner[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<any[]>([]);
  const [acceptedRequests, setAcceptedRequests] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    getAllUsers().then((res) => setUsers(res.data));
    fetchPartnerDetails();
  }, []);

  const fetchPartnerDetails = async () => {
    try {
      const res = await partnerDetail();
      const data = res.data || [];
      const myId = user?._id;

      // Requests sent TO me (partnerId = myId, status = pending)
      const incoming = data
        .filter((item: any) => item.status === 'pending')
        .map((item: any) => {
          const other = item.users.find((u: any) => u._id !== myId);
          return {
            _id: item._id,
            name: other?.name,
            email: other?.email,
            userId: item.userId,
          };
        });

      setIncomingRequests(incoming);

      // Accepted requests
      const acceptedArray = data
        .filter((item: any) => item.status === 'accepted')
        .map((item: any) => {
          const other = item.users?.find((u: any) => u._id !== myId);
          return {
            _id: item._id,
            name: other?.name,
            email: other?.email,
            userId: item.userId,
          };
        });

      setAcceptedRequests(acceptedArray);

      // Accepted partner (either userId or partnerId = myId, status = accepted)
      const accepted: any = data.find(
        (item: any) =>
          item.status === 'accepted' &&
          (item.userId === myId || item.partnerId === myId)
      );

      if (accepted) {
        const other = accepted.users.find((u: any) => u._id !== myId);
        if (other) setPartner({ ...other, _id: accepted._id });
      } else {
        setPartner(null);
      }

    } catch (error) {
      console.error('Failed to load partner data', error);
    }
  };

  const handleAcceptRequest = async (req: any) => {
    try {
      await acceptPartner(req._id, 'accepted');
      toast.success(`Partner request accepted from ${req.name}`);
      setIncomingRequests((prev) => prev.filter((r) => r._id !== req._id));
      fetchPartnerDetails();
    } catch (err) {
      toast.error('Failed to accept request');
    }
  };

  const handleSelectPartner = async (p: Partner) => {
    if (p._id === user?._id) {
      toast.error("You cannot select yourself");
      return;
    }

    try {
      await selectPartnerApi(p._id);
      toast.success(`Partner request sent to ${p.name}`);
      setOpen(false);
      fetchPartnerDetails();
    } catch (err) {
      toast.error("Failed to send request");
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Logged out');
  };

  return (
    <MainLayout title="Profile">
      <div className="space-y-4 animate-fade-in">

        {/* USER CARD */}
        <div className="grocery-card text-center">
          <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-3">
            <span className="text-4xl">👤</span>
          </div>
          <h2 className="text-xl font-bold text-foreground">{user?.name}</h2>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>

        {/* PARTNER SECTION */}
        <div className="grocery-card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-foreground flex items-center gap-2">
              <Users className="w-4 h-4" /> Partner
            </h3>

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <UserPlus className="w-4 h-4 mr-1" />
                  {partner ? 'Change' : 'Add'}
                </Button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Select a Partner</DialogTitle>
                </DialogHeader>

                <div className="space-y-2 mt-4">
                  {users
                    .filter((u) => u._id !== user?._id)
                    .map((u) => (
                      <button
                        key={u._id}
                        onClick={() => handleSelectPartner(u)}
                        className="w-full grocery-card-hover flex items-center gap-3 text-left"
                      >
                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                          <span className="text-xl">👤</span>
                        </div>
                        <div>
                          <p className="font-semibold">{u.name}</p>
                          <p className="text-xs text-muted-foreground">{u.email}</p>
                        </div>
                      </button>
                    ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {acceptedRequests.map((req: any) => (
            <div className="flex items-center gap-3 bg-secondary rounded-xl p-3 my-2">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                <span className="text-xl">👥</span>
              </div>
              <div>
                <p className="font-semibold">{req?.name}</p>
                <p className="text-xs text-muted-foreground">{req?.email}</p>
              </div>
            </div>
          ))}
        </div>

        {/* INCOMING REQUESTS */}
        <div className="grocery-card">
          <h3 className="font-bold text-foreground flex items-center gap-2 mb-3">
            <Bell className="w-4 h-4" /> Partner Requests
            {incomingRequests.length > 0 && (
              <span className="ml-auto text-xs bg-primary text-primary-foreground rounded-full px-2 py-0.5">
                {incomingRequests.length}
              </span>
            )}
          </h3>

          <div className="space-y-3">
            {incomingRequests.length > 0 ? (
              incomingRequests.map((req) => (
                <div
                  key={req._id}
                  className="flex items-center justify-between bg-secondary/50 rounded-xl p-3 border border-border/50"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-sm">
                      👤
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{req.name}</p>
                      <p className="text-[10px] text-muted-foreground">{req.email}</p>
                    </div>
                  </div>
                  <Button size="sm" onClick={() => handleAcceptRequest(req)} className="h-8 px-3">
                    Accept
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-2">
                No pending requests
              </p>
            )}
          </div>
        </div>

        {/* LOGOUT */}
        <Button
          variant="outline"
          onClick={handleLogout}
          className="w-full text-destructive hover:text-destructive"
        >
          <LogOut className="w-4 h-4 mr-2" /> Logout
        </Button>

      </div>
    </MainLayout>
  );
};

export default Profile;