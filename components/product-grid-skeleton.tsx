import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function ProductGridSkeleton() {
  return (
    <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i} className='overflow-hidden'>
          <div className='aspect-square'>
            <Skeleton className='h-full w-full' />
          </div>
          <CardContent className='p-4'>
            <Skeleton className='mb-2 h-4 w-3/4' />
            <Skeleton className='mb-1 h-3 w-full' />
            <Skeleton className='mb-3 h-3 w-2/3' />
            <div className='flex items-center justify-between'>
              <Skeleton className='h-5 w-16' />
              <Skeleton className='h-4 w-20' />
            </div>
          </CardContent>
          <CardFooter className='p-4 pt-0'>
            <Skeleton className='h-10 w-full' />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
