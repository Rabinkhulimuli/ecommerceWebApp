import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

export function HeroSection() {
  return (
    <section className='relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50'>
      <div className='container mx-auto px-4 py-24 lg:py-32'>
        <div className='grid items-center gap-12 lg:grid-cols-2'>
          <div className='space-y-8'>
            <div className='space-y-4'>
              <h1 className='text-4xl font-bold leading-tight text-gray-900 lg:text-6xl'>
                Discover Premium
                <span className='bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                  {' '}
                  Products
                </span>
              </h1>
              <p className='text-xl leading-relaxed text-gray-600'>
                Experience the finest selection of curated products with seamless shopping and fast
                delivery.
              </p>
            </div>

            <div className='flex flex-col gap-4 sm:flex-row'>
              <Link href='/products'>
                <Button size='lg' className='group w-full sm:w-auto'>
                  Shop Now
                  <ArrowRight className='ml-2 h-4 w-4 transition-transform group-hover:translate-x-1' />
                </Button>
              </Link>
              <Link href='/categories'>
                <Button variant='outline' size='lg' className='w-full bg-transparent sm:w-auto'>
                  Browse Categories
                </Button>
              </Link>
            </div>

            <div className='flex items-center space-x-8 pt-8'>
              <div className='text-center'>
                <div className='text-2xl font-bold text-gray-900'>10K+</div>
                <div className='text-sm text-gray-600'>Happy Customers</div>
              </div>
              <div className='text-center'>
                <div className='text-2xl font-bold text-gray-900'>500+</div>
                <div className='text-sm text-gray-600'>Premium Products</div>
              </div>
              <div className='text-center'>
                <div className='text-2xl font-bold text-gray-900'>24/7</div>
                <div className='text-sm text-gray-600'>Customer Support</div>
              </div>
            </div>
          </div>

          <div className='relative'>
            <div className='aspect-square rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 p-1 sm:p-8'>
              <div className='flex h-full w-full items-center justify-center rounded-xl bg-gradient-to-bl from-violet-500 to-fuchsia-500 shadow-2xl'>
                <div className='space-y-4 text-center'>
                  <div className='mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600'>
                    <div className=''>
                      <div className='flex items-center justify-center rounded-full border'>
                        <Image
                          className='rounded-full'
                          width={100}
                          height={100}
                          alt=''
                          src={'/logo.png'}
                        />
                      </div>
                    </div>
                  </div>
                  <div className='space-y-2'>
                    <h3 className='text-xl font-semibold text-white'>Premium Quality</h3>
                    <p className='text-white/70'>Carefully curated products</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
