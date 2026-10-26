'use client';

import { useEffect, useState, type ReactNode } from 'react';

const A = '/prototypes/epl';

export const FONT_BARLOW = 'font-[family-name:var(--font-barlow)]';
export const FONT_EPILOGUE = 'font-[family-name:var(--font-epilogue)]';

/* ---------- Device chrome ---------- */

export function StatusBar({ light = false }: { light?: boolean }) {
  if (light) {
    // White status bar shown on the red onboarding header
    return <img src={`${A}/status-bar-light.png`} alt="" width={375} height={42} className="block h-[42px] w-[375px]" />;
  }
  return <img src={`${A}/status-bar.png`} alt="" width={375} height={44} className="block h-[44px] w-[375px]" />;
}

export function HomeIndicator() {
  return (
    <div className="pointer-events-none absolute bottom-0 left-0 h-[32px] w-[375px]">
      <div className="absolute bottom-[7.69px] left-1/2 h-[4.8px] w-[129px] -translate-x-1/2 rounded-full bg-black" />
    </div>
  );
}

export function AppHeader({ points }: { points?: boolean }) {
  return (
    <div className="absolute left-0 top-0 z-20 w-[375px]">
      <StatusBar />
      <div className="absolute left-0 top-[38px] h-[46px] w-[375px] overflow-clip rounded-b-[12px] bg-[#efefe7] shadow-[0px_2px_3px_0px_rgba(0,0,0,0.15)]">
        <img src={`${A}/logo.png`} alt="El Pollo Loco" width={88} height={24} className="absolute left-[19px] top-[10px] h-[24px] w-[88px]" />
        {points && (
          <img src={`${A}/points-pill.png`} alt="3,500 points" width={61} height={24} className="absolute left-[264px] top-[9px] h-[24px] w-[61px]" />
        )}
        <img src={`${A}/icon-bag.png`} alt="Bag" width={24} height={24} className="absolute right-[14px] top-[9px] h-[24px] w-[24px]" />
      </div>
    </div>
  );
}

/* ---------- Layout ---------- */

export function FormScreen({ onBack, children, center }: { onBack: () => void; children: ReactNode; center?: boolean }) {
  return (
    <div className="relative h-full w-full bg-[#efefe7]">
      <AppHeader />
      <div className="absolute left-1/2 top-[100px] flex w-[343px] -translate-x-1/2 flex-col gap-4">
        <button type="button" onClick={onBack} className="flex w-[57px] items-center gap-1 py-2 text-left">
          <img src={`${A}/icon-back.png`} alt="" width={15} height={15} className="h-[15px] w-[15px]" />
          <span className="text-[14px] leading-6 text-black [font-family:'Franklin_Gothic_Medium','Libre_Franklin',Arial,sans-serif]">
            Back
          </span>
        </button>
        <div className={`flex flex-col gap-6 ${center ? 'items-center' : ''}`}>{children}</div>
      </div>
      <HomeIndicator />
    </div>
  );
}

export function Heading({
  title,
  children,
  size = 'h2',
  center,
}: {
  title: string;
  children?: ReactNode;
  size?: 'h1' | 'h2';
  center?: boolean;
}) {
  return (
    <div className={`flex w-full flex-col gap-[10px] text-[#262626] ${center ? 'items-center text-center' : ''}`}>
      <h1
        className={`${FONT_BARLOW} font-bold uppercase ${size === 'h1' ? 'text-[32px] leading-[36px]' : 'text-[28px] leading-[30px]'}`}
      >
        {title}
      </h1>
      {children && <div className={`${FONT_BARLOW} text-[14px] font-medium leading-[18px]`}>{children}</div>}
    </div>
  );
}

/* ---------- Controls ---------- */

