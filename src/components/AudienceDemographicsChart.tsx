import React from 'react';
import { AudienceAgeBreakdown, AudienceGenderBreakdown } from '@/lib/types';
import { Icons } from './Icons';

interface AudienceDemographicsChartProps {
  age: AudienceAgeBreakdown;
  gender: AudienceGenderBreakdown;
  compact?: boolean;
}

export function AudienceDemographicsChart({ age, gender, compact = false }: AudienceDemographicsChartProps) {
  const ageBrackets = [
    { label: '13-17', val: age.age13_17 },
    { label: '18-24', val: age.age18_24 },
    { label: '25-34', val: age.age25_34 },
    { label: '35-44', val: age.age35_44 },
    { label: '45+', val: age.age45_plus },
  ];

  if (compact) {
    return (
      <div className="space-y-2 text-xs">
        {/* Compact Gender Bar */}
        <div>
          <div className="flex justify-between text-[11px] font-medium text-zinc-500 mb-1.5">
            <span className="flex items-center gap-1.5 text-zinc-700">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
              Male {gender.male}%
            </span>
            <span className="flex items-center gap-1.5 text-zinc-700">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              Female {gender.female}%
            </span>
          </div>
          <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden flex">
            <div 
              style={{ width: `${gender.male}%` }} 
              className="bg-indigo-600 h-full transition-all duration-500 rounded-l-full" 
            />
            <div 
              style={{ width: `${gender.female}%` }} 
              className="bg-rose-400 h-full transition-all duration-500" 
            />
            {gender.other > 0 && (
              <div 
                style={{ width: `${gender.other}%` }} 
                className="bg-purple-400 h-full transition-all duration-500 rounded-r-full" 
              />
            )}
          </div>
        </div>

        {/* Compact Top Age Group */}
        <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-0.5">
          <span>Top Demographic</span>
          <span className="font-semibold text-zinc-900 bg-zinc-100/90 px-2 py-0.5 rounded-md border border-zinc-200/60">
            18–24 ({age.age18_24}%)
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-subtle space-y-6">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Icons.Users className="w-4 h-4 text-zinc-700" />
            <h4 className="text-sm font-bold text-zinc-900 tracking-tight">Audience Demographics</h4>
          </div>
          <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-600 border border-zinc-200/60">
            Verified Data
          </span>
        </div>

        {/* Gender Breakdown Bar */}
        <div className="h-2.5 w-full bg-zinc-100 rounded-full overflow-hidden flex">
          <div 
            style={{ width: `${gender.male}%` }} 
            className="bg-indigo-600 h-full transition-all duration-500" 
            title={`Male: ${gender.male}%`}
          />
          <div 
            style={{ width: `${gender.female}%` }} 
            className="bg-rose-400 h-full transition-all duration-500" 
            title={`Female: ${gender.female}%`}
          />
          {gender.other > 0 && (
            <div 
              style={{ width: `${gender.other}%` }} 
              className="bg-purple-400 h-full transition-all duration-500" 
              title={`Other: ${gender.other}%`}
            />
          )}
        </div>

        <div className="flex justify-between items-center mt-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-600 inline-block" />
            <span className="text-zinc-600">Male</span>
            <span className="text-zinc-900 font-bold">{gender.male}%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-400 inline-block" />
            <span className="text-zinc-600">Female</span>
            <span className="text-zinc-900 font-bold">{gender.female}%</span>
          </div>
          {gender.other > 0 && (
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-400 inline-block" />
              <span className="text-zinc-600">Other</span>
              <span className="text-zinc-900 font-bold">{gender.other}%</span>
            </div>
          )}
        </div>
      </div>

      {/* Age Group Distribution */}
      <div>
        <h5 className="text-xs font-bold text-zinc-900 uppercase tracking-wider mb-3">
          Age Group Distribution
        </h5>
        <div className="space-y-2.5">
          {ageBrackets.map((bracket) => (
            <div key={bracket.label} className="space-y-1">
              <div className="flex justify-between text-xs text-zinc-600">
                <span className="font-medium text-zinc-700">{bracket.label} yrs</span>
                <span className="font-semibold text-zinc-900">{bracket.val}%</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                <div 
                  style={{ width: `${bracket.val}%` }} 
                  className="bg-zinc-800 h-full rounded-full transition-all duration-500"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
