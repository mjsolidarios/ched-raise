import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import QRCode from 'react-qr-code';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { RotateCw } from 'lucide-react';

const hashStringToUint32 = (str: string) => {
  // FNV-1a 32-bit
  let hash = 2166136261;
  for (let i = 0; i < str.length; i += 1) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

const mulberry32 = (seed: number) => {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const makeIdPatternDataUrl = (registrationId: string, variant: 'front' | 'back') => {
  const seedBase = hashStringToUint32(`${registrationId}:${variant}`);
  const rand = mulberry32(seedBase);

  // Derive a palette from the seed.
  const hueA = Math.floor(rand() * 360);
  const hueB = (hueA + 120 + Math.floor(rand() * 80)) % 360;
  const hueC = (hueA + 220 + Math.floor(rand() * 60)) % 360;

  const circles = Array.from({ length: 12 }).map(() => {
    const cx = Math.floor(rand() * 1200);
    const cy = Math.floor(rand() * 700);
    const r = Math.floor(60 + rand() * 220);
    const a = (0.04 + rand() * 0.09).toFixed(3);
    const h = [hueA, hueB, hueC][Math.floor(rand() * 3)];
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="hsl(${h} 85% 62% / ${a})" />`;
  });

  const paths = Array.from({ length: 4 }).map(() => {
    const x1 = Math.floor(rand() * 1200);
    const y1 = Math.floor(rand() * 700);
    const x2 = Math.floor(rand() * 1200);
    const y2 = Math.floor(rand() * 700);
    const c1x = Math.floor(rand() * 1200);
    const c1y = Math.floor(rand() * 700);
    const c2x = Math.floor(rand() * 1200);
    const c2y = Math.floor(rand() * 700);
    const width = (1.0 + rand() * 2.2).toFixed(2);
    const a = (0.10 + rand() * 0.16).toFixed(3);
    const h = [hueA, hueB, hueC][Math.floor(rand() * 3)];
    return `<path d="M ${x1} ${y1} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${x2} ${y2}" fill="none" stroke="hsl(${h} 85% 70% / ${a})" stroke-width="${width}" />`;
  });

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="700" viewBox="0 0 1200 700" preserveAspectRatio="none">
  <defs>
    <radialGradient id="g0" cx="30%" cy="25%" r="80%">
      <stop offset="0%" stop-color="hsl(${hueA} 90% 60% / 0.22)"/>
      <stop offset="55%" stop-color="hsl(${hueB} 90% 55% / 0.10)"/>
      <stop offset="100%" stop-color="hsl(${hueC} 90% 55% / 0.00)"/>
    </radialGradient>
    <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="hsl(${hueB} 90% 60% / 0.12)"/>
      <stop offset="60%" stop-color="hsl(${hueA} 90% 55% / 0.06)"/>
      <stop offset="100%" stop-color="hsl(${hueC} 90% 60% / 0.10)"/>
    </linearGradient>
    <filter id="blur" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="12" />
    </filter>
  </defs>

  <rect width="1200" height="700" fill="url(#g0)"/>
  <rect width="1200" height="700" fill="url(#g1)"/>

  <g filter="url(#blur)">
    ${circles.join('')}
  </g>

  <g>
    ${paths.join('')}
  </g>

  <!-- ID hint lines (deterministic but subtle) -->
  <g opacity="0.16">
    <path d="M 0 ${60 + Math.floor((seedBase % 200))} L 1200 ${60 + Math.floor((seedBase % 200))}" stroke="hsl(${hueA} 85% 70% / 0.35)" stroke-width="1" />
    <path d="M 0 ${260 + Math.floor((seedBase % 180))} L 1200 ${260 + Math.floor((seedBase % 180))}" stroke="hsl(${hueB} 85% 70% / 0.25)" stroke-width="1" />
    <path d="M 0 ${470 + Math.floor((seedBase % 150))} L 1200 ${470 + Math.floor((seedBase % 150))}" stroke="hsl(${hueC} 85% 70% / 0.22)" stroke-width="1" />
  </g>
</svg>`.trim();

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

type Registration = {
  id: string;
  uid?: string;
  status?: 'pending' | 'confirmed' | 'rejected' | string;
  lastName?: string;
  firstName?: string;
  middleName?: string;
  email?: string;
  contactNumber?: string;
  schoolAffiliation?: string;
  registrantType?: string;
  registrantTypeOther?: string;
};

type RegistrationBusinessCardProps = {
  registration: Registration;
  fallbackEmail?: string | null;
  actions?: ReactNode;
};

const getStatusColor = (status?: string) => {
  switch (status) {
    case 'confirmed':
      return 'bg-emerald-500/15 text-emerald-500 border-emerald-500/20';
    case 'rejected':
      return 'bg-destructive/15 text-destructive border-destructive/20';
    default:
      return 'bg-amber-500/15 text-amber-500 border-amber-500/20';
  }
};

export const RegistrationBusinessCard = ({ registration, fallbackEmail, actions }: RegistrationBusinessCardProps) => {
  const [flipped, setFlipped] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  const [isSmUp, setIsSmUp] = useState(() => {
    if (typeof window === 'undefined') return true;
    return window.matchMedia('(min-width: 640px)').matches;
  });

  useEffect(() => {
    const mql = window.matchMedia('(min-width: 640px)');
    const onChange = (e: MediaQueryListEvent) => setIsSmUp(e.matches);

    // Set initial
    setIsSmUp(mql.matches);

    if (typeof mql.addEventListener === 'function') {
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    }

    // Safari fallback
    // eslint-disable-next-line deprecation/deprecation
    mql.addListener(onChange);
    // eslint-disable-next-line deprecation/deprecation
    return () => mql.removeListener(onChange);
  }, []);

  const email = registration.email || fallbackEmail || '';

  const fullName = useMemo(() => {
    const parts = [registration.firstName, registration.middleName, registration.lastName].filter(Boolean);
    return parts.length ? parts.join(' ') : 'Registrant';
  }, [registration.firstName, registration.middleName, registration.lastName]);

  const registrantTypeLabel = useMemo(() => {
    if (registration.registrantType === 'others') return registration.registrantTypeOther || 'Other';
    if (registration.registrantType) return registration.registrantType;
    return '—';
  }, [registration.registrantType, registration.registrantTypeOther]);

  const qrValue = useMemo(() => {
    // Simple payload for fast scanning and manual fallback.
    // Format: CHED-RAISE-2026|<registrationId>|<email>
    return `CHED-RAISE-2026|${registration.id}|${email}`;
  }, [email, registration.id]);

  const patternFront = useMemo(() => makeIdPatternDataUrl(registration.id, 'front'), [registration.id]);
  const patternBack = useMemo(() => makeIdPatternDataUrl(registration.id, 'back'), [registration.id]);

  const qrSize = isSmUp ? 160 : 132;

  const toggle = () => setFlipped((v) => !v);

  const setSpotlight = (clientX: number, clientY: number) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    el.style.setProperty('--spot-x', `${x}px`);
    el.style.setProperty('--spot-y', `${y}px`);

    // Parallax-ish dot grid offset (inverse movement)
    el.style.setProperty('--grid-x', `${Math.round(-x * 0.18)}px`);
    el.style.setProperty('--grid-y', `${Math.round(-y * 0.18)}px`);

    // Subtle card swivel based on cursor position
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const dx = (x - cx) / cx; // -1..1
    const dy = (y - cy) / cy; // -1..1
    const maxDeg = 4;
    const tiltY = dx * maxDeg;
    const tiltX = -dy * maxDeg;

    el.style.setProperty('--tilt-x', `${tiltX.toFixed(2)}deg`);
    el.style.setProperty('--tilt-y', `${tiltY.toFixed(2)}deg`);
  };

  return (
    <div
      ref={cardRef}
      onPointerMove={(e) => setSpotlight(e.clientX, e.clientY)}
      onPointerLeave={() => {
        const el = cardRef.current;
        if (!el) return;
        el.style.setProperty('--spot-x', '50%');
        el.style.setProperty('--spot-y', '35%');
        el.style.setProperty('--grid-x', '0px');
        el.style.setProperty('--grid-y', '0px');
        el.style.setProperty('--tilt-x', '0deg');
        el.style.setProperty('--tilt-y', '0deg');
      }}
      className={cn(
        'flip-card group w-full cursor-pointer select-none',
        'transition-transform duration-300 hover:scale-[1.01] active:scale-[0.995]',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        flipped && 'is-flipped'
      )}
      onClick={toggle}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={flipped ? 'Flip card to front' : 'Flip card to back'}
    >
      <div className="flip-card-inner aspect-[3/2] sm:aspect-[7/4] w-full min-h-[420px] sm:min-h-[260px]">
        {/* Front */}
        <div className="flip-card-face absolute inset-0">
          <div className="relative h-full rounded-2xl p-[1px] bg-gradient-to-br from-primary/35 via-white/10 to-secondary/35 shadow-[0_18px_60px_-22px_rgba(8,52,159,0.7)]">
            <div className="glass-card relative overflow-hidden rounded-2xl p-4 sm:p-5 h-full">
              {/* ID-seeded abstract pattern (slow animated drift) */}
              <div
                className="pointer-events-none absolute inset-0 card-pattern-animate opacity-[0.42] mix-blend-screen saturate-150 contrast-125"
                style={{
                  backgroundImage: `url(\"${patternFront}\")`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />

              {/* Spotlight (follows cursor) */}
              <div className="pointer-events-none absolute inset-0 card-spotlight mix-blend-screen" />

              {/* Dot grid (follows cursor) */}
              <div className="pointer-events-none absolute inset-0 card-dot-grid mix-blend-screen" />

              {/* Subtle grid pattern */}
              <div
                className="absolute inset-0 opacity-[0.05]"
                style={{ backgroundImage: 'url(/grid-pattern.svg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
              />

              {/* Decorative gradient blobs */}
              <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
              <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-secondary/10 blur-3xl" />

              {/* Shine */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-tr from-white/0 via-white/10 to-white/0" />

              {/* Watermark */}
              <img
                src="/r-icon.svg"
                alt=""
                className="pointer-events-none absolute right-6 bottom-6 h-24 w-24 opacity-[0.06]"
                draggable={false}
              />

              <div className="relative flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  {/* Logo badge */}
                  <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_10px_30px_-18px_rgba(0,0,0,0.8)]">
                    <img
                      src="/r-icon.svg"
                      alt="RAISE"
                      className="h-6 w-6 opacity-90"
                      draggable={false}
                    />
                  </div>

                  <div className="leading-tight">
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground">RAISE Card</p>
                    <img
                      src="/logo-light.svg"
                      alt="RAISE logo"
                      className="h-6 mt-1"
                      draggable={false}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <Badge
                    variant="outline"
                    className={cn(
                      'text-[11px] px-3 py-1 rounded-full backdrop-blur-md',
                      'shadow-[0_0_0_1px_rgba(255,255,255,0.06)]',
                      getStatusColor(registration.status)
                    )}
                  >
                    {(registration.status || 'pending').toUpperCase()}
                  </Badge>
                  {actions}
                </div>
              </div>

              {/* "Chip" accent */}
              <div className="relative mt-5 flex items-center justify-between">
                <div className="h-9 w-14 rounded-lg bg-gradient-to-br from-amber-300/20 via-white/10 to-primary/25 border border-white/10 shadow-inner" />
                <p className="text-xs text-muted-foreground">Tap card to flip</p>
              </div>

            <div className="relative mt-5 space-y-1">
              <p className="text-xl sm:text-2xl font-semibold tracking-tight">{fullName}</p>
              <p className="text-sm text-muted-foreground">
                {registrantTypeLabel}{registration.schoolAffiliation ? ` • ${registration.schoolAffiliation}` : ''}
              </p>
            </div>

            <div className="relative mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Registration ID</p>
                <p className="font-mono text-xs break-all bg-muted/40 border border-border/40 rounded-md p-2">
                  {registration.id}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Email</p>
                <p className="text-xs break-all bg-muted/40 border border-border/40 rounded-md p-2">{email || '—'}</p>
              </div>
            </div>

              <div className="relative mt-3 flex items-center justify-end">
                <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                  <RotateCw className="h-3.5 w-3.5" />
                  <span>Back side has QR</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back */}
        <div className="flip-card-face flip-card-back absolute inset-0">
          <div className="relative h-full rounded-2xl p-[1px] bg-gradient-to-br from-secondary/35 via-white/10 to-primary/35 shadow-[0_18px_60px_-22px_rgba(16,185,129,0.45)]">
            <div className="glass-card relative overflow-hidden rounded-2xl p-4 sm:p-5 h-full">
              {/* ID-seeded abstract pattern (slow animated drift) */}
              <div
                className="pointer-events-none absolute inset-0 card-pattern-animate opacity-[0.42] mix-blend-screen saturate-150 contrast-125"
                style={{
                  backgroundImage: `url(\"${patternBack}\")`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />

              {/* Spotlight (follows cursor) */}
              <div className="pointer-events-none absolute inset-0 card-spotlight mix-blend-screen" />

              {/* Dot grid (follows cursor) */}
              <div className="pointer-events-none absolute inset-0 card-dot-grid mix-blend-screen" />

              {/* Subtle grid pattern */}
              <div
                className="absolute inset-0 opacity-[0.05]"
                style={{ backgroundImage: 'url(/grid-pattern.svg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
              />

              <div className="absolute -top-16 -left-16 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
              <div className="absolute -bottom-20 -right-16 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />

              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-tr from-white/0 via-white/10 to-white/0" />

              <img
                src="/logo-light.svg"
                alt=""
                className="pointer-events-none absolute left-6 bottom-6 h-6 opacity-[0.10]"
                draggable={false}
              />

            <div className="relative flex items-start justify-between gap-4">
              <div>
                <p className="text-base sm:text-lg font-semibold">Attendance QR</p>
                <p className="text-xs text-muted-foreground mt-1">Present this code at the event entrance.</p>
              </div>

              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-muted-foreground hover:text-white hover:bg-white/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggle();
                  }}
                >
                  <RotateCw className="h-4 w-4" />
                </Button>
              </div>
            </div>

              <div className="relative mt-4 grid gap-4 sm:grid-cols-[180px,1fr] items-start">
                <div className="relative rounded-2xl bg-white p-3 w-fit border border-white/10 shadow-[0_18px_50px_-28px_rgba(0,0,0,0.9)] mx-auto sm:mx-0">
                  <div className="absolute -inset-3 rounded-3xl bg-primary/10 blur-2xl" />
                  <div className="relative">
                    <QRCode value={qrValue} size={qrSize} />
                  </div>
                </div>

              <div className="text-sm space-y-2 sm:space-y-3">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Registration ID</p>
                  <p className="font-mono text-xs break-all">{registration.id}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Contact</p>
                  <p className="text-sm">{registration.contactNumber || '—'}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">School</p>
                  <p className="text-sm">{registration.schoolAffiliation || '—'}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Registrant Type</p>
                  <p className="text-sm capitalize">{registrantTypeLabel}</p>
                </div>
              </div>
            </div>

              <div className="relative mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Tap card to flip back</p>
                <p className="text-xs text-muted-foreground">Keep this QR private</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
