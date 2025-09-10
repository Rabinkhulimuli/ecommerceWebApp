"use client"
import { useEffect, useRef, useState } from "react";

export function  NavbarWrapper({ children }: { children: React.ReactNode }) {
  const [showNavbar, setShowNavbar] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY === 0) {
        setShowNavbar(true);
        lastScrollY.current = 0;
        return;
      }
      if (window.scrollY > lastScrollY.current) setShowNavbar(false);
      else setShowNavbar(true);

      lastScrollY.current = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`${showNavbar ? "translate-y-0" : "-translate-y-full"} transition-transform duration-300`}>
      {children}
    </div>
  );
}
