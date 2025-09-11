import Link from 'next/link';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className='bg-gray-900 text-white'>
      <div className='container mx-auto px-4 py-12'>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4'>
          <div className='space-y-4'>
            <Link href='/' className='flex items-center space-x-2'>
              <div className='h-8 w-8 rounded-full bg-yellow-100'>
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
              <span className='text-xl font-bold text-white'>PRIVE</span>
            </Link>
            <p className='text-gray-400'>
              Your trusted partner for premium products and exceptional shopping experience.
            </p>
            <div className='flex space-x-4'>
              <Facebook className='h-5 w-5 cursor-pointer text-gray-400 hover:text-white' />
              <Twitter className='h-5 w-5 cursor-pointer text-gray-400 hover:text-white' />
              <Instagram className='h-5 w-5 cursor-pointer text-gray-400 hover:text-white' />
            </div>
          </div>

          <div>
            <h3 className='mb-4 font-semibold'>Quick Links</h3>
            <ul className='space-y-2 text-gray-400'>
              <li>
                <Link href='/products' className='hover:text-white'>
                  Products
                </Link>
              </li>
              <li>
                <Link href='/categories' className='hover:text-white'>
                  Categories
                </Link>
              </li>
              <li>
                <Link href='/about' className='hover:text-white'>
                  About Us
                </Link>
              </li>
              <li>
                <Link href='/contact' className='hover:text-white'>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className='mb-4 font-semibold'>Customer Service</h3>
            <ul className='space-y-2 text-gray-400'>
              <li>
                <Link href='/help' className='hover:text-white'>
                  Help Center
                </Link>
              </li>
              <li>
                <Link href='/shipping' className='hover:text-white'>
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href='/returns' className='hover:text-white'>
                  Returns
                </Link>
              </li>
              <li>
                <Link href='/warranty' className='hover:text-white'>
                  Warranty
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className='mb-4 font-semibold'>Contact Info</h3>
            <div className='space-y-3 text-gray-400'>
              <div className='flex items-center space-x-2'>
                <Phone className='h-4 w-4' />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className='flex items-center space-x-2'>
                <Mail className='h-4 w-4' />
                <span>support@PRIVE.com</span>
              </div>
              <div className='flex items-center space-x-2'>
                <MapPin className='h-4 w-4' />
                <span>123 Commerce St, City, State 12345</span>
              </div>
            </div>
          </div>
        </div>

        <div className='mt-8 border-t border-gray-800 pt-8 text-center text-gray-400'>
          <p>&copy; 2024 PRIVE. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
