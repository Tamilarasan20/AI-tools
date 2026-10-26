'use client';

import { useState } from 'react';
import {
  AppHeader,
  Checkbox,
  ContactSupport,
  FONT_BARLOW,
  FONT_EPILOGUE,
  FormScreen,
  Heading,
  HomeIndicator,
  OrDivider,
  PillButton,
  ResendCode,
  Rule,
  StatusBar,
  TextField,
  TextLink,
  asset,
} from './ui';

/*
 * Clickable prototype of Figma section "After Migration" (node 26734:19866):
 * new-user sign up, existing-user login and the account-recovery fallbacks.
 *
 * Demo rules
 *  - A mobile number ending in 2284 has no account → "We couldn't find account".
 *  - Any other 10-digit number is an existing, verified account (Alana).
 *  - Any 6-digit code verifies.
 */

type OtpPurpose = 'signup' | 'login' | 'email-signup' | 'email-recover' | 'apple-recover' | 'add-mobile';

type Screen =
  | { id: 'onboarding' }
  | { id: 'cant-find' }
  | { id: 'otp'; purpose: OtpPurpose }
  | { id: 'sign-up'; collect: 'email' | 'mobile' }
  | { id: 'enter-email' }
  | { id: 'find-account' }
  | { id: 'find-by-email' }
  | { id: 'apple-email' }
  | { id: 'lookup' }
  | { id: 'welcome-back' }
  | { id: 'home'; returning: boolean; sheet?: boolean };

const RECOVERED_NAME = 'Elana';
const EXISTING_NAME = 'Alana';

