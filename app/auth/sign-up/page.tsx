import NightSky from '@/components/shootingStar/NightSky';
import React from 'react';
import SignUp from './SignUpPage';

export default function page() {
  return (
    <div className='relative min-h-screen w-full'>
      {/* Background Sky */}
      <NightSky />

      {/* Foreground Content */}
      <div className='relative z-10'>
        <SignUp />
      </div>
    </div>
  );
}
