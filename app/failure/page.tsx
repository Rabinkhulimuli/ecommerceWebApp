"use client";
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import Image from 'next/image';

interface PaymentErrorData {
  transaction_code?: string;
  status?: string;
  total_amount?: string;
  transaction_uuid?: string;
  product_code?: string;
  signed_field_names?: string;
  signature?: string;
  error_message?: string;
}

const EsewaFailurePage: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [errorData, setErrorData] = useState<PaymentErrorData | null>(null);

  useEffect(() => {
    const dataParam = searchParams.get('data');
    
    if (dataParam) {
      try {
        const decodedData = decodeURIComponent(dataParam);
        const jsonString = atob(decodedData);
        const parsedData: PaymentErrorData = JSON.parse(jsonString);
        setErrorData(parsedData);
      } catch (err) {
        console.error('Error parsing error data:', err);
        setErrorData({
          error_message: 'Failed to process payment information'
        });
      }
    } else {
      setErrorData({
        error_message: 'No payment data received'
      });
    }
  }, [searchParams]);

  return (
    <>
      <Head>
        <title>Payment Failed - Esewa</title>
        <meta name="description" content="Your payment was not processed successfully" />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-red-50 to-white py-12 px-4 sm:px-6 lg:px-8">
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
            <div className="bg-red-600 px-6 py-4">
              <h1 className="text-2xl font-bold text-white">Payment Failed</h1>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex justify-center mb-6">
                <div className="bg-red-100 p-4 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>

              <div className="text-center mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Payment Unsuccessful</h2>
                <p className="text-gray-600">
                  {errorData?.error_message || 'Your transaction could not be completed.'}
                </p>
              </div>

              {/* Error Details */}
              {errorData && (
                <div className="border border-gray-200 rounded-lg overflow-hidden mb-8">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <h3 className="font-medium text-gray-700">Transaction Details</h3>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {errorData.transaction_code && (
                      <div className="grid grid-cols-2 p-4">
                        <span className="text-gray-600">Transaction Code:</span>
                        <span className="font-medium">{errorData.transaction_code}</span>
                      </div>
                    )}
                    {errorData.transaction_uuid && (
                      <div className="grid grid-cols-2 p-4">
                        <span className="text-gray-600">Reference ID:</span>
                        <span className="font-medium">{errorData.transaction_uuid}</span>
                      </div>
                    )}
                    {errorData.total_amount && (
                      <div className="grid grid-cols-2 p-4">
                        <span className="text-gray-600">Amount:</span>
                        <span className="font-medium">Rs. {errorData.total_amount}</span>
                      </div>
                    )}
                    {errorData.status && (
                      <div className="grid grid-cols-2 p-4">
                        <span className="text-gray-600">Status:</span>
                        <span className="font-medium text-red-600 capitalize">{errorData.status.toLowerCase()}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={() => router.push('/')}
                  className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Return Home
                </button>
                <button
                  onClick={() => router.back()}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Try Again
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

export default EsewaFailurePage;