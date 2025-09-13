'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

type Address = {
  street?: string;
  city: string;
  country: string;
  postalCode: string;
};

type Shop = {
  id: string;
  name: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  address: Address;
};

export default function ShopPage() {
  const { data: session } = useSession();
  const userId = session?.user.id;
  const router = useRouter();

  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShop = async () => {
      if (!userId) return;

      try {
        const res = await fetch(`/api/admin/shop?userId=${userId}`);
        const data = await res.json();

        if (res.ok && data?.data) {
          setShop(data.data);
        } else {
          setShop(null);
        }
      } catch (err) {
        console.error('Failed to fetch shop', err);
        setShop(null);
      } finally {
        setLoading(false);
      }
    };

    fetchShop();
  }, [userId]);

  if (loading)
    return (
      <div className='mx-auto mt-10 max-w-3xl animate-pulse space-y-4 px-4'>
        <div className='h-10 w-3/5 rounded-lg bg-gray-200'></div>
        <div className='h-6 w-full rounded-lg bg-gray-200'></div>
        <div className='h-6 w-full rounded-lg bg-gray-200'></div>
        <div className='h-6 w-full rounded-lg bg-gray-200'></div>
        <div className='h-6 w-1/2 rounded-lg bg-gray-200'></div>
      </div>
    );

  if (!shop)
    return (
      <div className='flex h-screen flex-col items-center justify-center space-y-6 px-4 text-center'>
        <h2 className='text-2xl font-bold'>You don’t have a shop yet</h2>
        <p className='text-gray-600'>
          Start by creating your first shop to showcase your products.
        </p>
        <Button size='lg' onClick={() => router.push('/admin/shop/create-shop')}>
          Create New Shop
        </Button>
      </div>
    );
  const handleDeleteShop = async (userId: string) => {
    const res = fetch(`/api/admin/shop?userId=${userId}`, {
      method: 'DELETE',
    });
  };
  return (
    <div className='mx-auto mt-10 max-w-3xl px-4'>
      <Card className='overflow-hidden rounded-2xl shadow-lg'>
        <CardHeader className='flex w-full justify-between bg-primary/10'>
          <CardTitle className='text-2xl font-bold'>{shop.name}</CardTitle>
          <div>
            <Button onClick={() => handleDeleteShop(shop.ownerId)}>Delete shop</Button>
          </div>
        </CardHeader>
        <CardContent className='grid gap-4'>
          <div className='grid gap-4 sm:grid-cols-2'>
            <div>
              <Label className='text-sm text-gray-500'>Shop ID</Label>
              <p className='break-all text-gray-800'>{shop.id}</p>
            </div>
            <div>
              <Label className='text-sm text-gray-500'>Owner ID</Label>
              <p className='break-all text-gray-800'>{shop.ownerId}</p>
            </div>
          </div>

          <div className='grid gap-4 sm:grid-cols-2'>
            <div>
              <Label className='text-sm text-gray-500'>Created At</Label>
              <p className='text-gray-800'>{new Date(shop.createdAt).toLocaleString()}</p>
            </div>
            <div>
              <Label className='text-sm text-gray-500'>Updated At</Label>
              <p className='text-gray-800'>{new Date(shop.updatedAt).toLocaleString()}</p>
            </div>
          </div>

          <div className='mt-4'>
            <Label className='text-lg font-semibold'>Address</Label>
            <p className='text-gray-800'>{shop.address.street}</p>
            <p className='text-gray-800'>
              {shop.address.city}, {shop.address.country} {shop.address.postalCode}
            </p>
          </div>

          <div className='mt-6 flex justify-end'>
            <Button onClick={() => router.push('/admin/shop/create-shop')}>Edit Shop</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
