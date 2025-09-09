"use client";

import { useState, useEffect, useCallback, useRef, FormEvent, ChangeEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter} from "next/navigation";
import { Menu, X, Search, ShoppingCart, User, Activity, Sparkles, EarthLock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { VscLoading } from "react-icons/vsc";
import AdminComponent from "./admin/AdminComponent";
import { useSession, signOut } from "next-auth/react";
import { useGetCartItems } from "@/services/cart.service";
import { sessionUsertype } from "@/lib/types";

// Define types for our product and suggestion data
interface ProductImage {
  url: string;
}

interface SuggestionProduct {
  id: string;
  name: string;
  price: number;
  images?: ProductImage[];
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [openProfile, setOpenProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SuggestionProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const pathname= usePathname()
  const { data, status } = useSession();
  const [user, setUser] = useState<sessionUsertype>(null);
  const router = useRouter();
  const { cartItems } = useGetCartItems(user?.id ?? "");
  const searchRef = useRef<HTMLDivElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const navArray=[
    {
      id:0,
      name:"Product",
      url:"/product"
    },
    {
      id:1,
      name:"Categories",
      url:"/categories"
    },
    {
      id:2,
      name:"About",
      url:"/about"
    },
    {
      id:3,
      name:"Contact",
      url:"/contact"
    },
  ]
  useEffect(() => {
    if (data?.user) setUser(data.user);
  }, [data]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current && 
        !searchRef.current.contains(event.target as Node) &&
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleMenuOpen = () => setIsMenuOpen(!isMenuOpen);
  
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      // Focus on input when search is opened
      setTimeout(() => {
        const input = document.getElementById("search-input");
        if (input) input.focus();
      }, 100);
    } else {
      setSearchQuery("");
      setSuggestions([]);
      setShowSuggestions(false);
      setHasSearched(false);
    }
  };

  // Fixed debounce function without 'this' issues
  const debounce = <T extends (...args: any[]) => void>(func: T, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const fetchSuggestions = async (query: string) => {
    if (!query.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);
    try {
      const response = await fetch(`/api/products/filter?search=${encodeURIComponent(query)}&limit=5`);
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.products || []);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error("Error fetching search suggestions:", error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedFetchSuggestions = useCallback(
    debounce((query: string) => fetchSuggestions(query), 1000),
    []
  );

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedFetchSuggestions(value);
  };

  const handleSuggestionClick = (product: SuggestionProduct) => {
    setSearchQuery(product.name);
    setShowSuggestions(false);
    // Navigate to product page using useRouter
    router.push(`/products?search=${encodeURIComponent(product.name)}`);
  };

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      // Navigate to search results using useRouter
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const itemCounts = useCallback(() => {
    if (cartItems) {
      return cartItems.reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0);
    }
    return null;
  }, [cartItems]);

  // Hide navbar on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) setShowNavbar(false);
      else setShowNavbar(true);
      setLastScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`fixed top-0 w-full z-40 bg-white border-b shadow-md transition-transform duration-300 ${
        showNavbar ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="flex items-center justify-between mx-auto px-4 py-2">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 ">
          <div className="h-8 w-8 rounded-full bg-yellow-100 border flex items-center justify-center overflow-hidden">
            <Image
              src="/logo.png"
              alt="logo"
              width={32}
              height={32}
              className="rounded-full object-cover"
            />
          </div>
          <span className="text-xl font-bold text-[#670D2F]">PRIVE</span>
          {pathname==="/"&&<span><EarthLock className="w-5 h-5 text-rose-600"/> </span>}
        </Link>
        {/* Desktop Nav */}
        <div className="hidden lg:flex justify-center gap-8 py-2">
          {user?.role === "ADMIN" && <AdminComponent />}
          
          {
            navArray.map((list)=> <span key={list.id}>

          <Link href={list.url} className="hover:text-blue-600">
            {list.name}
          </Link>
          {<span className={`transition-all transform ease-in-out duration-700 ${pathname===list.url?"opacity-100":"opacity-0"} flex gap-1`}>

          <span className={`transition-all transform ease-in-out duration-700 ${pathname===list.url?"w-5":"w-1"} bg-red-500  h-1 rounded-full block`}> </span>
          <span className="bg-red-500 w-1 h-1 rounded-full block"> </span>
          <span className="bg-red-500 w-1 h-1 rounded-full block"> </span>
          <span className="bg-red-500 w-1 h-1 rounded-full block"> </span>
          </span>}
          </span>)
          }
        </div>
        <div className="flex items-center gap-2">
          {/* Right Icons */}
          <div className="flex items-center gap-2">
            {/* Search icon */}
            <Button variant="ghost" size="icon" onClick={toggleSearch}>
              <Search size={22} />
            </Button>

            {/* Cart */}
            <Link href="/cart" className="relative hidden sm:block">
              <Button variant="ghost" size="icon">
                <ShoppingCart size={20} />
                {itemCounts() !== null && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {itemCounts()}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* User */}

            {user ? (
              status !== "loading" ? (
                <div className="relative">
                  <Button
                    onClick={() => setOpenProfile(!openProfile)}
                    variant="ghost"
                    size="icon"
                    className="w-10 h-10 rounded-full overflow-hidden p-0"
                  >
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt="profile"
                        width={40}
                        height={40}
                        className="rounded-full object-cover aspect-square"
                      />
                    ) : (
                      <User size={20} />
                    )}
                  </Button>
                  {openProfile && (
                    <div className="absolute top-10 right-5 shadow-md space-y-2 flex flex-col items border-1 px-4 text-nowrap py-2 rounded-md bg-white">
                      <Link className="hover:bg-blue-50 w-full rounded-md border px-4 py-1 font-semibold text-black/70" onClick={()=> setOpenProfile(false)} href="/profile">Profile</Link>
                      <Link className="hover:bg-blue-50 w-full rounded-md border px-4 py-1 font-semibold text-black/70" onClick={()=> setOpenProfile(false)} href="/orders">Orders</Link>
                      <button className="hover:bg-blue-50 w-full rounded-md border px-4 py-1 font-semibold text-black/70" 
                        onClick={() =>
                        {
                          signOut({ callbackUrl: "/auth/sign-in" })
                          setOpenProfile(false)
                        }
                        }
                      >
                        {" "}
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <VscLoading className="animate-spin" />
              )
            ) : (
              <Link href="/auth/sign-in">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
          {/* Menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={handleMenuOpen}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Animated Search Bar */}
      <div
        className={`px-4 transition-all duration-300 overflow-hidden ${
          isSearchOpen ? "max-h-20 opacity-100 pb-2" : "max-h-0 opacity-0"
        }`}
      >
        <div className="relative z-50" ref={searchRef}>
          <form onSubmit={handleSearchSubmit}>
            <Input
              id="search-input"
              placeholder="Search products..."
              className="w-full rounded-md pl-10 pr-10 mt-1 "
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => searchQuery && setShowSuggestions(true)}
            />
            {isLoading && (
              <div className="absolute right-3 top-3">
                <VscLoading className="animate-spin text-gray-400" size={18} />
              </div>
            )}
          </form>
          
          {/* Search Suggestions */}
          {showSuggestions && (
            <div 
              ref={suggestionsRef}
              className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg mt-1 z-50 max-h-60 overflow-y-auto"
            >
              {suggestions.length > 0 ? (
                suggestions.map((product) => (
                  <div
                    key={product.id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                    onClick={() => handleSuggestionClick(product)}
                  >
                    {product.images && product.images.length > 0 ? (
                      <Image
                        src={product.images[0].url}
                        alt={product.name}
                        width={40}
                        height={40}
                        className="rounded-md object-cover mr-3"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-200 rounded-md mr-3 flex items-center justify-center">
                        <Search size={16} className="text-gray-400" />
                      </div>
                    )}
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-gray-500">${product.price}</div>
                    </div>
                  </div>
                ))
              ) : hasSearched ? (
                <div className="px-4 py-3 text-gray-500 text-center">
                  No products found. Try different keywords.
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden px-4 pb-3 space-y-3">
          {user?.role === "ADMIN" && (
            <AdminComponent handleMenuOpen={handleMenuOpen} />
          )}
          <Link
            href="/products"
            onClick={handleMenuOpen}
            className={` hover:text-blue-600  flex items-center gap-5 ${pathname.includes("/products")?"text-rose-600":""}`}
          >
           <span> Products</span>{pathname.includes("/products")&&<span><Sparkles className="w-5 h-5"/> </span>}
          </Link>
          <Link
            href="/categories"
            onClick={handleMenuOpen}
            className={` hover:text-blue-600  flex items-center gap-5 ${pathname.includes("/categories")?"text-rose-600":""}`}
          >
             <span>Categories</span>{pathname.includes("/categories")&&<span><Sparkles className="w-5 h-5"/> </span>}
          </Link>
          <Link
            href="/about"
            onClick={handleMenuOpen}
            className={` hover:text-blue-600  flex items-center gap-5 ${pathname.includes("/about")?"text-rose-600":""}`}
          >
            <span> About</span>{pathname.includes("/about")&&<span><Sparkles className="w-5 h-5"/> </span>}
          </Link>
          <Link
            href="/contact"
            onClick={handleMenuOpen}
            className={` hover:text-blue-600  flex items-center gap-5 ${pathname.includes("/contact")?"text-rose-600":""}`}
          >
            <span> Contact</span>{pathname.includes("/contact")&&<span><Sparkles className="w-5 h-5"/> </span>}
          </Link>
          <Link
            href="/cart"
            onClick={handleMenuOpen}
            className={` hover:text-blue-600  flex items-center gap-5 ${pathname.includes("/cart")?"text-rose-600":""}`}
          >
            <span> Cart</span>{pathname.includes("/cart")&&<span><Sparkles className="w-5 h-5"/> </span>}
          </Link>
        </div>
      )}
    </header>
  );
}