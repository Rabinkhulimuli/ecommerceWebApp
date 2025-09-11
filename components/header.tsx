'use client';

import { useState, useEffect, useCallback, useRef, FormEvent, ChangeEvent, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Search, ShoppingCart, User, Activity, Sparkles, EarthLock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { VscLoading } from 'react-icons/vsc';
import AdminComponent from './admin/AdminComponent';
import { useSession, signOut } from 'next-auth/react';
import { useGetCartItems } from '@/services/cart.service';
import { sessionUsertype } from '@/lib/types';
import { debounce } from '@/lib/debounce';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SuggestionProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const pathname = usePathname();
  const { data, status } = useSession();
  const [user, setUser] = useState<sessionUsertype>(null);
  const router = useRouter();
  const { cartItems } = useGetCartItems(user?.id ?? '');
  const searchRef = useRef<HTMLDivElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const suggestionList = useMemo(() => suggestions, [suggestions]);

  const navArray = [
    {
      id: 0,
      name: 'Product',
      url: '/products',
    },
    {
      id: 1,
      name: 'Categories',
      url: '/categories',
    },
    {
      id: 2,
      name: 'About',
      url: '/about',
    },
    {
      id: 3,
      name: 'Contact',
      url: '/contact',
    },
  ];
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

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  console.log('suggestion', suggestions);
  const handleMenuOpen = () => setIsMenuOpen(!isMenuOpen);

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      // Focus on input when search is opened
      setTimeout(() => {
        const input = document.getElementById('search-input');
        if (input) input.focus();
      }, 500);
    } else {
      setSearchQuery('');
      setSuggestions([]);
      setShowSuggestions(false);
      setHasSearched(false);
    }
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
      const response = await fetch(
        `/api/products/filter?search=${encodeURIComponent(query)}&limit=5&suggest=true`
      );
      if (response.ok) {
        const data = await response.json();
        console.log('suggestion data', data);
        if (JSON.stringify(data.data) !== JSON.stringify(suggestions)) {
          setSuggestions(data.data || []);
          console.log('suggestion data', data.data);
          setShowSuggestions(true);
        }
      }
    } catch (error) {
      console.error('Error fetching search suggestions:', error);
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
    setShowSuggestions(false);
    const cleanId = product.id.replace(/[{}]/g, ''); // remove { or }
    router.push(`/products/${cleanId}`);
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

  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null;

    const handleScroll = () => {
      if (timeout) return;
      timeout = setTimeout(() => {
        if (window.scrollY === 0) {
          setShowNavbar(true);
        } else if (window.scrollY > lastScrollY) {
          setShowNavbar(false);
        } else {
          setShowNavbar(true);
        }
        setLastScrollY(window.scrollY);
        timeout = null;
      }, 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`fixed top-0 z-40 w-full border-b shadow-md backdrop-blur-md transition-transform duration-300 ${
        showNavbar ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className='mx-auto flex items-center justify-between px-4 py-2'>
        {/* Logo */}
        <Link href='/' className='flex items-center gap-2'>
          <div className='flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border bg-yellow-100'>
            <Image
              src='/logo.png'
              alt='logo'
              width={32}
              height={32}
              className='rounded-full object-cover'
            />
          </div>
          <span className='text-xl font-bold text-[#670D2F]'>PRIVE</span>
          {pathname === '/' && (
            <span>
              <EarthLock className='h-5 w-5 text-rose-600' />{' '}
            </span>
          )}
        </Link>
        {/* Desktop Nav */}
        <div className='hidden justify-center gap-8 py-2 lg:flex'>
          {user?.role === 'ADMIN' && <AdminComponent />}

          {navArray.map(list => (
            <span key={list.id}>
              <Link href={list.url} className='hover:text-blue-600'>
                {list.name}
              </Link>
              {
                <span
                  className={`transform transition-all duration-700 ease-in-out ${
                    pathname === list.url ? 'opacity-100' : 'opacity-0'
                  } flex gap-1`}
                >
                  <span
                    className={`transform transition-all duration-700 ease-in-out ${
                      pathname === list.url ? 'w-5' : 'w-1'
                    } block h-1 rounded-full bg-red-500`}
                  >
                    {' '}
                  </span>
                  <span className='block h-1 w-1 rounded-full bg-red-500'> </span>
                  <span className='block h-1 w-1 rounded-full bg-red-500'> </span>
                  <span className='block h-1 w-1 rounded-full bg-red-500'> </span>
                </span>
              }
            </span>
          ))}
        </div>
        <div className='flex items-center gap-2'>
          {/* Right Icons */}
          <div className='flex items-center gap-2'>
            {/* Search icon */}
            <Button variant='ghost' size='icon' onClick={toggleSearch}>
              <Search size={22} />
            </Button>

            {/* Cart */}
            <Link href='/products/cart' className='relative hidden sm:block'>
              <Button variant='ghost' size='icon'>
                <ShoppingCart size={20} />
                {itemCounts() !== null && (
                  <Badge className='absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs'>
                    {itemCounts()}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* User */}

            {user ? (
              status !== 'loading' ? (
                <div className='relative'>
                  <Button
                    onClick={() => setOpenProfile(!openProfile)}
                    variant='ghost'
                    size='icon'
                    className='h-10 w-10 overflow-hidden rounded-full p-0'
                  >
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt='profile'
                        width={40}
                        height={40}
                        className='aspect-square rounded-full object-cover'
                      />
                    ) : (
                      <User size={20} />
                    )}
                  </Button>
                  {openProfile && (
                    <div className='items border-1 absolute right-5 top-10 flex flex-col space-y-2 text-nowrap rounded-md bg-white px-4 py-2 shadow-md'>
                      <Link
                        className='w-full rounded-md border px-4 py-1 font-semibold text-black/70 hover:bg-blue-50'
                        onClick={() => setOpenProfile(false)}
                        href='/profile'
                      >
                        Profile
                      </Link>
                      <Link
                        className='w-full rounded-md border px-4 py-1 font-semibold text-black/70 hover:bg-blue-50'
                        onClick={() => setOpenProfile(false)}
                        href='/orders'
                      >
                        Orders
                      </Link>
                      <Link
                        className='w-full rounded-md border px-4 py-1 font-semibold text-black/70 hover:bg-blue-50'
                        onClick={() => setOpenProfile(false)}
                        href='/products/wishlist'
                      >
                        WishList
                      </Link>
                      <button
                        className='w-full rounded-md border px-4 py-1 font-semibold text-black/70 hover:bg-blue-50'
                        onClick={() => {
                          signOut({ callbackUrl: '/auth/sign-in' });
                          setOpenProfile(false);
                        }}
                      >
                        {' '}
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <VscLoading className='animate-spin' />
              )
            ) : (
              <Link href='/auth/sign-in'>
                <Button variant='outline' size='sm'>
                  Sign In
                </Button>
              </Link>
            )}
          </div>
          {/* Menu button */}
          <Button
            variant='ghost'
            size='icon'
            className='border bg-blue-50/70 lg:hidden'
            onClick={handleMenuOpen}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} className='' />}
          </Button>
        </div>
      </div>

      {/* Animated Search Bar */}
      <div
        className={`overflow-hidden px-4 transition-all duration-300 ${
          isSearchOpen ? 'max-h-20 pb-2 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className='relative z-50' ref={searchRef}>
          <form onSubmit={handleSearchSubmit}>
            <Input
              id='search-input'
              placeholder='Search products...'
              className='mt-1 w-full rounded-md pl-10 pr-10'
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => searchQuery && setShowSuggestions(true)}
            />
            {isLoading && (
              <div className='absolute right-3 top-3'>
                <VscLoading className='animate-spin text-gray-400' size={18} />
              </div>
            )}
          </form>

          {/* Search Suggestions */}
          {showSuggestions && (
            <div
              ref={suggestionsRef}
              className='top-30 fixed left-0 right-0 z-40 mx-4 mt-1 max-h-[400px] overflow-hidden overflow-y-scroll rounded-md border border-gray-200 bg-white shadow-lg'
            >
              {suggestions.length > 0 ? (
                suggestions.map(product => (
                  <div
                    key={product.id}
                    className='flex cursor-pointer items-center px-4 py-2 hover:bg-gray-100'
                    onClick={() => handleSuggestionClick(product)}
                  >
                    {product.images && product.images.length > 0 ? (
                      <Image
                        src={product.images[0].url}
                        alt={product.name}
                        width={40}
                        height={40}
                        className='mr-3 rounded-md object-cover'
                      />
                    ) : (
                      <div className='mr-3 flex h-10 w-10 items-center justify-center rounded-md bg-gray-200'>
                        <Search size={16} className='text-gray-400' />
                      </div>
                    )}
                    <div>
                      <div className='font-medium'>{product.name}</div>
                      <div className='text-sm text-gray-500'>${product.price}</div>
                    </div>
                  </div>
                ))
              ) : hasSearched ? (
                <div className='px-4 py-3 text-center text-gray-500'>
                  No products found. Try different keywords.
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className='space-y-3 px-4 pb-3 lg:hidden'>
          {user?.role === 'ADMIN' && <AdminComponent handleMenuOpen={handleMenuOpen} />}
          <Link
            href='/products'
            onClick={handleMenuOpen}
            className={`flex items-center gap-5 hover:text-blue-600 ${
              pathname == '/products' ? 'text-rose-600' : ''
            }`}
          >
            <span> Products</span>
            {pathname == '/products' && (
              <span>
                <Sparkles className='h-5 w-5' />{' '}
              </span>
            )}
          </Link>
          <Link
            href='/categories'
            onClick={handleMenuOpen}
            className={`flex items-center gap-5 hover:text-blue-600 ${
              pathname.includes('/categories') ? 'text-rose-600' : ''
            }`}
          >
            <span>Categories</span>
            {pathname.includes('/categories') && (
              <span>
                <Sparkles className='h-5 w-5' />{' '}
              </span>
            )}
          </Link>
          <Link
            href='/about'
            onClick={handleMenuOpen}
            className={`flex items-center gap-5 hover:text-blue-600 ${
              pathname.includes('/about') ? 'text-rose-600' : ''
            }`}
          >
            <span> About</span>
            {pathname.includes('/about') && (
              <span>
                <Sparkles className='h-5 w-5' />{' '}
              </span>
            )}
          </Link>
          <Link
            href='/contact'
            onClick={handleMenuOpen}
            className={`flex items-center gap-5 hover:text-blue-600 ${
              pathname.includes('/contact') ? 'text-rose-600' : ''
            }`}
          >
            <span> Contact</span>
            {pathname.includes('/contact') && (
              <span>
                <Sparkles className='h-5 w-5' />{' '}
              </span>
            )}
          </Link>
          <Link
            href='/products/cart'
            onClick={handleMenuOpen}
            className={`flex items-center gap-5 hover:text-blue-600 ${
              pathname == '/products/cart' ? 'text-rose-600' : ''
            }`}
          >
            <span> Cart</span>
            {pathname == '/products/cart' && (
              <span>
                <Sparkles className='h-5 w-5' />{' '}
              </span>
            )}
          </Link>
          <Link
            href='/products/wishlist'
            onClick={handleMenuOpen}
            className={`flex items-center gap-5 hover:text-blue-600 ${
              pathname == '/products/wishlist' ? 'text-rose-600' : ''
            }`}
          >
            <span> Wishlist</span>
            {pathname == '/products/wishlist' && (
              <span>
                <Sparkles className='h-5 w-5' />{' '}
              </span>
            )}
          </Link>
        </div>
      )}
    </header>
  );
}
