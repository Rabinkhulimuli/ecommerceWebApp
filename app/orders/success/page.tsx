'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useClearCart } from '@/services/cart.service';
import { useSession } from 'next-auth/react';

interface PaymentSuccessData {
  transaction_code: string;
  status: string;
  total_amount: string;
  transaction_uuid: string;
  product_code: string;
  signed_field_names: string;
  signature: string;
}

const EsewaSuccessPage: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [paymentData, setPaymentData] = useState<PaymentSuccessData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const { clearCartItems } = useClearCart();
  useEffect(() => {
    const userId = session?.user.id;

    const dataParam = searchParams.get('data');

    if (dataParam) {
      try {
        // URL decode the data first
        const decodedData = decodeURIComponent(dataParam);
        // Then base64 decode
        const jsonString = atob(decodedData);
        const parsedData: PaymentSuccessData = JSON.parse(jsonString);
        setPaymentData(parsedData);
      } catch (err) {
        console.error('Error parsing payment data:', err);
        setError('Invalid payment data received');
      }
    } else {
      setError('No payment data received');
    }
    if (userId) {
      clearCartItems(userId);
    }
    setIsLoading(false);
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <div className='mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-green-500'></div>
          <p className='mt-4 text-lg font-medium text-gray-700'>Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50'>
        <div className='mx-auto max-w-md rounded-lg bg-white p-8 text-center shadow-md'>
          <div className='mb-4 text-red-500'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='mx-auto h-16 w-16'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
          </div>
          <h2 className='mb-2 text-2xl font-bold text-gray-800'>Payment Verification Failed</h2>
          <p className='mb-6 text-gray-600'>{error}</p>
          <button
            onClick={() => router.push('/')}
            className='rounded-md bg-green-600 px-6 py-2 text-white transition-colors hover:bg-green-700'
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Payment Successful - Esewa</title>
        <meta name='description' content='Your payment was processed successfully' />
      </Head>

      <div className='min-h-screen bg-gradient-to-b from-green-50 to-white px-4 py-12 sm:px-6 lg:px-8'>
        <div className='mx-auto max-w-3xl'>
          <div className='mb-8 text-center'>
            <Image
              src='/esewa/esewa.png'
              alt='Esewa Logo'
              width={120}
              height={60}
              className='mx-auto'
            />
          </div>

          <div className='overflow-hidden rounded-lg bg-white shadow-lg'>
            {/* Header */}
            <div className='bg-green-600 px-6 py-4'>
              <h1 className='text-2xl font-bold text-white'>Payment Successful</h1>
            </div>

            {/* Content */}
            <div className='p-6'>
              <div className='mb-6 flex justify-center'>
                <div className='rounded-full bg-green-100 p-4'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-16 w-16 text-green-600'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M5 13l4 4L19 7'
                    />
                  </svg>
                </div>
              </div>

              <div className='mb-8 text-center'>
                <h2 className='mb-2 text-xl font-semibold text-gray-800'>
                  Thank you for your payment!
                </h2>
                <p className='text-gray-600'>Your transaction has been completed successfully.</p>
              </div>

              {/* Payment Details */}
              <div className='mb-8 overflow-hidden rounded-lg border border-gray-200'>
                <div className='border-b border-gray-200 bg-gray-50 px-4 py-3'>
                  <h3 className='font-medium text-gray-700'>Transaction Details</h3>
                </div>
                <div className='divide-y divide-gray-200'>
                  <div className='grid grid-cols-2 p-4'>
                    <span className='text-gray-600'>Amount Paid:</span>
                    <span className='font-medium'>Rs. {paymentData?.total_amount}</span>
                  </div>
                  <div className='grid grid-cols-2 p-4'>
                    <span className='text-gray-600'>Transaction Code:</span>
                    <span className='font-medium'>{paymentData?.transaction_code}</span>
                  </div>
                  <div className='grid grid-cols-2 p-4'>
                    <span className='text-gray-600'>Reference ID:</span>
                    <span className='font-medium'>{paymentData?.transaction_uuid}</span>
                  </div>
                  <div className='grid grid-cols-2 p-4'>
                    <span className='text-gray-600'>Status:</span>
                    <span className='font-medium capitalize text-green-600'>
                      {paymentData?.status.toLowerCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className='flex flex-col justify-center gap-4 sm:flex-row'>
                <button
                  onClick={() => router.push('/')}
                  className='rounded-md bg-green-600 px-6 py-3 text-white transition-colors hover:bg-green-700'
                >
                  Return Home
                </button>
                <button
                  onClick={() => {
                    if (typeof window !== 'undefined') window.print();
                  }}
                  className='rounded-md border border-gray-300 px-6 py-3 text-gray-700 transition-colors hover:bg-gray-50'
                >
                  Print Receipt
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className='border-t border-gray-200 bg-gray-50 px-6 py-4'>
              <p className='text-center text-sm text-gray-500'>
                Need help? Contact our support team at support@example.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EsewaSuccessPage;
