import Link from 'next/link';
import React, { SetStateAction } from 'react';

export default function DropdownCreateProduct({ handleDropdown }: { handleDropdown: () => void }) {
  const adminList = [
    {
      id: 0,
      name: 'create category',
      link: '/admin/create-category',
    },
    {
      id: 1,
      name: 'create product',
      link: '/admin/create-product',
    },
  ];
  return (
    <div className='flex w-fit flex-col items-center justify-center gap-2 rounded-md px-2 py-1 shadow-md backdrop-blur-2xl -backdrop-hue-rotate-90'>
      {adminList.map(eh => (
        <Link
          className='w-full rounded-md bg-blue-600 px-4 py-2 capitalize text-white transition-colors hover:bg-blue-900'
          key={eh.id}
          onClick={handleDropdown}
          href={eh.link}
        >
          {' '}
          {eh.name}
        </Link>
      ))}
    </div>
  );
}
