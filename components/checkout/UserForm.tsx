import { Skeleton } from '@/components/ui/skeleton';

export default function FormSkeleton() {
  return (
    <div className='animate-pulse space-y-4'>
      <div className='grid grid-cols-2 gap-4'>
        <div>
          <Skeleton className='mb-2 h-4 w-24' />
          <Skeleton className='h-10 w-full rounded-md' />
        </div>
        <div>
          <Skeleton className='mb-2 h-4 w-24' />
          <Skeleton className='h-10 w-full rounded-md' />
        </div>
      </div>

      <div>
        <Skeleton className='mb-2 h-4 w-24' />
        <Skeleton className='h-10 w-full rounded-md' />
      </div>

      <div>
        <Skeleton className='mb-2 h-4 w-24' />
        <Skeleton className='h-10 w-full rounded-md' />
      </div>

      <div className='grid grid-cols-3 gap-4'>
        <div>
          <Skeleton className='mb-2 h-4 w-16' />
          <Skeleton className='h-10 w-full rounded-md' />
        </div>
        <div>
          <Skeleton className='mb-2 h-4 w-16' />
          <Skeleton className='h-10 w-full rounded-md' />
        </div>
        <div>
          <Skeleton className='mb-2 h-4 w-16' />
          <Skeleton className='h-10 w-full rounded-md' />
        </div>
      </div>

      <div>
        <Skeleton className='mb-2 h-4 w-32' />
        <Skeleton className='h-10 w-full rounded-md' />
      </div>

      <Skeleton className='h-10 w-full rounded-md' />
    </div>
  );
}
