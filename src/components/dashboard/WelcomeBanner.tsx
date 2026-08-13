import React from 'react';

interface WelcomeBannerProps { nickname: string; }

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ nickname }) => (
  <div className="relative overflow-hidden rounded-3xl border border-[#dfe9e1] bg-white p-8 shadow-[0_24px_55px_-42px_rgba(19,38,23,.45)] sm:p-10">
    <div className="pointer-events-none absolute -right-20 -top-36 h-80 w-80 rounded-full bg-[#d9ff75]/55 blur-3xl" />
    <div className="pointer-events-none absolute bottom-0 right-10 h-20 w-56 rounded-t-full bg-[#f2fbd8]" />
    <div className="relative z-10">
      <span className="mb-4 inline-flex rounded-full border border-[#dcebab] bg-[#f5fbdc] px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#638500]">Your learning space</span>
      <h1 className="text-3xl font-extrabold tracking-[-0.04em] text-[#172018] sm:text-4xl">
        Hello, <span className="text-[#6f9800]">{nickname}</span>!
      </h1>
      <p className="mt-3 max-w-xl text-sm leading-6 text-[#66736a]">
        Pick up where you left off, build your streak, and turn what you learn into friendly competition.
      </p>
    </div>
  </div>
);
