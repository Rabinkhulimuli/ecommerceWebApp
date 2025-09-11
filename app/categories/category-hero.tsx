import { Badge } from '@/components/ui/badge';

export function CategoriesHero() {
  return (
    <section className='relative isolate overflow-hidden bg-gradient-to-b from-primary/5 to-background'>
      <div className='mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40'>
        <div className='text-center'>
          <Badge variant='secondary' className='mb-4'>
            Explore Collections
          </Badge>
          <h1 className='text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl'>
            Shop by Category
          </h1>
          <p className='mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground'>
            Discover our curated collections of premium products in every category.
          </p>
        </div>
      </div>
    </section>
  );
}
