"use client";
import React, { useState } from "react";
import DropdownCreateProduct from "./DropdownCreateProduct";

export default function AdminComponent() {
  const [openDropdown, setOpenDropdown] = useState(false);
  const handleDropDown = () => {
    setOpenDropdown(!openDropdown);
  };
  return (
    <div>
      <div className="relative">
        <div className="cursor-pointer" onClick={handleDropDown}>
          Admin
        </div>

        <div
          className={`
      absolute top-12 bg-gray-100 w-max overflow-hidden 
      transition-all duration-500 ease-in-out 
      ${openDropdown ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}
    `}
        >
          <DropdownCreateProduct setOpenDropdown={setOpenDropdown} />
        </div>
      </div>
    </div>
  );
}
