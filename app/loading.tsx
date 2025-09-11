'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

// A full-page global loading screen
// You can place this in `app/loading.tsx` in Next.js App Router
// or show conditionally in your Layout / App component

export default function GlobalLoading() {
  return (
    <div className='fixed inset-0 z-50 flex h-screen w-screen flex-col items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-100'>
      {/* Animated logo / icon */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className='mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-600 shadow-lg'
      >
        <Loader2 className='h-10 w-10 animate-spin text-white' />
      </motion.div>

      {/* Text with shimmer */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className='bg-gradient-to-r from-emerald-700 via-emerald-500 to-emerald-700 bg-clip-text text-2xl font-bold tracking-tight text-transparent'
      >
        Loading, please wait…
      </motion.h1>

      {/* Progress bar */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className='mt-8 h-1 w-2/3 rounded-full bg-emerald-200'
      >
        <div className='h-1 rounded-full bg-emerald-600' />
      </motion.div>
    </div>
  );
}
