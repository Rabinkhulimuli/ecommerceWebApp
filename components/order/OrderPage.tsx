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
      setOrders(data);
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
      <div className="container mx-auto px-4 py-10">
        <p className="text-center text-lg">Loading orders...</p>
        <div className="space-y-4 mt-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-gray-200 h-40 rounded-md" />
          ))}
        </div>
      </div>
    );
  }

  if (!orders.length) {
    return <p className="text-center py-10 text-lg">No orders found.</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-center">My Orders</h1>
      <div className="space-y-6">
        {orders.map((order) => (
          <Card
            key={order.id}
            className="shadow-lg rounded-xl border space-y-2 border-gray-200"
          >
            <CardHeader className="bg-gray-50 rounded-t-xl">
              <CardTitle className="flex justify-between items-center text-lg md:text-xl font-semibold">
                <span>Order #{order.id}</span>
                <span className="text-gray-500 text-sm">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Shipping Info */}
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-semibold mb-1">Shipping Address</h3>
                {order.shipping ? (
                  <p className="text-gray-700 text-sm">
                    {order.shipping.street}, {order.shipping.city},{' '}
                    {order.shipping.postalCode}, {order.shipping.country}
                  </p>
                ) : (
                  <p className="text-gray-500 text-sm">No shipping info</p>
                )}
              </div>

              {/* Order Items */}
              <div className="overflow-x-auto">
                <h3 className="font-semibold mb-2">Items</h3>
                <ul className="grid gap-4 md:grid-cols-2">
                  {order.orderItems.map((item) => (
                    <li
                      key={item.id}
                      onClick={() => router.push(`/products/${item.product.id}`)}
                      className="flex items-center gap-4 p-3 border rounded-md hover:shadow-md cursor-pointer transition"
                    >
                      <img
                        src={item.product.images[0]?.url || '/placeholder.png'}
                        alt={item.product.name}
                        className="h-16 w-16 rounded-md object-cover flex-shrink-0"
                      />
                      <div className="flex flex-col flex-1 overflow-hidden">
                        <p className="font-medium truncate max-w-[14rem]">
                          {item.product.name}
                        </p>
                        <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                        <p className="text-gray-700 font-semibold">Price: ${item.price}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Total & Payment */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
                <div>
                  <h3 className="font-semibold">Total Price</h3>
                  <p className="text-lg font-bold">${order.totalPrice}</p>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                  <h3 className="font-semibold">Payment Status</h3>
                  {order.payment?.status === 'COMPLETED' ? (
                    <p className="text-green-600 font-bold">Paid</p>
                  ) : (
                    <div
                      className={`flex items-center gap-2 transition-all duration-700 ease-in-out ${
                        payingOrderId === order.id ? 'flex-col justify-center w-full' : ''
                      }`}
                    >
                      <p className="text-red-600 font-bold">
                        {order.payment?.status || 'Pending'}
                      </p>
                      {payingOrderId === order.id ? (
                        <Esewa total_amount={order.totalPrice} productCode="EPAYTEST" />
                      ) : (
                        <Button disabled={order.status==="CANCELED"} size="sm" onClick={() => setPayingOrderId(order.id)}>
                          Pay with eSewa
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Order Status */}
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold">Order Status:</h3>
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
                variant="secondary"
                onClick={() => handleDeleteOrder(order.id)}
                className="bg-red-500 text-white hover:bg-red-400 hover:text-white"
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
