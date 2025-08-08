"use client";
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
  const {data:session}= useSession()
    const {clearCartItems}=useClearCart()
  useEffect(() => {
    const userId= session?.user.id

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
    if(userId){
        clearCartItems(userId)
    }
    setIsLoading(false);
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-gray-700">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md text-center">
          <div className="text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Verification Failed</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
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
        <meta name="description" content="Your payment was processed successfully" />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <Image
              src="/esewa/esewa.png"
              alt="Esewa Logo"
              width={120}
              height={60}
              className="mx-auto"
            />
          </div>

          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            {/* Header */}
            <div className="bg-green-600 px-6 py-4">
              <h1 className="text-2xl font-bold text-white">Payment Successful</h1>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex justify-center mb-6">
                <div className="bg-green-100 p-4 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>

              <div className="text-center mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Thank you for your payment!</h2>
                <p className="text-gray-600">Your transaction has been completed successfully.</p>
              </div>

              {/* Payment Details */}
              <div className="border border-gray-200 rounded-lg overflow-hidden mb-8">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h3 className="font-medium text-gray-700">Transaction Details</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  <div className="grid grid-cols-2 p-4">
                    <span className="text-gray-600">Amount Paid:</span>
                    <span className="font-medium">Rs. {paymentData?.total_amount}</span>
                  </div>
                  <div className="grid grid-cols-2 p-4">
                    <span className="text-gray-600">Transaction Code:</span>
                    <span className="font-medium">{paymentData?.transaction_code}</span>
                  </div>
                  <div className="grid grid-cols-2 p-4">
                    <span className="text-gray-600">Reference ID:</span>
                    <span className="font-medium">{paymentData?.transaction_uuid}</span>
                  </div>
                  <div className="grid grid-cols-2 p-4">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-medium text-green-600 capitalize">{paymentData?.status.toLowerCase()}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={() => router.push('/')}
                  className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Return Home
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Print Receipt
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <p className="text-sm text-gray-500 text-center">
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