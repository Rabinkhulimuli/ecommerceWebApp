'use client';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export type UserType = {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN' | 'SUPERADMIN';
};

export default function UsersManagementPage() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [newRole, setNewRole] = useState<UserType['role']>('USER');
  const router = useRouter();
  const { data: session } = useSession();
  const userRole = session?.user;
  useEffect(() => {
    if (!userRole || userRole.role !== 'SUPERADMIN') {
      router.push('/');
    }
  }, [userRole]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      setUsers(data.data);
    } catch (err) {
      toast({ title: 'Failed to fetch users', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users
    ? users.filter(
        u =>
          u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleUpdateRole = async () => {
    if (!selectedUser) return;

    try {
      const res = await fetch(`/api/admin/users/${selectedUser.id}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });

      if (res.ok) {
        toast({ title: 'User role updated successfully' });
        fetchUsers();
        setSelectedUser(null);
      } else {
        toast({ title: 'Failed to update role', variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Failed to update role', variant: 'destructive' });
    }
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='mb-6 text-center text-3xl font-bold'>Users Management</h1>

      {/* Search */}
      <div className='mb-6 flex items-center gap-4'>
        <Input
          placeholder='Search by name or email'
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        <Button onClick={() => fetchUsers()}>Refresh</Button>
      </div>

      {/* Users list */}
      <div className='grid gap-4'>
        {loading ? (
          <p>Loading users...</p>
        ) : filteredUsers && filteredUsers.length > 0 ? (
          filteredUsers.map(user => (
            <Card key={user.id} className='flex items-center justify-between p-4'>
              <CardContent className='flex w-full flex-col md:flex-row md:items-center md:justify-between'>
                <div>
                  <p className='font-semibold'>{user.name}</p>
                  <p className='text-sm text-gray-500'>{user.email}</p>
                </div>

                {userRole?.role == 'SUPERADMIN' && userRole.id !== user.id ? (
                  <div className='mt-2 flex items-center gap-2 md:mt-0'>
                    <Select
                      value={selectedUser?.id === user.id ? newRole : user.role}
                      onValueChange={value => {
                        setSelectedUser(user);
                        setNewRole(value as UserType['role']);
                      }}
                    >
                      <SelectTrigger className='w-36'>
                        <SelectValue placeholder='Select role' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='USER'>USER</SelectItem>
                        <SelectItem value='ADMIN'>ADMIN</SelectItem>
                      </SelectContent>
                    </Select>
                    {selectedUser?.id === user.id && (
                      <Button onClick={handleUpdateRole}>Update</Button>
                    )}
                  </div>
                ) : (
                  <div>super</div>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <p>No users found.</p>
        )}
      </div>
    </div>
  );
}