const digits = (v: string) => v.replace(/\D/g, '');
const formatPhone = (v: string) => {
  const d = digits(v).slice(0, 10);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}-${d.slice(3)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
};
const prettyPhone = (v: string) => {
  const d = digits(v);
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6, 10)}`;
};
const maskPhone = (v: string) => `(***) ***-${digits(v).slice(-4) || '3456'}`;
const maskEmail = (v: string) => {
  const [user, domain] = v.split('@');
  if (!user || !domain) return 'ele***@gmail.com';
  return `${user.slice(0, 3)}***@${domain}`;
};
const isEmail = (v: string) => /^\S+@\S+\.\S+$/.test(v);

export const FLOWS: { label: string; group: string; screen: Screen }[] = [
  { group: 'New user sign up', label: 'Sign in / join (mobile)', screen: { id: 'onboarding' } },
  { group: 'New user sign up', label: "Couldn't find account", screen: { id: 'cant-find' } },
  { group: 'New user sign up', label: 'Verify your account', screen: { id: 'otp', purpose: 'signup' } },
  { group: 'New user sign up', label: 'Finish signing up', screen: { id: 'sign-up', collect: 'email' } },
  { group: 'New user sign up', label: 'Email fallback: enter email', screen: { id: 'enter-email' } },
  { group: 'New user sign up', label: 'Home: Welcome', screen: { id: 'home', returning: false } },
  { group: 'Existing user / recover', label: 'Verify (existing account)', screen: { id: 'otp', purpose: 'login' } },
  { group: 'Existing user / recover', label: 'Find my account', screen: { id: 'find-account' } },
  { group: 'Existing user / recover', label: 'Find by email', screen: { id: 'find-by-email' } },
  { group: 'Existing user / recover', label: 'Apple email', screen: { id: 'apple-email' } },
  { group: 'Existing user / recover', label: 'Account look up', screen: { id: 'lookup' } },
  { group: 'Existing user / recover', label: 'Welcome back (add mobile)', screen: { id: 'welcome-back' } },
  { group: 'Existing user / recover', label: 'Home: Welcome back', screen: { id: 'home', returning: true } },
  { group: 'Existing user / recover', label: "Home: You're in sheet", screen: { id: 'home', returning: true, sheet: true } },
];

export default function EplSignInPrototype() {
  const [stack, setStack] = useState<Screen[]>([{ id: 'onboarding' }]);
  // Bumped on every navigation so each visit mounts a fresh screen (no stale input).
  const [visit, setVisit] = useState(0);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState(EXISTING_NAME);

  const screen = stack[stack.length - 1];
  const go = (s: Screen) => {
    setStack((st) => [...st, s]);
    setVisit((v) => v + 1);
  };
  const back = () => {
    setStack((st) => (st.length > 1 ? st.slice(0, -1) : st));
    setVisit((v) => v + 1);
  };
  const reset = (s: Screen = { id: 'onboarding' }) => {
    setStack(s.id === 'onboarding' ? [s] : [{ id: 'onboarding' }, s]);
    setVisit((v) => v + 1);
  };

  return (
    <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-start lg:justify-center">
      {/* Device */}
      <div className="shrink-0 rounded-[52px] bg-[#1b1b1b] p-[12px] shadow-2xl">
        <div className="relative h-[812px] w-[375px] overflow-hidden rounded-[40px] bg-[#efefe7]">
          <ScreenView
            key={visit}
            screen={screen}
            go={go}
            back={back}
            reset={reset}
            phone={phone}
            setPhone={setPhone}
            email={email}
            setEmail={setEmail}
            name={name}
            setName={setName}
          />
        </div>
      </div>

      {/* Flow index */}
      <aside className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-5 text-sm shadow-sm">
        <h2 className="mb-1 text-base font-bold text-gray-900">Jump to a screen</h2>
        <p className="mb-4 text-gray-500">
          Or click through the prototype. Numbers ending in <b>2284</b> have no account; any other 10-digit number is an
          existing user. Any 6-digit code verifies.
        </p>
        {['New user sign up', 'Existing user / recover'].map((g) => (
          <div key={g} className="mb-4">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">{g}</h3>
            <div className="flex flex-wrap gap-2">
              {FLOWS.filter((f) => f.group === g).map((f) => (
                <button
                  key={f.label}
                  type="button"
                  onClick={() => {
                    if (f.screen.id === 'home' && f.screen.returning && f.screen.sheet) setName(RECOVERED_NAME);
                    else if (f.screen.id === 'home') setName(EXISTING_NAME);
                    reset(f.screen);
                  }}
                  className="rounded-full border border-gray-200 px-3 py-1 text-gray-700 hover:border-[#fe3b1f] hover:text-[#fe3b1f]"
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        ))}
        <button type="button" onClick={() => reset()} className="text-[#fe3b1f] underline">
          Restart from the beginning
        </button>
      </aside>
    </div>
  );
}

type ViewProps = {
  screen: Screen;
  go: (s: Screen) => void;
  back: () => void;
  reset: (s?: Screen) => void;
  phone: string;
  setPhone: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  name: string;
  setName: (v: string) => void;
};

function ScreenView(p: ViewProps) {
  switch (p.screen.id) {
    case 'onboarding':
      return <Onboarding {...p} />;
    case 'cant-find':
      return <CantFind {...p} />;
    case 'otp':
      return <Otp {...p} purpose={p.screen.purpose} />;
    case 'sign-up':
      return <SignUp {...p} collect={p.screen.collect} />;
    case 'enter-email':
      return <EnterEmail {...p} />;
    case 'find-account':
      return <FindAccount {...p} />;
    case 'find-by-email':
      return <FindByEmail {...p} />;
    case 'apple-email':
      return <AppleEmail {...p} />;
    case 'lookup':
      return <Lookup {...p} />;
    case 'welcome-back':
      return <WelcomeBack {...p} />;
    case 'home':
      return <Home {...p} returning={p.screen.returning} sheet={!!p.screen.sheet} />;
  }
}

/* ---------- Onboarding (26734:19622 / 26762:40365) ---------- */

function Onboarding({ go, phone, setPhone, setName }: ViewProps) {
  const valid = digits(phone).length === 10;
  const submit = () => {
    if (digits(phone).endsWith('2284')) {
      go({ id: 'cant-find' });
    } else {
      setName(EXISTING_NAME);
      go({ id: 'otp', purpose: 'login' });
    }
  };
  return (
    <div className="relative flex h-full w-full flex-col bg-[#efefe7]">
      <div className="flex flex-col items-center gap-6 bg-[#ed2700] px-4 pb-6">
        <StatusBar light />
        <div className="flex flex-col items-center gap-2">
          <img src={asset('logo-white.png')} alt="El Pollo Loco" width={88} height={24} className="h-6 w-[88px]" />
          <h1 className={`${FONT_BARLOW} w-[268px] text-center text-[32px] font-bold leading-[36px] tracking-[-0.5px] text-white`}>
            Sign In or Join to earn rewards
          </h1>
        </div>
      </div>
      <div className="relative h-[233px] w-full overflow-hidden rounded-b-[24px]">
        <img src={asset('hero-onboarding.png')} alt="Chicken bowl and El Pollo Loco cup" width={375} height={233} className="h-[233px] w-[375px] object-cover" />
      </div>
      <div className="flex flex-col gap-4 px-4 py-6">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-4">
            <TextField label="Mobile number*" value={phone} onChange={(v) => setPhone(formatPhone(v))} inputMode="tel" />
            <PillButton disabled={!valid} onClick={submit}>
              Continue
            </PillButton>
          </div>
          <div className="flex flex-col gap-px text-center text-[12px] text-[#696969]">
            <p className={`${FONT_BARLOW} font-medium leading-[18px]`}>By tapping, I accept the El Pollo Loco</p>
            <p className={`${FONT_EPILOGUE} font-bold leading-5 underline`}>Privacy policy and Terms of Use.</p>
          </div>
        </div>
        <div className="py-[12px] text-center">
          <TextLink onClick={() => go({ id: 'enter-email' })}>Looking for another way to sign-in?</TextLink>
        </div>
        <OrDivider />
        <div className="py-[14px] text-center">
          <TextLink onClick={() => go({ id: 'home', returning: false })}>Continue as guest</TextLink>
        </div>
      </div>
      <HomeIndicator />
    </div>
  );
}

/* ---------- Can't find account (26734:19755) ---------- */

function CantFind({ go, back, phone }: ViewProps) {
  const shown = digits(phone).length === 10 ? prettyPhone(phone) : '(555) 019-2284';
  return (
    <FormScreen onBack={back}>
      <Heading title={`We couldn’t find account ${shown}`}>
        Joined before with a different number (or)
        <br />
        signed up with Facebook, Apple or Google?
      </Heading>
      <div className="flex flex-col gap-4">
        <PillButton onClick={() => go({ id: 'find-account' })}>Find my Account</PillButton>
        <PillButton variant="outline" onClick={() => go({ id: 'otp', purpose: 'signup' })}>
          Create New Account
        </PillButton>
      </div>
    </FormScreen>
  );
}

/* ---------- Verification code (26762:39462, 26766:40743, 26734:14175, 26765:32005 …) ---------- */

function Otp({ go, back, phone, email, purpose }: ViewProps & { purpose: OtpPurpose }) {
  const [code, setCode] = useState('');
  const valid = code.length === 6;

  const viaEmail = purpose === 'email-signup' || purpose === 'email-recover' || purpose === 'apple-recover';
  const title =
    purpose === 'signup' || purpose === 'login'
      ? 'Verify your account'
      : purpose === 'apple-recover'
        ? 'Check your email'
        : 'Enter verification code';

  const description =
    purpose === 'email-signup'
      ? `We just texted a 6-digit code to ${maskEmail(email)}, Please enter the code and verify your account to continue.`
      : viaEmail
        ? `Enter the 6-digit code sent to ${maskEmail(email || 'mar@gmail.com')}`
        : purpose === 'add-mobile'
          ? `Enter the 6-digit code sent to ${maskPhone(phone)}`
          : `We just texted a 6-digit code to ${maskPhone(phone)}, Please enter the code and verify your account to continue.`;

  const next = () => {
    switch (purpose) {
      case 'signup':
        return go({ id: 'sign-up', collect: 'email' });
      case 'email-signup':
        return go({ id: 'sign-up', collect: 'mobile' });
      case 'login':
        return go({ id: 'home', returning: true });
      case 'email-recover':
      case 'apple-recover':
        return go({ id: 'welcome-back' });
      case 'add-mobile':
        return go({ id: 'home', returning: true, sheet: true });
    }
  };

  return (
    <FormScreen onBack={back}>
      <Heading title={title}>{description}</Heading>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <TextField
            label="Enter verification code"
            value={code}
            onChange={(v) => setCode(digits(v).slice(0, 6))}
            inputMode="numeric"
            autoComplete="one-time-code"
            autoFocus
            onEnter={() => valid && next()}
          />
          <ResendCode />
        </div>
        <PillButton disabled={!valid} onClick={next}>
          Verify and Continue
        </PillButton>
      </div>
      {(purpose === 'signup' || purpose === 'login') && (
        <div className="flex flex-col items-center gap-6">
          <Rule />
          <p className={`${FONT_BARLOW} text-[16px] font-bold uppercase leading-4 text-[#262626]`}>
            Not getting code?{' '}
            {purpose === 'signup' ? (
              <TextLink onClick={() => go({ id: 'enter-email' })}>Try email</TextLink>
            ) : (
              <TextLink onClick={() => go({ id: 'find-account' })}>Try another way</TextLink>
            )}
          </p>
        </div>
      )}
      {purpose === 'email-signup' && (
        <div className="flex flex-col items-center gap-6">
          <OrDivider />
          <TextLink onClick={() => back()}>Join with phone number</TextLink>
        </div>
      )}
    </FormScreen>
  );
}

