import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Logo } from '@/components/common/Logo';

/**
 * Header component for the application
 * Displays navigation links, logo, and user authentication status
 */
const Header: React.FC = () => {
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-accent-midnightVelvet text-white py-4 px-6 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <Logo className="h-10 w-auto" />
            <span className="ml-2 text-xl font-heading font-bold">LorePin</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/challenges" className="hover:text-primary-light transition-colors">
            Challenges
          </Link>
          <Link href="/map" className="hover:text-primary-light transition-colors">
            Map
          </Link>
          <Link href="/leaderboard" className="hover:text-primary-light transition-colors">
            Leaderboard
          </Link>
          {user ? (
            <div className="flex items-center space-x-4">
              <Link href="/lorecoins" className="flex items-center hover:text-primary-light transition-colors">
                <span className="mr-1">{user.loreCoins || 0}</span>
                <span>LoreCoins</span>
              </Link>
              <div className="relative group">
                <Avatar
                  src={user.photoURL || ''}
                  alt={user.displayName || 'User'}
                  className="h-8 w-8 cursor-pointer"
                />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                  <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Profile
                  </Link>
                  <Link href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Settings
                  </Link>
                  <button
                    onClick={signOut}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost">Log In</Button>
              </Link>
              <Link href="/signup">
                <Button>Sign Up</Button>
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {mobileMenuOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-accent-midnightVelvet px-6 py-4 space-y-4">
          <Link href="/challenges" className="block hover:text-primary-light transition-colors">
            Challenges
          </Link>
          <Link href="/map" className="block hover:text-primary-light transition-colors">
            Map
          </Link>
          <Link href="/leaderboard" className="block hover:text-primary-light transition-colors">
            Leaderboard
          </Link>
          {user ? (
            <>
              <Link href="/lorecoins" className="block hover:text-primary-light transition-colors">
                <span className="mr-1">{user.loreCoins || 0}</span>
                <span>LoreCoins</span>
              </Link>
              <Link href="/profile" className="block hover:text-primary-light transition-colors">
                Profile
              </Link>
              <Link href="/settings" className="block hover:text-primary-light transition-colors">
                Settings
              </Link>
              <button
                onClick={signOut}
                className="block w-full text-left hover:text-primary-light transition-colors"
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className="flex flex-col space-y-2">
              <Link href="/login">
                <Button variant="ghost" className="w-full">Log In</Button>
              </Link>
              <Link href="/signup">
                <Button className="w-full">Sign Up</Button>
              </Link>
            </div>
          )}
        </nav>
      )}
    </header>
  );
};

export default Header; 