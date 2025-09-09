"use client";
import React, { useState } from "react";
import DropdownCreateProduct from "./DropdownCreateProduct";
import { usePathname } from "next/navigation";
import { KeyRound } from "lucide-react";

export default function AdminComponent({
  handleMenuOpen,
}: {
  handleMenuOpen?: () => void;
}) {
  const [openDropdown, setOpenDropdown] = useState(false);
  const pathname=usePathname()
  const handleDropDown = () => {
    setOpenDropdown(!openDropdown);
  };
  const handleDropDowno = () => {
    setOpenDropdown(!openDropdown);
    if (handleMenuOpen) handleMenuOpen();
  };
  return (
    <div>
      <div className="relative">
        <div   className={` hover:text-blue-600 cursor-pointer flex items-center gap-5 ${pathname.includes("/admin")?"text-rose-600":""}`}
           onClick={handleDropDown}>
          <span> Admin</span>{pathname.includes("/admin")&&<span><KeyRound className="w-5 h-5"/> </span>}
          
        </div>
        <div
          className={`
      absolute top-12 bg-gray-100 w-max overflow-hidden 
      transition-all duration-500 ease-in-out 
      ${openDropdown ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}
    `}
        >
          <DropdownCreateProduct handleDropdown={handleDropDowno} />
        </div>
      </div>
    </div>
  );
}
