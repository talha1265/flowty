'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Icons } from './Icons';

export interface DropdownOption {
  id: string;
  label: string;
}

interface CustomDropdownProps {
  label: string;
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function CustomDropdown({
  label,
  value,
  options,
  onChange,
  className = ''
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.id === value) || options[0];
  const isFiltered = value !== 'ALL';

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-600 block mb-1.5 select-none">
        {label}
      </label>

      {/* Dropdown Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-xs font-medium border transition-all select-none text-left ${
          isFiltered
            ? 'bg-zinc-50 border-zinc-900 text-zinc-950 shadow-xs'
            : 'bg-white border-zinc-200/90 text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50/50 shadow-subtle'
        }`}
      >
        <span className="truncate flex items-center gap-1.5">
          {isFiltered && <span className="w-1.5 h-1.5 rounded-full bg-zinc-900 flex-shrink-0" />}
          <span className={isFiltered ? 'font-semibold text-zinc-950' : 'text-zinc-700'}>
            {selectedOption?.label || value}
          </span>
        </span>
        <Icons.ChevronDown
          className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 flex-shrink-0 ${
            isOpen ? 'rotate-180 text-zinc-700' : ''
          }`}
        />
      </button>

      {/* Floating Menu Popover */}
      {isOpen && (
        <div
          role="listbox"
          className="absolute left-0 mt-1.5 w-full min-w-[200px] max-h-60 overflow-y-auto rounded-xl bg-white border border-zinc-200/90 shadow-[0_12px_30px_-5px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.04)] py-1.5 z-40 animate-in fade-in zoom-in-95 duration-150"
        >
          {options.map((opt) => {
            const isSelected = opt.id === value;
            return (
              <button
                key={opt.id}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(opt.id);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2 text-xs flex items-center justify-between text-left transition-colors ${
                  isSelected
                    ? 'bg-zinc-100 font-semibold text-zinc-950'
                    : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950'
                }`}
              >
                <span className="truncate">{opt.label}</span>
                {isSelected && (
                  <Icons.Check className="w-3.5 h-3.5 text-zinc-900 flex-shrink-0 ml-2" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
