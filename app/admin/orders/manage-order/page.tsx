'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { AllOrderType } from '@/lib/types';

export default function OrdersPage() {
  const [orders, setOrders] = useState<AllOrderType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch('/api/orders/all');
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        toast({ title: 'Error loading orders', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);
  console.log('orders', orders);
  async function updateStatus(orderId: string, newStatus: AllOrderType['status']) {
    try {
      const res = await fetch(`/api/orders/order/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error('Failed to update order');

      setOrders(prev => prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o)));

      toast({ title: `Order updated to ${newStatus}` });
    } catch (err) {
      toast({ title: 'Failed to update status', variant: 'destructive' });
    }
  }

  if (loading) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <Loader2 className='h-6 w-6 animate-spin' />
      </div>
    );
  }

  return (
    <Card className='p-4'>
      <CardHeader>
        <CardTitle>Order Management</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders &&Array.isArray(orders )&&
              orders.map(order => (
                <TableRow key={order.id}>
                  <TableCell>{order.user.name}</TableCell>
                  <TableCell>{order.user.email}</TableCell>
                  <TableCell>${Number(order?.totalPrice).toFixed(2) || ''}</TableCell>
                  <TableCell>{order.payment?.method}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        order.status === 'DELIVERED'
                          ? 'default'
                          : order.status === 'CANCELED'
                            ? 'destructive'
                            : 'secondary'
                      }
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className='flex gap-2'>
                    {['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'].includes(order.status) && (
                      <Button
                        size='sm'
                        onClick={() =>
                          updateStatus(
                            order.id,
                            order.status === 'PENDING'
                              ? 'PROCESSING'
                              : order.status === 'PROCESSING'
                                ? 'SHIPPED'
                                : 'DELIVERED'
                          )
                        }
                      >
                        Next
                      </Button>
                    )}
                    {order.status !== 'CANCELED' && order.status !== 'DELIVERED' && (
                      <Button
                        size='sm'
                        variant='destructive'
                        onClick={() => updateStatus(order.id, 'CANCELED')}
                      >
                        Cancel
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
