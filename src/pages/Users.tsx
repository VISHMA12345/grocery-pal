import { useState, useEffect } from 'react';
import MainLayout from '@/layouts/MainLayout';
import { getAllUsers, sendRequest, Partner } from '@/api/partnerApi';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { UserPlus, UserCheck } from 'lucide-react';

const Users = () => {
  const [users, setUsers] = useState<Partner[]>([]);
  const [sentRequests, setSentRequests] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getAllUsers();
        setUsers(res.data);
      } catch (error) {
        toast.error('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleSendRequest = async (userId: string) => {
    try {
      await sendRequest({ partnerId: userId });
      setSentRequests((prev) => [...prev, userId]);
      toast.success('Partner request sent!');
    } catch (error) {
      toast.error('Failed to send request');
    }
  };

  return (
    <MainLayout title="Find Partners">
      <div className="space-y-4 animate-fade-in">
        {loading ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground">Loading users...</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {users.map((user) => (
              <div key={user._id} className="grocery-card flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                    <span className="text-2xl">👤</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>

                {sentRequests.includes(user._id) ? (
                  <Button disabled variant="outline" size="sm" className="gap-2">
                    <UserCheck className="w-4 h-4" /> Request Sent
                  </Button>
                ) : (
                  <Button
                    variant="default"
                    size="sm"
                    className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={() => handleSendRequest(user._id)}
                  >
                    <UserPlus className="w-4 h-4" /> Send Request
                  </Button>
                )}
              </div>
            ))}
            {users.length === 0 && (
              <div className="text-center py-10 grocery-card">
                <p className="text-muted-foreground">No other users found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Users;
