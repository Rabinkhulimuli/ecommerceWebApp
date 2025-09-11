'use server';
import { notFound } from 'next/navigation';
import { ProductDetails } from '@/components/product-details';
import prisma from '@/lib/prisma';
interface ProductPageProps {
  params: {
    id: string;
  };
}
async function getSingleProduct({ productId }: { productId: string }) {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        images: true,
      },
    });
    return product;
  } catch (err) {
    throw new Error('error getting product');
  }
}
export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getSingleProduct({ productId: params.id });
  if (!product) {
    notFound();
  }

  return (
    <div className=''>
      <ProductDetails product={product} />
    </div>
  );
}
