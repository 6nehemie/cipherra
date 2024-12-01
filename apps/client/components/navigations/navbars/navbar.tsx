'use client';

import Navigate from '@/components/buttons/navigate';
import Cipherra from '@/components/icons/logos/cipherra';
import { navbarNavigation } from '@/constants';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import NavbarMenu from '../menus/navbar-menu';

const Navbar = () => {
  const pathName = usePathname();

  return (
    <nav className="grid grid-cols-2 md:grid-cols-3 p-side py-4 md:py-6">
      <div>
        <Cipherra />
      </div>

      <div className="max-md:hidden justify-self-center space-x-6">
        {navbarNavigation.map((nav) => {
          return (
            <Navigate
              key={nav.label}
              href={nav.href}
              label={nav.label}
              active={pathName === nav.href}
            />
          );
        })}
      </div>

      <div className="max-md:hidden justify-self-end space-x-6">
        <Navigate href="/sign-in" label="Sign-In" />

        <Link
          href="/sign-up"
          className="text-sm px-5 py-3 border-[2px] border-custom-gray-2 rounded-full hover:border-custom-gray-1 hover:text-white duration-200 transition-colors font-medium"
        >
          Sign up
        </Link>
      </div>

      <div className="md:hidden justify-self-end space-x-6">
        <NavbarMenu />
      </div>
    </nav>
  );
};
export default Navbar;
