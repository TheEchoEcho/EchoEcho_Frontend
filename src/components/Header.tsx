'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import clsx from 'clsx';
import { House, CircleDollarSign, User } from 'lucide-react';

function Header() {
  const pathname = usePathname()

  const navItems = [
    { href: '/', label: 'Home', icon: House },
    { href: '/market', label: 'Market', icon: CircleDollarSign },
    { href: '/mine', label: 'Mine', icon: User },
  ]
  return (
    <div className='bg-gradient-to-r from-blue-200 via-blue-300 to-blue-600 h-16 px-4 flex justify-between items-center'>
      <ul className='flex'>
        {
          navItems.map(({ href, label, icon }) => {
            const Icon = icon
            return <li key={href}>
              <Link
                href={href}
                className={clsx(
                  'flex items-center h-16 px-4 text-xl text-blue-800',
                  pathname === href && 'font-bold border-b-2 border-blue-800'
                )}
              >
                <Icon className='pr-1' size={28} />
                {label}
              </Link>
            </li>
          })
        }
      </ul>
      <ConnectButton />
    </div>
  );
}

export default Header;