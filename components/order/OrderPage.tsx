'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Esewa from '@/components/esewa/Esewa';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Badge } from '../ui/badge';

export type OrderWithItems = {
  id: string;
  totalPrice: number;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELED';
  createdAt: string;
  payment: {
    status: 'PENDING' | 'COMPLETED' | 'FAILED';
    method: string;
    transactionId: string;
  } | null;
  orderItems: {
    id: string;
    quantity: number;
    price: number;
    product: {
      id: string;
      name: string;
      images: { url: string }[];
    };
  }[];
  shipping: {
    street: string;
    city: string;
    country: string;
    postalCode: string;
  } | null;
};

export default function OrdersPage() {
  const { data: session } = useSession();
  const userId = session?.user.id;
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [payingOrderId, setPayingOrderId] = useState<string | null>(null);
  const router = useRouter();

  const fetchOrders = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/user?userId=${userId}`);
      const data = await res.json();
      setOrders(data.data);
    } catch (err) {
      console.error(err);
      toast({ title: 'Error fetching orders', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [userId]);

  const handleDeleteOrder = async (orderId: string) => {
    try {
      const res = await fetch(`/api/orders/order/${orderId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        toast({ title: 'Order removed successfully' });
        fetchOrders();
      } else {
        toast({ title: 'Order remove failed', variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Order remove failed', variant: 'destructive' });
    }
  };

  if (loading) {
    return (
      <div className='container mx-auto px-4 py-10'>
        <p className='text-center text-lg'>Loading orders...</p>
        <div className='mt-4 space-y-4'>
          {[1, 2, 3].map(i => (
            <div key={i} className='h-40 animate-pulse rounded-md bg-gray-200' />
          ))}
        </div>
      </div>
    );
  }

  if (!orders.length) {
    return <p className='py-10 text-center text-lg'>No orders found.</p>;
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='mb-8 text-center text-3xl font-bold'>My Orders</h1>
      <div className='space-y-6'>
        {orders.map(order => (
          <Card key={order.id} className='space-y-2 rounded-xl border border-gray-200 shadow-lg'>
            <CardHeader className='rounded-t-xl bg-gray-50'>
              <CardTitle className='flex items-center justify-between text-lg font-semibold md:text-xl'>
                <span>Order #{order.id}</span>
                <span className='text-sm text-gray-500'>
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </CardTitle>
            </CardHeader>

            <CardContent className='space-y-4'>
              {/* Shipping Info */}
              <div className='rounded-md bg-gray-50 p-4'>
                <h3 className='mb-1 font-semibold'>Shipping Address</h3>
                {order.shipping ? (
                  <p className='text-sm text-gray-700'>
                    {order.shipping.street}, {order.shipping.city}, {order.shipping.postalCode},{' '}
                    {order.shipping.country}
                  </p>
                ) : (
                  <p className='text-sm text-gray-500'>No shipping info</p>
                )}
              </div>

              {/* Order Items */}
              <div className='overflow-x-auto'>
                <h3 className='mb-2 font-semibold'>Items</h3>
                <ul className='grid gap-4 md:grid-cols-2'>
                  {order.orderItems.map(item => (
                    <li
                      key={item.id}
                      onClick={() => router.push(`/products/${item.product.id}`)}
                      className='flex cursor-pointer items-center gap-4 rounded-md border p-3 transition hover:shadow-md'
                    >
                      <img
                        src={item.product.images[0]?.url || '/placeholder.png'}
                        alt={item.product.name}
                        className='h-16 w-16 flex-shrink-0 rounded-md object-cover'
                      />
                      <div className='flex flex-1 flex-col overflow-hidden'>
                        <p className='max-w-[14rem] truncate font-medium'>{item.product.name}</p>
                        <p className='text-sm text-gray-500'>Qty: {item.quantity}</p>
                        <p className='font-semibold text-gray-700'>Price: ${item.price}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Total & Payment */}
              <div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
                <div>
                  <h3 className='font-semibold'>Total Price</h3>
                  <p className='text-lg font-bold'>${order.totalPrice}</p>
                </div>

                <div className='flex flex-col items-start gap-2 sm:flex-row sm:items-center'>
                  <h3 className='font-semibold'>Payment Status</h3>
                  {order.payment?.status === 'COMPLETED' ? (
                    <p className='font-bold text-green-600'>Paid</p>
                  ) : (
                    <div
                      className={`flex items-center gap-2 transition-all duration-700 ease-in-out ${
                        payingOrderId === order.id ? 'w-full flex-col justify-center' : ''
                      }`}
                    >
                      <p className='font-bold text-red-600'>{order.payment?.status || 'Pending'}</p>
                      {payingOrderId === order.id ? (
                        <Esewa total_amount={order.totalPrice} productCode='EPAYTEST' />
                      ) : (
                        <Button
                          disabled={order.status === 'CANCELED'}
                          size='sm'
                          onClick={() => setPayingOrderId(order.id)}
                        >
                          Pay with eSewa
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Order Status */}
              <div className='flex flex-wrap items-center gap-2'>
                <h3 className='font-semibold'>Order Status:</h3>
                <Badge
                  className={`${
                    order.status === 'DELIVERED'
                      ? 'bg-green-100 text-green-800'
                      : order.status === 'SHIPPED'
                        ? 'bg-blue-100 text-blue-800'
                        : order.status === 'CANCELED'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {order.status}
                </Badge>
              </div>

              <Button
                variant='secondary'
                onClick={() => handleDeleteOrder(order.id)}
                className='bg-red-500 text-white hover:bg-red-400 hover:text-white'
              >
                Cancel
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
