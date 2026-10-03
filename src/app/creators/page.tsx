'use client';

import React, { useState, useEffect } from 'react';
import { CreatorItem } from '@/lib/types';
import { FilterBar, FilterState } from '@/components/FilterBar';
import { CreatorCard } from '@/components/CreatorCard';
import { Icons } from '@/components/Icons';

export default function CreatorsExplorePage() {
  const [creators, setCreators] = useState<CreatorItem[]>([]);
  const [loading, setLoading] = useState(true);

  const initialFilters: FilterState = {
    search: '',
    type: 'ALL',
    city: 'ALL',
    niche: 'ALL',
    followerRange: 'ALL',
    budgetRange: 'ALL',
    genderFocus: 'ALL',
    dominantAge: 'ALL'
  };

  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const fetchCreators = async (filterQuery: FilterState) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterQuery.search) params.set('search', filterQuery.search);
      if (filterQuery.type !== 'ALL') params.set('type', filterQuery.type);
      if (filterQuery.city !== 'ALL') params.set('city', filterQuery.city);
      if (filterQuery.niche !== 'ALL') params.set('niche', filterQuery.niche);
      if (filterQuery.genderFocus !== 'ALL') params.set('genderFocus', filterQuery.genderFocus);
      if (filterQuery.dominantAge !== 'ALL') params.set('dominantAge', filterQuery.dominantAge);

      if (filterQuery.followerRange === 'NANO') {
        params.set('minFollowers', '1000');
        params.set('maxFollowers', '20000');
      } else if (filterQuery.followerRange === 'MICRO') {
        params.set('minFollowers', '20000');
        params.set('maxFollowers', '100000');
      } else if (filterQuery.followerRange === 'MID') {
        params.set('minFollowers', '100000');
        params.set('maxFollowers', '500000');
      } else if (filterQuery.followerRange === 'MACRO') {
        params.set('minFollowers', '500000');
      }

      if (filterQuery.budgetRange === 'TIER_1') {
        params.set('maxPrice', '20000');
      } else if (filterQuery.budgetRange === 'TIER_2') {
        params.set('minPrice', '20000');
        params.set('maxPrice', '50000');
      } else if (filterQuery.budgetRange === 'TIER_3') {
        params.set('minPrice', '50000');
        params.set('maxPrice', '100000');
      } else if (filterQuery.budgetRange === 'TIER_4') {
        params.set('minPrice', '100000');
      }

      const res = await fetch(`/api/creators?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setCreators(data.creators);
      }
    } catch (err) {
      console.error('Failed to fetch creators', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCreators(filters);
  }, [filters]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="space-y-1">
        <span className="text-[11px] font-semibold text-zinc-600 tracking-wider uppercase">Directory</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight">
          Discover Verified Creators
        </h1>
        <p className="text-xs text-zinc-500">
          Filter by City, Audience Demographics, Follower Range &amp; Budget. Pay with PayU Escrow.
        </p>
      </div>

      <FilterBar
        filters={filters}
        onChange={setFilters}
        onReset={() => setFilters(initialFilters)}
        totalResults={creators.length}
      />

      {loading ? (
        <div className="py-24 text-center space-y-3">
          <div className="w-8 h-8 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-zinc-500 font-medium">Loading creators...</p>
        </div>
      ) : creators.length === 0 ? (
        <div className="py-20 text-center rounded-2xl bg-white border border-zinc-200/80 shadow-subtle space-y-4">
          <Icons.Filter className="w-9 h-9 text-zinc-300 mx-auto" />
          <h3 className="text-base font-bold text-zinc-950">No creators found matching criteria</h3>
          <button
            onClick={() => setFilters(initialFilters)}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-900 text-white hover:bg-zinc-800"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between text-xs text-zinc-500 md:hidden mb-2 px-1">
            <span className="flex items-center gap-1 font-medium">
              <span>Swipe cards horizontally</span>
              <span>&rarr;</span>
            </span>
            <span className="text-[11px] bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded-full font-semibold">
              {creators.length} creators
            </span>
          </div>
          <div className="flex md:grid overflow-x-auto md:overflow-x-visible snap-x snap-mandatory no-scrollbar pb-5 md:pb-0 gap-4 sm:gap-6 -mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-0 md:grid-cols-2 lg:grid-cols-3">
            {creators.map(creator => (
              <div key={creator.id} className="w-[84vw] sm:w-[350px] md:w-auto shrink-0 snap-center md:snap-align-none flex flex-col">
                <CreatorCard creator={creator} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