/* ---------- Finish signing up (26766:40440 / 26765:29609) ---------- */

function SignUp({ go, back, email, setEmail, phone, setPhone, setName, collect }: ViewProps & { collect: 'email' | 'mobile' }) {
  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');
  const [terms, setTerms] = useState(false);
  const [push, setPush] = useState(false);
  const contactOk = collect === 'email' ? isEmail(email) : digits(phone).length === 10;
  const valid = first.trim() && last.trim() && contactOk && terms;

  return (
    <FormScreen onBack={back}>
      <Heading size="h1" title="Finish signing up">
        Just a few details and you&apos;re in.
      </Heading>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3">
          <TextField label="First name*" value={first} onChange={setFirst} />
          <TextField label="Last name*" value={last} onChange={setLast} />
          {collect === 'email' ? (
            <TextField label="Email*" value={email} onChange={setEmail} type="email" inputMode="email" />
          ) : (
            <TextField label="Mobile number*" value={phone} onChange={(v) => setPhone(formatPhone(v))} inputMode="tel" />
          )}
        </div>
        <div className="flex flex-col gap-5">
          <Checkbox checked={terms} onChange={setTerms}>
            I have read and accepted the <span className="underline">Terms and Conditions</span>.*
          </Checkbox>
          <Checkbox checked={push} onChange={setPush}>
            yes, send me push notifications so i’m the first to know about the loco rewards
          </Checkbox>
        </div>
        <PillButton
          disabled={!valid}
          onClick={() => {
            setName(first.trim() || EXISTING_NAME);
            go({ id: 'home', returning: false });
          }}
        >
          Confirm
        </PillButton>
        <p className={`${FONT_EPILOGUE} text-center text-[13px] leading-4 text-[#262626]`}>
          You must be 18 or older to join Loco Rewards™. By joining, you agree to the Loco Rewards™ Terms &amp; Conditions.
        </p>
      </div>
    </FormScreen>
  );
}

