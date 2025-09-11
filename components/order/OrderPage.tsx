'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Esewa from '@/components/esewa/Esewa';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

type OrderWithItems = {
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
  useEffect(() => {
    if (!userId) return;

    fetch(`/api/orders?userId=${userId}`)
      .then(res => res.json())
      .then(data => {
        setOrders(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        toast({ title: 'Error fetching orders', variant: 'destructive' });
        setLoading(false);
      });
  }, [userId]);

  if (loading) return <p>Loading orders...</p>;
  if (!orders.length) return <p>No orders found.</p>;

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='mb-6 text-3xl font-bold'>My Orders</h1>
      <div className='space-y-6'>
        {orders.map(order => (
          <Card key={order.id}>
            <CardHeader>
              <CardTitle className=''>
                Order #{order.id} — {new Date(order.createdAt).toLocaleDateString()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='mb-4'>
                <h3 className='font-semibold'>Shipping Address:</h3>
                {order.shipping ? (
                  <p>
                    {order.shipping.street}, {order.shipping.city}, {order.shipping.postalCode},{' '}
                    {order.shipping.country}
                  </p>
                ) : (
                  <p>No shipping info</p>
                )}
              </div>

              <div className='mb-4'>
                <h3 className='font-semibold'>Items:</h3>
                <ul className='shadow--md grid justify-between rounded-md border px-4 md:grid-cols-2'>
                  {order.orderItems.map(item => (
                    <li
                      onClick={() => router.push(`/products/${item.product.id}`)}
                      key={item.id}
                      className='my-2 flex items-center space-x-4'
                    >
                      <img
                        src={item.product.images[0]?.url || '/placeholder.png'}
                        alt={item.product.name}
                        className='h-12 w-12 rounded-md object-cover'
                      />
                      <div>
                        <p className='max-w-32 overflow-hidden overflow-ellipsis text-nowrap sm:max-w-sm'>
                          {item.product.name}
                        </p>
                        <p>Qty: {item.quantity}</p>
                        <p>Price: {item.price}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className='mb-4'>
                <h3 className='font-semibold'>Total Price:</h3>
                <p>{order.totalPrice}</p>
              </div>

              <div className='mb-4'>
                <h3 className='font-semibold'>Payment Status:</h3>
                {order.payment?.status === 'COMPLETED' ? (
                  <p className='font-bold text-green-600'>Paid</p>
                ) : (
                  <div>
                    <p className='font-bold text-red-600'>Pending Payment</p>
                    {payingOrderId === order.id ? (
                      <Esewa total_amount={order.totalPrice} />
                    ) : (
                      <Button onClick={() => setPayingOrderId(order.id)}>Pay with Esewa</Button>
                    )}
                  </div>
                )}
              </div>

              <div>
                <h3 className='font-semibold'>Order Status:</h3>
                <p>{order.status}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
