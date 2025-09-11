import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from 'next/image';
import { Globe, Leaf, Package, ShieldCheck, Star, Truck, Users } from 'lucide-react';

export const metadata = {
  title: 'About Us | Acme Store',
  description:
    'Learn about Acme Store — our mission, values, team, and commitment to quality, sustainability, and customer happiness.',
};

const stats = [
  { label: 'Orders shipped', value: '250k+' },
  { label: 'Happy customers', value: '120k+' },
  { label: 'Countries served', value: '40+' },
  { label: 'Satisfaction score', value: '4.8/5' },
];

const values = [
  {
    icon: <ShieldCheck className='h-5 w-5' aria-hidden='true' />,
    title: 'Quality First',
    desc: 'We obsess over product quality, durability, and a delightful unboxing experience.',
  },
  {
    icon: <Users className='h-5 w-5' aria-hidden='true' />,
    title: 'Customer-Obsessed',
    desc: 'We treat every customer like our only customer with fast, friendly support.',
  },
  {
    icon: <Leaf className='h-5 w-5' aria-hidden='true' />,
    title: 'Sustainable Choices',
    desc: 'We prioritize recycled materials, low-waste packaging, and carbon-conscious shipping.',
  },
  {
    icon: <Truck className='h-5 w-5' aria-hidden='true' />,
    title: 'Reliable Delivery',
    desc: 'Fast processing, real-time tracking, and trusted carriers you can count on.',
  },
];

const team = [
  {
    name: 'Ava Thompson',
    role: 'Founder & CEO',
    img: '/founder-portrait-studio.png',
    initials: 'AT',
  },
  {
    name: 'Liam Garcia',
    role: 'Head of Operations',
    img: '/operations-lead-headshot.png',
    initials: 'LG',
  },
  {
    name: 'Noah Patel',
    role: 'Customer Success Lead',
    img: '/customer-success-headshot.png',
    initials: 'NP',
  },
  {
    name: 'Sophia Chen',
    role: 'Design Director',
    img: '/design-director-headshot.png',
    initials: 'SC',
  },
];

