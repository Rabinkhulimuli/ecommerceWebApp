'use client';

import React, { Component, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: any) {
    console.error('Global Error Caught:', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return <ErrorModal error={this.state.error?.message} onReset={this.handleReset} />;
    }

    return this.props.children;
  }
}

const ErrorModal = ({ error, onReset }: { error?: string; onReset: () => void }) => {
  const router = useRouter();

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4'>
      <div className='animate-fade-in w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-xl'>
        <h2 className='mb-4 text-2xl font-bold text-red-600'>Something went wrong</h2>
        <p className='mb-6 text-gray-700'>{error || 'An unexpected error occurred.'}</p>
        <div className='flex justify-center gap-4'>
          <button
            onClick={onReset}
            className='rounded-lg bg-red-600 px-6 py-2 text-white transition hover:bg-red-700'
          >
            Try Again
          </button>
          <button
            onClick={() => router.push('/')}
            className='rounded-lg bg-gray-200 px-6 py-2 text-gray-800 transition hover:bg-gray-300'
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};