/* ---------- Email fallback: Enter your email ID (26766:40678) ---------- */

function EnterEmail({ go, back, email, setEmail }: ViewProps) {
  return (
    <FormScreen onBack={back}>
      <Heading title="Enter your email ID">Add your email ID and we’ll text you a verification code to verify your account.</Heading>
      <div className="flex flex-col gap-4">
        <TextField label="Email ID*" value={email} onChange={setEmail} type="email" inputMode="email" autoFocus />
        <PillButton disabled={!isEmail(email)} onClick={() => go({ id: 'otp', purpose: 'email-signup' })}>
          Verify Now
        </PillButton>
      </div>
      <div className="flex flex-col items-center gap-6">
        <OrDivider />
        <TextLink onClick={back}>Join with phone number</TextLink>
      </div>
    </FormScreen>
  );
}

/* ---------- Find my account (26734:13220) ---------- */

function FindAccount({ go, back }: ViewProps) {
  return (
    <FormScreen onBack={back}>
      <Heading title="Find my account">
        Joined before with a different number (or)
        <br />
        signed up with Facebook, Apple or Google?
      </Heading>
      <div className="flex flex-col gap-4">
        <PillButton onClick={() => go({ id: 'find-by-email' })}>Use Email</PillButton>
        <PillButton variant="outline" onClick={() => go({ id: 'apple-email' })}>
          I signed up with Apple
        </PillButton>
        <div className="pt-2 text-center">
          <TextLink onClick={() => go({ id: 'lookup' })}>Find account with info</TextLink>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <Rule />
        <ContactSupport />
      </div>
    </FormScreen>
  );
}

