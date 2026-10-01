'use client';

import React, { useState } from 'react';
import { Icons } from './Icons';
import { CustomDropdown, DropdownOption } from './CustomDropdown';

export interface FilterState {
  search: string;
  type: string;
  city: string;
  niche: string;
  followerRange: string;
  budgetRange: string;
  genderFocus: string;
  dominantAge: string;
}

interface FilterBarProps {
  filters: FilterState;
  onChange: (newFilters: FilterState) => void;
  onReset: () => void;
  totalResults: number;
}

const CITY_OPTIONS: DropdownOption[] = [
  { id: 'ALL', label: 'All Locations' },
  { id: 'Bangalore', label: 'Bangalore' },
  { id: 'Mumbai', label: 'Mumbai' },
  { id: 'Delhi', label: 'Delhi' },
  { id: 'Hyderabad', label: 'Hyderabad' },
  { id: 'Pune', label: 'Pune' },
  { id: 'London', label: 'London' }
];

const NICHE_OPTIONS: DropdownOption[] = [
  { id: 'ALL', label: 'All Categories' },
  { id: 'Tech & Gadgets', label: 'Tech & Gadgets' },
  { id: 'Fashion & Lifestyle', label: 'Fashion & Lifestyle' },
  { id: 'Fitness & Wellness', label: 'Fitness & Wellness' },
  { id: 'Food & Culinary', label: 'Food & Culinary' },
  { id: 'Finance & Crypto', label: 'Finance & Crypto' },
  { id: 'AI Video & VFX', label: 'AI Video & VFX' }
];

const FOLLOWER_OPTIONS: DropdownOption[] = [
  { id: 'ALL', label: 'Any Audience Size' },
  { id: 'NANO', label: '1k – 20k (Nano)' },
  { id: 'MICRO', label: '20k – 100k (Micro)' },
  { id: 'MID', label: '100k – 500k (Mid-Tier)' },
  { id: 'MACRO', label: '500k+ (Macro)' }
];

const BUDGET_OPTIONS: DropdownOption[] = [
  { id: 'ALL', label: 'Any Budget' },
  { id: 'TIER_1', label: 'Under ₹20,000' },
  { id: 'TIER_2', label: '₹20,000 – ₹50,000' },
  { id: 'TIER_3', label: '₹50,000 – ₹1,00,000' },
  { id: 'TIER_4', label: '₹1,00,000+' }
];

const AGE_OPTIONS: DropdownOption[] = [
  { id: 'ALL', label: 'Any Age Group' },
  { id: 'GEN_Z', label: 'Gen-Z (18–24 > 45%)' },
  { id: 'MILLENNIAL', label: 'Millennial (25–34 > 35%)' },
  { id: 'MATURE', label: 'Mature (35+ > 15%)' }
];

const GENDER_OPTIONS: DropdownOption[] = [
  { id: 'ALL', label: 'Any Gender Split' },
  { id: 'MALE_MAJORITY', label: 'Mostly Male (>60%)' },
  { id: 'FEMALE_MAJORITY', label: 'Mostly Female (>60%)' },
  { id: 'BALANCED', label: 'Balanced (40–60%)' }
];