export default function Page() {
  return (
    <main className='min-h-screen'>
      {/* Hero */}
      <section className='relative isolate'>
        <div className='absolute inset-0 -z-10 bg-gradient-to-b from-muted/60 to-background' />
        <div className='mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24'>
          <div className='flex items-center gap-2'>
            <Badge variant='secondary' className='text-xs'>
              About us
            </Badge>
          </div>
          <div className='mt-6 grid gap-6 md:grid-cols-12 md:gap-10'>
            <div className='md:col-span-7'>
              <h1 className='text-3xl font-bold tracking-tight md:text-5xl'>
                Building products that customers love to use and gift
              </h1>
              <p className='mt-4 text-base text-muted-foreground md:text-lg'>
                Since day one, our mission has been simple: make everyday essentials beautifully
                designed, responsibly made, and delightfully easy to buy.
              </p>
              <div className='flex flex-wrap items-center gap-3 pt-6'>
                <Button asChild>
                  <a href='/products' aria-label='Browse our products'>
                    Shop products
                  </a>
                </Button>
                <Button variant='outline' asChild>
                  <a href='/contact' aria-label='Contact our team'>
                    Contact us
                  </a>
                </Button>
              </div>
              <div className='flex items-center gap-3 pt-6 text-sm text-muted-foreground'>
                <Star className='h-4 w-4 fill-current' aria-hidden='true' />
                <span>{'Trusted by 120k+ customers worldwide'}</span>
              </div>
            </div>
            <div className='md:col-span-5'>
              <div className='relative aspect-[4/3] w-full overflow-hidden rounded-xl border bg-muted'>
                <Image
                  src='/modern-fulfillment-center.png'
                  alt='Our fulfillment center where we prepare and ship customer orders'
                  fill
                  priority
                  className='object-cover'
                  sizes='(min-width: 1024px) 480px, 100vw'
                />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className='mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4'>
            {stats.map(s => (
              <Card key={s.label} className='border-muted'>
                <CardContent className='p-4'>
                  <div className='text-2xl font-semibold'>{s.value}</div>
                  <div className='text-sm text-muted-foreground'>{s.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Story and Mission */}
      <section className='mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16'>
        <div className='grid gap-8 md:grid-cols-2 md:gap-12'>
          <div>
            <h2 className='text-xl font-semibold md:text-2xl'>Our story</h2>
            <p className='mt-3 text-muted-foreground'>
              We started Acme Store after countless frustrating experiences with flimsy, over-priced
              goods. We believed there was a better way — products made to last, priced fairly, and
              shipped fast.
            </p>
            <p className='mt-3 text-muted-foreground'>
              Today, our small but mighty team designs with intention, iterates with customer
              feedback, and partners with responsible manufacturers to bring ideas to life.
            </p>
          </div>
          <div>
            <h2 className='text-xl font-semibold md:text-2xl'>Our mission</h2>
            <p className='mt-3 text-muted-foreground'>
              To elevate everyday living through thoughtful design, exceptional service, and
              sustainable choices — without compromising on value.
            </p>
            <ul className='mt-4 space-y-3'>
              <li className='flex items-start gap-3'>
                <Package className='mt-0.5 h-5 w-5 text-muted-foreground' aria-hidden='true' />
                <p className='text-sm'>
                  Durable materials and rigorous quality checks at every step.
                </p>
              </li>
              <li className='flex items-start gap-3'>
                <Globe className='mt-0.5 h-5 w-5 text-muted-foreground' aria-hidden='true' />
                <p className='text-sm'>Global fulfillment network for fast, reliable delivery.</p>
              </li>
              <li className='flex items-start gap-3'>
                <Leaf className='mt-0.5 h-5 w-5 text-muted-foreground' aria-hidden='true' />
                <p className='text-sm'>
                  Responsible sourcing and packaging to reduce our footprint.
                </p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <Separator className='my-2' />

      {/* Values */}
      <section className='mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16'>
        <div className='flex items-center justify-between gap-4'>
          <h2 className='text-xl font-semibold md:text-2xl'>What we value</h2>
          <Badge variant='outline' className='hidden md:inline-flex'>
            Company values
          </Badge>
        </div>
        <div className='mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          {values.map(v => (
            <Card key={v.title} className='h-full'>
              <CardHeader className='pb-2'>
                <div className='flex items-center gap-2 text-sm'>
                  {v.icon}
                  <CardTitle className='text-base'>{v.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className='text-sm text-muted-foreground'>{v.desc}</CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className='mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16'>
        <div className='flex items-center justify-between gap-4'>
          <h2 className='text-xl font-semibold md:text-2xl'>Meet the team</h2>
          <Badge variant='outline' className='hidden md:inline-flex'>
            People behind Acme
          </Badge>
        </div>
        <p className='mt-3 text-muted-foreground'>
          We&apos;re a distributed crew of builders, designers, and support pros united by customer
          happiness.
        </p>
        <div className='mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          {team.map(m => (
            <Card key={m.name} className='overflow-hidden'>
              <CardContent className='p-4'>
                <div className='flex items-center gap-4'>
                  <Avatar className='h-14 w-14'>
                    <AvatarImage src={m.img || '/placeholder.svg'} alt={`${m.name} headshot`} />
                    <AvatarFallback>{m.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className='font-medium'>{m.name}</div>
                    <div className='text-sm text-muted-foreground'>{m.role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Sustainability */}
      <section className='mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16'>
        <div className='grid gap-8 md:grid-cols-12'>
          <div className='md:col-span-5'>
            <div className='relative aspect-[4/3] w-full overflow-hidden rounded-xl border bg-muted'>
              <Image
                src='/recycled-packaging.png'
                alt='Sustainable packaging using recycled materials'
                fill
                className='object-cover'
                sizes='(min-width: 1024px) 520px, 100vw'
              />
            </div>
          </div>
          <div className='md:col-span-7'>
            <h2 className='text-xl font-semibold md:text-2xl'>Sustainability & impact</h2>
            <p className='mt-3 text-muted-foreground'>
              We design for longevity and ship with recycled or recyclable materials wherever
              possible. Our operations team continuously evaluates suppliers to improve energy and
              material efficiency.
            </p>
            <ul className='mt-4 space-y-3 text-sm'>
              <li className='flex items-start gap-3'>
                <Leaf className='mt-0.5 h-5 w-5 text-muted-foreground' aria-hidden='true' />
                <span>Recycled mailers and FSC-certified boxes</span>
              </li>
              <li className='flex items-start gap-3'>
                <Truck className='mt-0.5 h-5 w-5 text-muted-foreground' aria-hidden='true' />
                <span>Optimized shipping routes reduce transport emissions</span>
              </li>
              <li className='flex items-start gap-3'>
                <Package className='mt-0.5 h-5 w-5 text-muted-foreground' aria-hidden='true' />
                <span>Minimal plastic and low-ink packaging design</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Press / Logos */}
      <section className='mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16'>
        <div className='text-center'>
          <h2 className='text-xl font-semibold md:text-2xl'>As seen in</h2>
          <p className='mt-3 text-muted-foreground'>
            Featured by leading publications and creators.
          </p>
        </div>
        <div className='grid grid-cols-2 gap-6 pt-6 sm:grid-cols-3 md:grid-cols-6'>
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className='flex items-center justify-center rounded-md border bg-muted/20 p-4'
            >
              <Image
                src={`/logo.png?height=56&width=160&query=press%20logo%20${i + 1}`}
                alt={`Press logo ${i + 1}`}
                width={160}
                height={56}
                className='opacity-70'
              />
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className='mx-auto max-w-6xl px-4 pb-16 md:px-6'>
        <Card className='overflow-hidden'>
          <div className='grid md:grid-cols-2'>
            <div className='p-6 md:p-8'>
              <h3 className='text-lg font-semibold md:text-xl'>
                Ready to discover your next favorite thing?
              </h3>
              <p className='mt-2 text-muted-foreground'>
                Explore customer favorites, new arrivals, and curated collections — shipped fast,
                guaranteed.
              </p>
              <div className='mt-6 flex flex-col items-center gap-3 sm:flex-row'>
                <Button asChild className='w-full sm:w-fit'>
                  <a href='/products' aria-label='Start shopping now'>
                    Start shopping
                  </a>
                </Button>
                <Button variant='outline' asChild className='w-full sm:w-fit'>
                  <a href='/category' aria-label='Browse collections'>
                    Browse collections
                  </a>
                </Button>
              </div>
            </div>
            <div className='relative min-h-[220px]'>
              <Image
                src='/ecommerce-flatlay.png'
                alt='A flatlay of our popular products'
                fill
                className='object-cover'
                sizes='(min-width: 1024px) 560px, 100vw'
              />
            </div>
          </div>
        </Card>
      </section>
    </main>
  );
}
