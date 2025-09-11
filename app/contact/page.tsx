import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, MapPin, Phone, Clock } from 'lucide-react';
import ContactForm from './contact-form';

export const metadata = {
  title: 'Contact Us | Acme Store',
  description:
    'Get in touch with Acme Store for support, order questions, or partnerships. We’re here to help.',
};

export default function page() {
  const supportEmail = 'khulimulirabin@gmail.com';

  return (
    <main className='min-h-screen'>
      {/* Hero */}
      <section className='relative isolate'>
        <div className='absolute inset-0 -z-10 bg-gradient-to-b from-muted/60 to-background' />
        <div className='mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24'>
          <div className='flex items-center gap-2'>
            <Badge variant='secondary' className='text-xs'>
              Contact
            </Badge>
          </div>

          <div className='mt-6 grid gap-8 md:grid-cols-12 md:gap-12'>
            {/* Left - Contact Form */}
            <div className='md:col-span-7'>
              <h1 className='text-3xl font-bold tracking-tight md:text-5xl'>We’re here to help</h1>
              <p className='mt-4 text-base text-muted-foreground md:text-lg'>
                Questions about an order, product recommendations, or returns? Send us a message and
                our team will get back to you shortly.
              </p>
              <div className='mt-6'>
                <ContactForm />
              </div>
            </div>

            {/* Right - Info Cards and Image */}
            <div className='md:col-span-5'>
              <div className='relative aspect-[4/3] w-full overflow-hidden rounded-xl border bg-muted'>
                <Image
                  src='/customer-support-team.jpg'
                  alt='Our customer support team'
                  fill
                  className='object-cover'
                  sizes='(min-width: 1024px) 520px, 100vw'
                />
              </div>

              <div className='mt-6 grid gap-4'>
                <Card>
                  <CardContent className='p-4'>
                    <div className='flex items-start gap-3'>
                      <Mail className='h-5 w-5 text-muted-foreground' />
                      <div>
                        <div className='font-medium'>Email</div>
                        <a
                          className='text-sm text-muted-foreground underline underline-offset-4'
                          href={`mailto:${supportEmail}`}
                        >
                          {supportEmail}
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className='p-4'>
                    <div className='flex items-start gap-3'>
                      <Clock className='h-5 w-5 text-muted-foreground' />
                      <div>
                        <div className='font-medium'>Support hours</div>
                        <p className='text-sm text-muted-foreground'>
                          Mon–Fri, 9am–5pm (Local time)
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className='p-4'>
                    <div className='flex items-start gap-3'>
                      <Phone className='h-5 w-5 text-muted-foreground' />
                      <div>
                        <div className='font-medium'>Phone</div>
                        <p className='text-sm text-muted-foreground'>Coming soon</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className='p-4'>
                    <div className='flex items-start gap-3'>
                      <MapPin className='h-5 w-5 text-muted-foreground' />
                      <div>
                        <div className='font-medium'>Address</div>
                        <p className='text-sm text-muted-foreground'>
                          123 Commerce St, Suite 100, Your City
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
