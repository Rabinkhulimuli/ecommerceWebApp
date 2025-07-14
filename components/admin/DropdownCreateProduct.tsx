import Link from "next/link";
import React, { SetStateAction } from "react";

export default function DropdownCreateProduct({setOpenDropdown}:{setOpenDropdown:React.Dispatch<SetStateAction<boolean>>}) {
  const adminList = [
    {
      id: 0,
      name: "create category",
      link: "/admin/create-category",
    },
    {
      id: 1,
      name: "create product",
      link: "/admin/create-product",
    },
  ];
  return (
    <div className="flex flex-col items-center justify-center w-fit gap-2 -backdrop-hue-rotate-90 px-2 py-1 rounded-md  backdrop-blur-2xl shadow-md ">
      {adminList.map((eh) => (
        <Link
          className="bg-blue-600 px-4 py-2 w-full rounded-md capitalize text-white hover:bg-blue-900 transition-colors"
          key={eh.id}
          onClick={()=> setOpenDropdown((prev)=> !prev)}
          href={eh.link}
        >
          {" "}
          {eh.name}
        </Link>
      ))}
    </div>
  );
}
