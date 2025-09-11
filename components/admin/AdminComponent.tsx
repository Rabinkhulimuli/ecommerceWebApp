'use client';
import React, { useState } from 'react';
import DropdownCreateProduct from './DropdownCreateProduct';
import { usePathname } from 'next/navigation';
import { KeyRound } from 'lucide-react';

export default function AdminComponent({ handleMenuOpen }: { handleMenuOpen?: () => void }) {
  const [openDropdown, setOpenDropdown] = useState(false);
  const pathname = usePathname();
  const handleDropDown = () => {
    setOpenDropdown(!openDropdown);
  };
  const handleDropDowno = () => {
    setOpenDropdown(!openDropdown);
    if (handleMenuOpen) handleMenuOpen();
  };
  return (
    <div>
      <div className='relative'>
        <div
          className={`flex cursor-pointer items-center gap-5 hover:text-blue-600 ${pathname.includes('/admin') ? 'text-rose-600' : ''}`}
          onClick={handleDropDown}
        >
          <span> Admin</span>
          {pathname.includes('/admin') && (
            <span>
              <KeyRound className='h-5 w-5' />{' '}
            </span>
          )}
        </div>
        <div
          className={`absolute top-12 w-max overflow-hidden bg-gray-100 transition-all duration-500 ease-in-out ${openDropdown ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'} `}
        >
          <DropdownCreateProduct handleDropdown={handleDropDowno} />
        </div>
      </div>
    </div>
  );
}
