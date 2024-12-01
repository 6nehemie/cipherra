'use client';

import { AlignJustify, X } from 'lucide-react';
import { useState } from 'react';

const NavbarMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="size-10 rounded-full border-2 border-custom-gray-2"
      >
        {!isOpen ? (
          <AlignJustify
            className="h-5 w-auto mx-auto text-custom-gray-1"
            strokeWidth={1.5}
          />
        ) : (
          <X
            className="h-5 w-auto mx-auto text-custom-gray-1"
            strokeWidth={1.5}
          />
        )}
      </button>
    </>
  );
};
export default NavbarMenu;
