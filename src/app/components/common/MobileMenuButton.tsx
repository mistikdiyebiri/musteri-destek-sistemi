"use client";

import { useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

interface MobileMenuButtonProps {
  isOpen: boolean;
  onClick: () => void;
  className?: string;
}

export default function MobileMenuButton({ isOpen, onClick, className = '' }: MobileMenuButtonProps) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 ${className}`}
      aria-expanded="false"
      onClick={onClick}
    >
      <span className="sr-only">
        {isOpen ? 'Menüyü kapat' : 'Menüyü aç'}
      </span>
      {isOpen ? (
        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
      ) : (
        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
      )}
    </button>
  );
}