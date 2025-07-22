'use client';

import { AlertTriangleIcon } from 'lucide-react';

export default function ProductErrorPage() {
  return (
    <div className='border-card bg-card flex min-h-[300px] w-full flex-col items-center justify-center gap-y-4 rounded-md border p-8 lg:min-h-[500px]'>
      <AlertTriangleIcon />
      <p className='text-base font-medium'>Something went wrong</p>
    </div>
  );
}