/* ---------- Find my account: email (26734:14289) ---------- */

function FindByEmail({ go, back, email, setEmail, setName }: ViewProps) {
  return (
    <FormScreen onBack={back}>
      <Heading title="Find my account">Use email you signed up with, We’ll send a code there.</Heading>
      <div className="flex flex-col gap-4">
        <TextField label="Enter email ID*" value={email} onChange={setEmail} type="email" inputMode="email" autoFocus />
        <PillButton
          disabled={!isEmail(email)}
          onClick={() => {
            setName(RECOVERED_NAME);
            go({ id: 'otp', purpose: 'email-recover' });
          }}
        >
          Send verification code
        </PillButton>
      </div>
    </FormScreen>
  );
}

/* ---------- Apple email (26734:14403) ---------- */

function AppleEmail({ go, back, email, setEmail, setName }: ViewProps) {
  return (
    <FormScreen onBack={back}>
      <Heading title="Apple email">
        <p>If you selected “Hide My Email,” Apple created a private email for you, like abc123@privaterelay.appleid.com.</p>
        <p className="mt-2">Enter it or you can find this address in Settings &gt; Apple ID &gt; Sign-In &amp; Security.</p>
      </Heading>
      <div className="flex flex-col gap-4">
        <TextField label="Apple relay email *" value={email} onChange={setEmail} type="email" inputMode="email" autoFocus />
        <PillButton
          disabled={!isEmail(email)}
          onClick={() => {
            setName(RECOVERED_NAME);
            go({ id: 'otp', purpose: 'apple-recover' });
          }}
        >
          Send verification code
        </PillButton>
      </div>
    </FormScreen>
  );
}

/* ---------- Account look up (26734:14517 / 26766:44024) ---------- */

function Lookup({ go, back, setName }: ViewProps) {
  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');
  const [date, setDate] = useState('');
  const valid = first.trim() && last.trim() && date.trim();
  return (
    <FormScreen onBack={back}>
      <div className="flex w-full flex-col items-center text-center text-[#262626]">
        <h1 className={`${FONT_BARLOW} text-[32px] font-bold uppercase leading-[36px]`}>Account look up</h1>
        <p className={`${FONT_EPILOGUE} w-[260px] text-[16px] leading-[1.24]`}>
          Provide some additional information and we will look up your account details.
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3">
          <TextField label="First name*" value={first} onChange={setFirst} />
          <TextField label="Last name*" value={last} onChange={setLast} />
          <TextField label="Approximate order date*" value={date} onChange={setDate} />
        </div>
        <PillButton
          disabled={!valid}
          onClick={() => {
            setName(first.trim() || RECOVERED_NAME);
            go({ id: 'welcome-back' });
          }}
        >
          Find my Account
        </PillButton>
        <ContactSupport prefix="Still Having trouble getting into your account?" />
      </div>
    </FormScreen>
  );
}

/* ---------- Welcome back, add mobile (26765:39341) ---------- */

