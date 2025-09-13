'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
};

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: 'iPhone 15', price: 1200, stock: 10, category: 'Phones' },
    { id: 2, name: 'PS5', price: 499, stock: 5, category: 'Gaming' },
  ]);

  const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '', category: '' });

  const handleAddProduct = () => {
    setProducts([
      ...products,
      {
        id: Date.now(),
        name: newProduct.name,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock),
        category: newProduct.category,
      },
    ]);
    setNewProduct({ name: '', price: '', stock: '', category: '' });
  };

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter(p => p.id !== id));
  };

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
            <DialogContent className='sm:max-w-[500px]'>
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
              </DialogHeader>
              <div className='grid gap-4 py-4'>
                <Input
                  placeholder='Product Name'
                  value={newProduct.name}
                  onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                />
                <Input
                  placeholder='Price'
                  type='number'
                  value={newProduct.price}
                  onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                />
                <Input
                  placeholder='Stock'
                  type='number'
                  value={newProduct.stock}
                  onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })}
                />
                <Input
                  placeholder='Category'
                  value={newProduct.category}
                  onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                />
                <Button onClick={handleAddProduct} className='mt-2'>
                  Save Product
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className='overflow-x-auto'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map(product => (
                  <TableRow key={product.id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>${product.price}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell className='flex justify-end gap-2'>
                      <Button size='sm' variant='outline'>
                        <Pencil className='h-4 w-4' />
                      </Button>
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
        </CardContent>
      </Card>
    </div>
  );
}