export function FilterBar({ filters, onChange, onReset, totalResults }: FilterBarProps) {
  const [mobileExpanded, setMobileExpanded] = useState(false);

  const update = (key: keyof FilterState, val: string) => {
    onChange({ ...filters, [key]: val });
  };

  const activeFiltersCount = [
    filters.city !== 'ALL',
    filters.niche !== 'ALL',
    filters.followerRange !== 'ALL',
    filters.budgetRange !== 'ALL',
    filters.genderFocus !== 'ALL',
    filters.dominantAge !== 'ALL',
  ].filter(Boolean).length;

  return (
    <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-subtle space-y-4">
      {/* Top Search & Type Row */}
      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <Icons.Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by creator name, niche, city, or AI engine..."
            value={filters.search}
            onChange={(e) => update('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-50/80 border border-zinc-200/90 focus:bg-white text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all shadow-subtle"
          />
        </div>

        {/* Creator Type Pill Selector */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-zinc-100/80 border border-zinc-200/70 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => update('type', 'ALL')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              filters.type === 'ALL'
                ? 'bg-white text-zinc-950 shadow-xs'
                : 'text-zinc-600 hover:text-zinc-950'
            }`}
          >
            All Creators
          </button>
          <button
            type="button"
            onClick={() => update('type', 'INFLUENCER')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all ${
              filters.type === 'INFLUENCER'
                ? 'bg-zinc-900 text-white shadow-xs'
                : 'text-zinc-600 hover:text-zinc-950'
            }`}
          >
            <Icons.Video className="w-3.5 h-3.5" />
            <span>Influencers</span>
          </button>
          <button
            type="button"
            onClick={() => update('type', 'AI_CREATOR')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all ${
              filters.type === 'AI_CREATOR'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'text-zinc-600 hover:text-zinc-950'
            }`}
          >
            <Icons.Bot className="w-3.5 h-3.5" />
            <span>AI Studios</span>
          </button>
        </div>

        {/* Mobile Filter Toggle Button */}
        <div className="lg:hidden flex items-center justify-between pt-1">
          <button
            type="button"
            onClick={() => setMobileExpanded(!mobileExpanded)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 text-xs font-semibold text-zinc-800 border border-zinc-200"
          >
            <Icons.Sliders className="w-3.5 h-3.5" />
            <span>{mobileExpanded ? 'Hide Filters' : 'More Filters'}</span>
            {activeFiltersCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-zinc-900 text-white text-[10px] flex items-center justify-center font-bold">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {activeFiltersCount > 0 && (
            <button
              type="button"
              onClick={onReset}
              className="text-xs font-medium text-zinc-500 hover:text-zinc-900 underline"
            >
              Reset ({activeFiltersCount})
            </button>
          )}
        </div>
      </div>

      {/* Advanced Filter Criteria Dropdowns Grid */}
      <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 pt-3.5 border-t border-zinc-100 ${
        mobileExpanded ? 'grid' : 'hidden lg:grid'
      }`}>
        <CustomDropdown
          label="City / Location"
          value={filters.city}
          options={CITY_OPTIONS}
          onChange={(val) => update('city', val)}
        />

        <CustomDropdown
          label="Niche / Category"
          value={filters.niche}
          options={NICHE_OPTIONS}
          onChange={(val) => update('niche', val)}
        />

        <CustomDropdown
          label="Audience Size"
          value={filters.followerRange}
          options={FOLLOWER_OPTIONS}
          onChange={(val) => update('followerRange', val)}
        />

        <CustomDropdown
          label="Budget Package"
          value={filters.budgetRange}
          options={BUDGET_OPTIONS}
          onChange={(val) => update('budgetRange', val)}
        />

        <CustomDropdown
          label="Target Age Group"
          value={filters.dominantAge}
          options={AGE_OPTIONS}
          onChange={(val) => update('dominantAge', val)}
        />

        <CustomDropdown
          label="Gender Demographics"
          value={filters.genderFocus}
          options={GENDER_OPTIONS}
          onChange={(val) => update('genderFocus', val)}
        />
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between pt-2 text-xs text-zinc-500 border-t border-zinc-100">
        <div className="flex items-center gap-2 flex-wrap">
          <span>Found <strong className="text-zinc-950 font-bold">{totalResults}</strong> creators</span>
          {filters.type === 'AI_CREATOR' && (
            <span className="text-[11px] font-semibold text-purple-800 bg-purple-50/80 px-2.5 py-0.5 rounded-full border border-purple-200/70">
              ⚡ Filtered by Generative AI Studios
            </span>
          )}
          {activeFiltersCount > 0 && (
            <span className="text-[11px] font-medium text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded-full">
              {activeFiltersCount} active filter{activeFiltersCount > 1 ? 's' : ''}
            </span>
          )}
        </div>

        {activeFiltersCount > 0 && (
          <button
            type="button"
            onClick={onReset}
            className="text-xs text-zinc-500 hover:text-zinc-950 transition-colors font-medium underline hidden sm:inline-block"
          >
            Reset Filters
          </button>
        )}
      </div>
    </div>
  );
}