export function TextField({
  label,
  value,
  onChange,
  type = 'text',
  inputMode,
  autoFocus,
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  inputMode?: 'text' | 'numeric' | 'tel' | 'email';
  autoFocus?: boolean;
  maxLength?: number;
}) {
  const filled = value.length > 0;
  return (
    <label className="relative block h-[48px] w-full cursor-text rounded-[6px] border border-[#262626] bg-white drop-shadow-[0px_2px_1.5px_rgba(0,0,0,0.15)]">
      <span
        className={`${FONT_BARLOW} pointer-events-none absolute left-[15px] font-bold uppercase transition-all ${
          filled ? 'top-[7px] text-[10px] leading-[1.25] text-[#989898]' : 'top-1/2 -translate-y-1/2 text-[16px] leading-none text-[#696969]'
        }`}
      >
        {label}
      </span>
      <input
        type={type}
        inputMode={inputMode}
        value={value}
        autoFocus={autoFocus}
        maxLength={maxLength}
        aria-label={label}
        onChange={(e) => onChange(e.target.value)}
        className={`${FONT_EPILOGUE} absolute inset-x-[15px] bottom-[6px] top-[19px] bg-transparent text-[16px] leading-none text-[#262626] outline-none`}
      />
    </label>
  );
}

export function PillButton({
  children,
  onClick,
  variant = 'primary',
  disabled,
  className = '',
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'outline' | 'light';
  disabled?: boolean;
  className?: string;
}) {
  const styles = disabled
    ? 'bg-[#989898] text-[#f8f8f8] cursor-not-allowed'
    : variant === 'outline'
      ? 'bg-white border-2 border-[#262626] text-[#262626] drop-shadow-[0px_2px_1.5px_rgba(0,0,0,0.1)]'
      : variant === 'light'
        ? 'bg-[#efefe7] text-[#262626] drop-shadow-[0px_2px_1.5px_rgba(0,0,0,0.1)]'
        : 'bg-[#262626] text-[#f8f8f8] drop-shadow-[0px_2px_1.5px_rgba(0,0,0,0.1)] hover:bg-black';
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`${FONT_BARLOW} flex h-[42px] w-full items-center justify-center rounded-full px-8 py-2 text-center text-[16px] font-bold uppercase leading-4 transition-colors ${styles} ${className}`}
    >
      {children}
    </button>
  );
}

export function TextLink({ children, onClick, className = '' }: { children: ReactNode; onClick?: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${FONT_BARLOW} text-[16px] font-bold uppercase leading-4 text-[#262626] underline decoration-from-font ${className}`}
    >
      {children}
    </button>
  );
}

export function OrDivider() {
  return (
    <div className="flex w-full items-center gap-2">
      <span className="h-px flex-1 bg-[#acacac]" />
      <span className={`${FONT_EPILOGUE} text-[12px] leading-[1.32] text-[#989898]`}>or</span>
      <span className="h-px flex-1 bg-[#acacac]" />
    </div>
  );
}

export function Rule() {
  return <span className="block h-px w-full bg-[#acacac]" />;
}

export function Checkbox({ checked, onChange, children }: { checked: boolean; onChange: (v: boolean) => void; children: ReactNode }) {
  return (
    <label className="flex cursor-pointer items-center gap-3">
      <input type="checkbox" className="sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      {checked ? (
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[4px] bg-[#262626] text-[14px] font-bold text-white">✓</span>
      ) : (
        <img src={`${A}/icon-checkbox.png`} alt="" width={24} height={24} className="h-6 w-6 shrink-0" />
      )}
      <span className={`${FONT_BARLOW} text-[13px] font-bold uppercase leading-[15px] text-[#262626]`}>{children}</span>
    </label>
  );
}

export function ResendCode() {
  const [left, setLeft] = useState(60);
  useEffect(() => {
    if (left <= 0) return;
    const t = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);
  if (left > 0) {
    return (
      <p className={`${FONT_BARLOW} text-[16px] font-bold uppercase leading-none text-[#989898]`}>
        Send a new code in {Math.floor(left / 60)}:{String(left % 60).padStart(2, '0')}
      </p>
    );
  }
  return (
    <TextLink onClick={() => setLeft(60)} className="self-start">
      Send a new code
    </TextLink>
  );
}

export function ContactSupport({ prefix = 'Having trouble getting into your account?' }: { prefix?: string }) {
  return (
    <p className={`${FONT_BARLOW} w-full text-center text-[14px] font-medium leading-[18px] text-[#696969]`}>
      {prefix}
      <br />
      Contact EPL at <span className="text-[#262626]">+1 (923) 872 8024</span>
    </p>
  );
}

export const asset = (name: string) => `${A}/${name}`;
