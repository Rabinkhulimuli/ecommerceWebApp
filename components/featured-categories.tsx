import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Smartphone, Headphones, Watch, Camera } from 'lucide-react';

const categories = [
  {
    name: 'Electronics',
    icon: Smartphone,
    href: '/categories/electronics',
    color: 'from-blue-500 to-blue-600',
  },
  {
    name: 'Audio',
    icon: Headphones,
    href: '/categories/audio',
    color: 'from-purple-500 to-purple-600',
  },
  {
    name: 'Wearables',
    icon: Watch,
    href: '/categories/wearables',
    color: 'from-green-500 to-green-600',
  },
  {
    name: 'Photography',
    icon: Camera,
    href: '/categories/photography',
    color: 'from-orange-500 to-orange-600',
  },
];

export function FeaturedCategories() {
  return (
    <section className='bg-gray-50 px-4 py-16'>
      <div className='mx-auto max-w-7xl'>
        <div className='mb-12 text-center'>
          <h2 className='mb-4 text-3xl font-bold text-gray-900'>Shop by Category</h2>
          <p className='text-gray-600'>Find exactly what you're looking for</p>
        </div>

        <div className='grid gap-6 sm:grid-cols-2 md:grid-cols-4'>
          {categories.map(category => {
            const Icon = category.icon;
            return (
              <Link key={category.name} href={category.href}>
                <Card className='group cursor-pointer transition-all duration-300 hover:shadow-lg'>
                  <CardContent className='p-6 text-center'>
                    <div
                      className={`mx-auto mb-4 h-16 w-16 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center transition-transform group-hover:scale-110`}
                    >
                      <Icon className='h-8 w-8 text-white' />
                    </div>
                    <h3 className='font-semibold text-gray-900 transition-colors group-hover:text-blue-600'>
                      {category.name}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
