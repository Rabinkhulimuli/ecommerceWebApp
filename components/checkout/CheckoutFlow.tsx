'use client';

import { useState } from 'react';
import { CheckoutForm } from './CheckoutForm';

export default function CheckoutFlow({ total }: { total: number }) {
  const [step, setStep] = useState<'shipping' | 'payment' | 'review'>('shipping');

  const handleNext = () => {
    if (step === 'shipping') setStep('payment');
    else if (step === 'payment') setStep('review');
  };

  return (
    <div className='mx-auto max-w-2xl'>
      {/* Step indicators */}
      <div className='mb-6 flex justify-between'>
        <StepIndicator label='Shipping' active={step === 'shipping'} />
        <StepIndicator label='Payment' active={step === 'payment'} />
        <StepIndicator label='Review' active={step === 'review'} />
      </div>

      {/* Step form */}
      <CheckoutForm step={step} total={total} onNext={handleNext} />
    </div>
  );
}

function StepIndicator({ label, active }: { label: string; active: boolean }) {
  return (
    <div
      className={`rounded-full px-4 py-2 text-sm font-semibold ${
        active ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
      }`}
    >
      {label}
    </div>
  );
}