function WelcomeBack({ go, back, name, setPhone }: ViewProps) {
  const [mobile, setMobile] = useState('');
  return (
    <>
      <FormScreen onBack={back}>
        <Heading title={`Welcome back, ${name}`}>One quick thing: add your current mobile number so signing in is a tap away next time.</Heading>
        <div className="flex flex-col gap-6">
          <TextField label="Mobile number*" value={mobile} onChange={(v) => setMobile(formatPhone(v))} inputMode="tel" autoFocus />
          <PillButton
            disabled={digits(mobile).length !== 10}
            onClick={() => {
              setPhone(mobile);
              go({ id: 'otp', purpose: 'add-mobile' });
            }}
          >
            Verify and Continue
          </PillButton>
        </div>
      </FormScreen>
      <div className="absolute bottom-[52px] left-0 w-full text-center">
        <TextLink onClick={() => go({ id: 'home', returning: true, sheet: true })}>Maybe later</TextLink>
      </div>
    </>
  );
}

/* ---------- Home (26765:28059 new / 26765:30024 returning / 26765:40027 sheet) ---------- */

function Home({ name, returning, sheet }: ViewProps & { returning: boolean; sheet: boolean }) {
  const [open, setOpen] = useState(sheet);
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#efefe7]">
      <AppHeader points={returning} />
      <div className="absolute left-0 top-[45px] h-[532px] w-[375px]">
        <img src={asset('hero-home.png')} alt="Burrito bowls" width={375} height={532} className="h-[532px] w-[375px] object-cover" />
        <div className="absolute inset-x-0 bottom-0 h-[242px] bg-gradient-to-b from-transparent to-black/50" />
        <div className="absolute inset-x-0 top-[330px] flex flex-col items-center gap-[22px]">
          <h1
            className={`${FONT_BARLOW} text-center text-[38px] font-bold uppercase leading-[42px] text-white [text-shadow:0_2px_6px_rgba(0,0,0,0.35)]`}
          >
            {returning ? 'Welcome back' : 'Welcome'}
            <br />
            {name}
          </h1>
          <PillButton variant="light" className="!w-[313px]">
            Start Order
          </PillButton>
        </div>
        <div className="absolute left-[7px] top-[496px] flex h-6 w-[80px] items-center justify-center gap-[9px] rounded-full border-[0.5px] border-white/30 bg-black/10 backdrop-blur-[12.8px]">
          <span className="h-2 w-2 rounded-full bg-[#fdb913]" />
          <span className="h-[6px] w-[6px] rounded-full bg-white" />
          <span className="h-[6px] w-[6px] rounded-full bg-white" />
        </div>
      </div>

      {returning ? (
        <img
          src={asset('active-order.png')}
          alt="Your order is placed! Pick up time 11:15 AM"
          width={350}
          height={179}
          className="absolute left-[12.5px] top-[599px] h-[179px] w-[350px]"
        />
      ) : (
        <img
          src={asset('promo-gift-card.png')}
          alt="Make their day delicious with a gift card"
          width={347}
          height={193}
          className="absolute left-[14px] top-[593px] h-[193px] w-[347px]"
        />
      )}

      <img src={asset('nav-bottom.png')} alt="Home, Order, Scan, Rewards, More" width={374} height={97} className="absolute left-[1px] top-[715px] h-[97px] w-[374px]" />

      {open && (
        <>
          <button type="button" aria-label="Close" className="absolute inset-0 z-30 bg-black/60" onClick={() => setOpen(false)} />
          <div className="absolute bottom-0 left-0 z-40 flex w-[375px] flex-col items-end rounded-t-[16px] bg-[#efefe7] pb-[56px]">
            <div className="flex w-full justify-end py-2 pl-4 pr-2">
              <button type="button" onClick={() => setOpen(false)} className="p-[10px]" aria-label="Close">
                <img src={asset('icon-close.png')} alt="" width={24} height={24} className="h-6 w-6" />
              </button>
            </div>
            <div className="flex w-full flex-col items-center gap-6 px-4">
              <div className="flex flex-col items-center gap-2 text-center text-[#262626]">
                <p className={`${FONT_BARLOW} text-[32px] font-bold uppercase leading-[36px]`}>You’re in!</p>
                <p className={`${FONT_EPILOGUE} w-[299px] text-[16px] leading-[1.24]`}>
                  Your, 1,359 points and saved orders are right where you left.
                </p>
              </div>
              <PillButton onClick={() => setOpen(false)}>Start Order</PillButton>
            </div>
            <HomeIndicator />
          </div>
        </>
      )}

    </div>
  );
}
