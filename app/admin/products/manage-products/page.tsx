'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Pencil, Trash2, Plus } from 'lucide-react';
import CreateProductForm from '@/components/products/CreateProductForm';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

type Product = {
  id: number;
  discount: number;
  name: string;
  price: number;
  stock: number;
  category: {
    name: string;
  };
};

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const { data: session } = useSession();
  const userId = session?.user.id;
  const getAllProduct = async () => {
    try {
      const res = await fetch(`/api/admin/products/manage-products?shopId=${userId}`);
      const data = await res.json();
      setProducts(data.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getAllProduct();
  }, []);

  const handleDeleteProduct = (id: number) => {};

  return (
    <div className='mx-auto max-w-6xl p-6'>
      <Card className='rounded-2xl shadow-lg'>
        <CardHeader className='flex items-center justify-between'>
          <CardTitle className='text-xl font-bold'>Product Management</CardTitle>
          <Dialog>
            <DialogTrigger asChild>
              <Button className='flex items-center gap-2'>
                <Plus className='h-4 w-4' /> Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className='overflow-hidden overflow-y-scroll sm:max-h-[80vh]'>
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
              </DialogHeader>
              <div className=''>
                <CreateProductForm />
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {products && products.length > 0 ? (
            <div className='overflow-x-auto'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Discount%*</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className='text-right'>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products &&
                    Array.isArray(products) &&
                    products.map(product => (
                      <TableRow key={product.id}>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>${product.price}</TableCell>
                        <TableCell>${product.discount}</TableCell>
                        <TableCell>{product.stock}</TableCell>
                        <TableCell>{product.category.name}</TableCell>
                        <TableCell className='flex justify-end gap-2'>
                          <Link href={`/admin/create-product?id=${product.id}`}>
                            <Button size='sm' variant='outline'>
                              <Pencil className='h-4 w-4' />
                            </Button>
                          </Link>
                          <Button
                            size='sm'
                            variant='destructive'
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            <Trash2 className='h-4 w-4' />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className='px-4 py-2'>You haven't listed any products yet.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
