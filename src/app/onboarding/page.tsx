'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Icons } from '@/components/Icons';
import { UPI_REGEX } from '@/lib/security';

export default function CreatorOnboardingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialType = searchParams.get('type') === 'AI_CREATOR' ? 'AI_CREATOR' : 'INFLUENCER';

  const [creatorType, setCreatorType] = useState<'INFLUENCER' | 'AI_CREATOR'>(initialType);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form State
  const [displayName, setDisplayName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80');
  const [bio, setBio] = useState('');
  const [city, setCity] = useState('Mumbai');
  const [niche, setNiche] = useState('Tech & Gadgets');
  const [followerCount, setFollowerCount] = useState<number>(45000);
  const [engagementRate, setEngagementRate] = useState<number>(5.2);
  const [startingPrice, setStartingPrice] = useState<number>(15000);
  const [upiId, setUpiId] = useState('');
  const [instagramHandle, setInstagramHandle] = useState('');
  const [youtubeHandle, setYoutubeHandle] = useState('');

  // Demographics State
  const [age18_24, setAge18_24] = useState<number>(50);
  const [age25_34, setAge25_34] = useState<number>(35);
  const [age35_44, setAge35_44] = useState<number>(10);
  const [genderMale, setGenderMale] = useState<number>(55);
  const [genderFemale, setGenderFemale] = useState<number>(45);

  // AI Creator Specific State
  const [aiTools, setAiTools] = useState<string[]>(['Runway Gen-3 Alpha', 'Kling AI 1.5']);
  const [avatarStyle, setAvatarStyle] = useState('Photorealistic Humanoid');
  const [promptSpecialty, setPromptSpecialty] = useState('Cinematic Lighting, Dynamic Camera Tracking, High Precision Product Physics');
  const [sampleVideoTitle, setSampleVideoTitle] = useState('Luxury Hologram Product Ad');
  const [sampleVideoPrompt, setSampleVideoPrompt] = useState('Cinematic 8k slow motion camera moving through iridescent liquid metal around wireless earbuds');
  const [commercialLicense, setCommercialLicense] = useState(true);

  // Package State
  const [packageTitle, setPackageTitle] = useState('Featured Instagram Reel / AI Video');
  const [packagePrice, setPackagePrice] = useState<number>(15000);
  const [packageDays, setPackageDays] = useState<number>(3);

  const availableAiTools = [
    'Runway Gen-3 Alpha',
    'Kling AI 1.5',
    'Midjourney v6.1',
    'ElevenLabs Voice Cloner',
    'Luma Dream Machine',
    'HeyGen Avatar',
    'ComfyUI Custom Workflows',
    'Sora Ready'
  ];

  const toggleAiTool = (tool: string) => {
    if (aiTools.includes(tool)) {
      setAiTools(aiTools.filter(t => t !== tool));
    } else {
      setAiTools([...aiTools, tool]);
    }
  };

  const isUpiValid = UPI_REGEX.test(upiId.trim());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!isUpiValid) {
      setErrorMsg('Please enter a valid UPI ID (e.g. name@okhdfcbank, user@upi)');
      return;
    }

    setLoading(true);

    try {
      const payload: any = {
        type: creatorType,
        avatarUrl,
        bio,
        city,
        followerCount: Number(followerCount),
        startingPrice: Number(startingPrice),
        upiId: upiId.trim(),
        pricingPackages: [
          {
            id: `pkg-${Date.now().toString(36)}`,
            title: packageTitle,
            description: `Full production delivered with commercial rights and revisions.`,
            price: Number(packagePrice),
            turnaroundDays: Number(packageDays),
            deliverables: [
              creatorType === 'AI_CREATOR' ? '4K Rendered AI Video' : '60s Reel Post',
              'Caption & Tagging',
              'Commercial License'
            ],
            revisions: 2
          }
        ]
      };

      if (creatorType === 'AI_CREATOR') {
        payload.studioName = displayName;
        payload.aiToolsList = aiTools;
        payload.avatarStyle = avatarStyle;
        payload.promptSpecialty = promptSpecialty;
        payload.commercialLicenseIncluded = commercialLicense;
        payload.audienceAge_18_24 = age18_24;
        payload.audienceAge_25_34 = age25_34;
        payload.audienceAge_35_plus = age35_44;
        payload.audienceGenderMale = genderMale;
        payload.audienceGenderFemale = genderFemale;
        payload.sampleVideos = [
          {
            title: sampleVideoTitle,
            prompt: sampleVideoPrompt,
            modelUsed: aiTools[0] || 'Runway Gen-3',
            aspectRatio: '9:16',
            durationSeconds: 15,
            thumbnailUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
            previewUrl: 'https://assets.mixkit.co/videos/preview/mixkit-futuristic-robotic-arm-moving-41484-large.mp4'
          }
        ];
      } else {
        payload.displayName = displayName;
        payload.niche = niche;
        payload.engagementRate = Number(engagementRate);
        payload.instagramHandle = instagramHandle;
        payload.youtubeHandle = youtubeHandle;
        payload.audienceAge_13_17 = 5;
        payload.audienceAge_18_24 = age18_24;
        payload.audienceAge_25_34 = age25_34;
        payload.audienceAge_35_44 = age35_44;
        payload.audienceAge_45_plus = 5;
        payload.audienceGenderMale = genderMale;
        payload.audienceGenderFemale = genderFemale;
        payload.audienceGenderOther = 0;
      }

      const res = await fetch('/api/creators', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || (data.errors ? JSON.stringify(data.errors) : 'Submission failed'));
      }

      setSuccessMsg('Profile registered successfully! Redirecting...');
      setTimeout(() => {
        router.push(`/creators/${data.creator.id}`);
      }, 1200);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error creating creator profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title Header */}
      <div className="text-center space-y-2.5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
          <Icons.Sparkles className="w-3.5 h-3.5" />
          <span>Creator Onboarding &amp; UPI Setup</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
          Create Your Creator Profile
        </h1>
        <p className="text-sm text-slate-500 max-w-xl mx-auto">
          Set up your city, audience demographics (age &amp; gender), follower tiers, niche, pricing, and payout UPI address.
        </p>
      </div>

      {/* Creator Type Selector Tabs */}
      <div className="grid grid-cols-2 gap-3 p-1.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <button
          type="button"
          onClick={() => setCreatorType('INFLUENCER')}
          className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            creatorType === 'INFLUENCER'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Icons.Video className="w-4 h-4" />
          <span>Human Influencer Profile</span>
        </button>

        <button
          type="button"
          onClick={() => setCreatorType('AI_CREATOR')}
          className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            creatorType === 'AI_CREATOR'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Icons.Bot className="w-4 h-4" />
          <span>AI Video Creator Profile (Specialized)</span>
        </button>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 space-y-8 shadow-sm">
        {/* Alerts */}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <Icons.AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <Icons.CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Section 1: Personal & Location Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center">1</span>
            <h3 className="text-base font-bold text-slate-900">Personal Details &amp; Location</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {creatorType === 'AI_CREATOR' ? 'Studio / Brand Name' : 'Full Name / Display Name'} *
              </label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder={creatorType === 'AI_CREATOR' ? 'e.g. Apex Neural Labs' : 'e.g. Aryan Sharma'}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 outline-none focus:bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                City / Location *
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 outline-none focus:bg-white focus:border-indigo-600"
              >
                <option value="Mumbai">Mumbai</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Delhi">Delhi NCR</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Pune">Pune</option>
                <option value="Chennai">Chennai</option>
                <option value="Kolkata">Kolkata</option>
                <option value="London">London</option>
                <option value="New York">New York</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Bio / Expertise Overview *
            </label>
            <textarea
              required
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell brands about your content style, key achievements, or AI video capabilities..."
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 outline-none focus:bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-100"
            />
          </div>

          {creatorType === 'INFLUENCER' ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Niche Category *
                </label>
                <select
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 outline-none focus:bg-white focus:border-indigo-600"
                >
                  <option value="Tech & Gadgets">Tech &amp; Gadgets</option>
                  <option value="Fashion & Lifestyle">Fashion &amp; Lifestyle</option>
                  <option value="Fitness & Wellness">Fitness &amp; Wellness</option>
                  <option value="Food & Culinary">Food &amp; Culinary</option>
                  <option value="Finance & Crypto">Finance &amp; Crypto</option>
                  <option value="Travel & Adventure">Travel &amp; Adventure</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Instagram Handle
                </label>
                <input
                  type="text"
                  value={instagramHandle}
                  onChange={(e) => setInstagramHandle(e.target.value)}
                  placeholder="@yourhandle"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 outline-none focus:bg-white focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  YouTube Channel
                </label>
                <input
                  type="text"
                  value={youtubeHandle}
                  onChange={(e) => setYoutubeHandle(e.target.value)}
                  placeholder="ChannelName"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 outline-none focus:bg-white focus:border-indigo-600"
                />
              </div>
            </div>
          ) : (
            /* AI Creator Specific Section */
            <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-4">
              <div className="flex items-center gap-2 text-purple-700 font-bold text-xs uppercase tracking-wide">
                <Icons.Bot className="w-4 h-4 text-purple-600" />
                <span>AI Video Creator Specialization</span>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">
                  Select AI Tools &amp; Video Engines Used:
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableAiTools.map(tool => {
                    const isSelected = aiTools.includes(tool);
                    return (
                      <button
                        type="button"
                        key={tool}
                        onClick={() => toggleAiTool(tool)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                          isSelected
                            ? 'bg-purple-600 text-white shadow-xs'
                            : 'bg-white text-slate-700 border border-slate-200 hover:border-purple-300'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '} {tool}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    AI Avatar Style
                  </label>
                  <input
                    type="text"
                    value={avatarStyle}
                    onChange={(e) => setAvatarStyle(e.target.value)}
                    placeholder="e.g. Photorealistic Humanoid, Virtual Spokesperson"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Prompt Specialty / Aesthetic
                  </label>
                  <input
                    type="text"
                    value={promptSpecialty}
                    onChange={(e) => setPromptSpecialty(e.target.value)}
                    placeholder="e.g. Macro Physics, Cyberpunk Lighting"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Sample AI Video Title &amp; Prompt
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={sampleVideoTitle}
                    onChange={(e) => setSampleVideoTitle(e.target.value)}
                    placeholder="Video Title"
                    className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900"
                  />
                  <input
                    type="text"
                    value={sampleVideoPrompt}
                    onChange={(e) => setSampleVideoPrompt(e.target.value)}
                    placeholder="Prompt recipe used..."
                    className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section 2: Audience Metrics, Age & Gender Demographics */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center">2</span>
            <h3 className="text-base font-bold text-slate-900">Audience Demographics &amp; Follower Reach</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Total Verified Followers
              </label>
              <input
                type="number"
                min={100}
                value={followerCount}
                onChange={(e) => setFollowerCount(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 outline-none focus:bg-white focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Engagement Rate (%)
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                max="100"
                value={engagementRate}
                onChange={(e) => setEngagementRate(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 outline-none focus:bg-white focus:border-indigo-600"
              />
            </div>
          </div>

          {/* Age Sliders */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <span className="text-xs font-bold text-slate-800 block">
              Audience Age Distribution (%):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Age 18-24: {age18_24}%</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={age18_24}
                  onChange={(e) => setAge18_24(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Age 25-34: {age25_34}%</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={age25_34}
                  onChange={(e) => setAge25_34(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Age 35+: {age35_44}%</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={age35_44}
                  onChange={(e) => setAge35_44(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>
            </div>
          </div>

          {/* Gender Split Sliders */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <span className="text-xs font-bold text-slate-800 block">
              Audience Gender Ratio (%):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] text-blue-700 font-bold block mb-1">Male: {genderMale}%</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={genderMale}
                  onChange={(e) => {
                    const m = Number(e.target.value);
                    setGenderMale(m);
                    setGenderFemale(100 - m);
                  }}
                  className="w-full accent-blue-600"
                />
              </div>
              <div>
                <label className="text-[11px] text-rose-700 font-bold block mb-1">Female: {genderFemale}%</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={genderFemale}
                  onChange={(e) => {
                    const f = Number(e.target.value);
                    setGenderFemale(f);
                    setGenderMale(100 - f);
                  }}
                  className="w-full accent-rose-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Pricing & Package Setup */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center">3</span>
            <h3 className="text-base font-bold text-slate-900">Collaboration Budget &amp; Package</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Package Title *
              </label>
              <input
                type="text"
                required
                value={packageTitle}
                onChange={(e) => setPackageTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 outline-none focus:bg-white focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Package Price (₹ INR) *
              </label>
              <input
                type="number"
                min={1000}
                required
                value={packagePrice}
                onChange={(e) => {
                  setPackagePrice(Number(e.target.value));
                  setStartingPrice(Number(e.target.value));
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 outline-none focus:bg-white focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Turnaround Time (Days) *
              </label>
              <input
                type="number"
                min={1}
                max={30}
                required
                value={packageDays}
                onChange={(e) => setPackageDays(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 outline-none focus:bg-white focus:border-indigo-600"
              />
            </div>
          </div>
        </div>

        {/* Section 4: UPI ID Setup for Payouts */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center">4</span>
            <h3 className="text-base font-bold text-slate-900">Escrow Settlement UPI ID</h3>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2.5">
            <div>
              <label className="text-xs font-bold text-emerald-800 block mb-1 flex items-center gap-1.5">
                <Icons.CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Enter Your UPI ID (Virtual Payment Address) *</span>
              </label>
              <input
                type="text"
                required
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="e.g. yourname@okhdfcbank, studio@icici, mobile@paytm"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-emerald-300 text-sm text-emerald-900 font-mono outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">
                Format: <code className="text-emerald-700 font-semibold">user@bankname</code>
              </span>
              {upiId && (
                <span className={`font-bold ${isUpiValid ? 'text-emerald-700' : 'text-rose-600'}`}>
                  {isUpiValid ? '✓ Valid UPI Address' : '✗ Invalid UPI Pattern'}
                </span>
              )}
            </div>

            <p className="text-[11px] text-emerald-800/80 leading-relaxed pt-1">
              When a brand approves your deliverables, PayU escrow releases your earnings directly to this UPI address automatically with 0% platform penalty.
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-2xl font-bold text-sm text-white shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-60 ${
              creatorType === 'AI_CREATOR'
                ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/20'
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20'
            }`}
          >
            {loading ? (
              <span>Saving Profile &amp; Configuring UPI...</span>
            ) : (
              <>
                <Icons.Check className="w-5 h-5" />
                <span>Publish Creator Profile &amp; Enable PayU Escrow</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
