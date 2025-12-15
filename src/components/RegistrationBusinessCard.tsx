import { type ReactNode, useState, useEffect, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CheckCircle, Clock, RotateCw, XCircle } from 'lucide-react';
import RaiseProtocolEncoderGrid from './RaiseProtocolEncoderGrid';
import { useFitText } from '@/hooks/use-fit-text';

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
  const hueA = 222.5; // Primary color
  const hueB = (hueA + 30 + Math.floor(rand() * 20)) % 360;
  const hueC = (hueA - 30 - Math.floor(rand() * 20)) % 360;

  const circles = Array.from({ length: 3 }).map(() => {
    const cx = Math.floor(rand() * 1200);
    const cy = Math.floor(rand() * 700);
    const r = Math.floor(100 + rand() * 200);
    const a = (0.05 + rand() * 0.05).toFixed(3);
    const h = [hueA, hueB, hueC][Math.floor(rand() * 3)];
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="hsl(${h} 80% 60% / ${a})" />`;
  });

  const paths = Array.from({ length: 2 }).map(() => {
    const x1 = Math.floor(rand() * 1200);
    const y1 = Math.floor(rand() * 700);
    const x2 = Math.floor(rand() * 1200);
    const y2 = Math.floor(rand() * 700);
    const c1x = Math.floor(rand() * 1200);
    const c1y = Math.floor(rand() * 700);
    const c2x = Math.floor(rand() * 1200);
    const c2y = Math.floor(rand() * 700);
    const width = (1.5 + rand() * 2.0).toFixed(2);
    const a = (0.1 + rand() * 0.1).toFixed(3);
    const h = [hueA, hueB, hueC][Math.floor(rand() * 3)];
    return `<path d="M ${x1} ${y1} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${x2} ${y2}" fill="none" stroke="hsl(${h} 80% 70% / ${a})" stroke-width="${width}" />`;
  });

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="700" viewBox="0 0 1200 700" preserveAspectRatio="none">
  <defs>
    <radialGradient id="g0" cx="30%" cy="25%" r="80%">
      <stop offset="0%" stop-color="hsl(222.5 90% 40% / 0.4)"/>
      <stop offset="55%" stop-color="hsl(${hueA} 90% 35% / 0.2)"/>
      <stop offset="100%" stop-color="hsl(222.5 90% 30% / 0.1)"/>
    </radialGradient>
    <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="hsl(222.5 90% 38% / 0.25)"/>
      <stop offset="60%" stop-color="hsl(${hueA} 90% 32% / 0.15)"/>
      <stop offset="100%" stop-color="hsl(222.5 90% 38% / 0.18)"/>
    </linearGradient>
    <filter id="blur" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="16" />
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
  <g opacity="0.2">
    <path d="M 0 ${60 + Math.floor((seedBase % 150))} L 1200 ${60 + Math.floor((seedBase % 250))}" stroke="hsl(${hueA} 85% 70% / 0.4)" stroke-width="1.5" />
    <path d="M 0 ${200 + Math.floor((seedBase % 120))} L 1200 ${220 + Math.floor((seedBase % 180))}" stroke="hsl(${hueB} 85% 70% / 0.3)" stroke-width="1" />
    <path d="M 0 ${350 + Math.floor((seedBase % 100))} L 1200 ${400 + Math.floor((seedBase % 150))}" stroke="hsl(${hueC} 85% 70% / 0.25)" stroke-width="1.2" />
    <path d="M 0 ${500 + Math.floor((seedBase % 80))} L 1200 ${550 + Math.floor((seedBase % 100))}" stroke="hsl(${hueA} 85% 70% / 0.2)" stroke-width="0.8" />
    <path d="M ${100 + Math.floor((seedBase % 100))} 0 L ${150 + Math.floor((seedBase % 150))} 700" stroke="hsl(${hueB} 85% 70% / 0.15)" stroke-width="0.5" />
    <path d="M ${800 + Math.floor((seedBase % 100))} 0 L ${850 + Math.floor((seedBase % 150))} 700" stroke="hsl(${hueC} 85% 70% / 0.1)" stroke-width="0.5" />
  </g>
</svg>`.trim();

  return {
    dataUrl: `data:image/svg+xml,${encodeURIComponent(svg)}`,
    hue: hueA,
  };
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
  raiseId?: number[];
};

type RegistrationBusinessCardProps = {
  registration: Registration;
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

export const RegistrationBusinessCard = ({ registration, actions }: RegistrationBusinessCardProps) => {
  const [flipped, setFlipped] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const nameRef = useRef<HTMLParagraphElement | null>(null);
  useFitText(nameRef, 2);

  // Responsive design handling
  const [isSmUp, setIsSmUp] = useState(() => {
    if (typeof window === 'undefined') return true;
    return window.matchMedia('(min-width: 640px)').matches;
  });

  useEffect(() => {
    const mql = window.matchMedia('(min-width: 640px)');
    const onChange = (e: MediaQueryListEvent) => setIsSmUp(e.matches);
    
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  const middleInitial = registration.middleName ? `${registration.middleName.charAt(0)}.` : '';
  const fullName = [registration.firstName, middleInitial, registration.lastName].filter(Boolean).join(' ') || 'Registrant';

  const registrantTypeLabel = (() => {
    if (registration.registrantType === 'others') return registration.registrantTypeOther || 'Other';
    if (registration.registrantType) return registration.registrantType;
    return '—';
  })();



  const { dataUrl: patternFront } = makeIdPatternDataUrl(registration.id, 'front');
  const { dataUrl: patternBack } = makeIdPatternDataUrl(registration.id, 'back');



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
        'flip-card group w-full max-w-[90vw] mx-auto cursor-pointer select-none',
        'transition-transform duration-300 hover:scale-[1.01] active:scale-[0.995]',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        flipped && 'is-flipped',
        'scale-90 sm:scale-100'
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
      <div className="flip-card-inner aspect-[3/2] w-full min-h-[380px] sm:min-h-[260px]">
        {/* Front */}
        <div className="flip-card-face absolute inset-0">
                      <div className="relative h-full rounded-2xl p-[1px] bg-gradient-to-br from-primary/35 via-white/10 to-secondary/35 shadow-[0_18px_60px_-22px_hsl(222.5_90%_32.7%_/_0.7)]">          <div className="glass-card relative overflow-hidden rounded-2xl p-4 sm:p-5 h-full">
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

              <div className="relative flex flex-col h-full">
                <div className="flex items-start justify-between">
                  <div className="leading-tight">
                    <p className="text-xs sm:text-sm uppercase tracking-wider text-muted-foreground font-semibold">MY REGISTRATION CARD</p>
                    <img
                      src="/logo-light.svg"
                      alt="RAISE logo"
                      className="h-6 sm:h-7 mt-1"
                      draggable={false}
                    />
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-center">
                  <p ref={nameRef} className="text-4xl sm:text-6xl font-bold tracking-tight text-white">{fullName}</p>
                  <p className="text-sm sm:text-2xl text-muted-foreground mt-2">
                    {registrantTypeLabel}{registration.schoolAffiliation ? ` • ${registration.schoolAffiliation}` : ''}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm mb-10 sm:mb-4">
                  <div>
                    <p className="uppercase tracking-wider text-muted-foreground font-semibold">Valid Thru</p>
                    <p className="font-mono text-sm sm:text-2xl">01/30</p>
                  </div>
                  <div className="col-span-2">
                    <p className="uppercase tracking-wider text-muted-foreground font-semibold">Registration ID</p>
                    <p className="font-mono text-sm sm:text-2xl break-all">{registration.id}</p>
                  </div>
                </div>

                <div className="absolute top-4 right-4 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <Badge
                    variant="outline"
                    className={cn(
                      'text-xs sm:text-sm px-3 py-1 rounded-full backdrop-blur-xl',
                      'shadow-[0_0_0_1px_rgba(255,255,255,0.1)]',
                      'flex items-center gap-2',
                      getStatusColor(registration.status)
                    )}
                  >
                    {registration.status === 'confirmed' && <CheckCircle className="w-4 h-4" />}
                    {registration.status === 'pending' && <Clock className="w-4 h-4" />}
                    {registration.status === 'rejected' && <XCircle className="w-4 h-4" />}
                    <span className="font-semibold">{(registration.status || 'pending').toUpperCase()}</span>
                  </Badge>
                  {actions}
                </div>

                <div className="absolute bottom-4 right-4 flex items-center gap-2 text-xs text-muted-foreground">
                  <RotateCw className="h-3 w-3" />
                  <span>Tap to flip</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back */}
        <div className="flip-card-face flip-card-back absolute inset-0">
          <div className="relative h-full rounded-2xl p-[1px] bg-gradient-to-br from-secondary/35 via-white/10 to-primary/35 shadow-[0_18px_60px_-22px_hsl(222.5_90%_32.7%_/_0.45)]">
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

              <div className="h-full flex flex-col justify-center items-center p-6">
                <div className="relative w-full max-w-xs">
                  <div className="absolute -inset-3 rounded-3xl bg-primary/10 blur-2xl" />
                  <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                    <div className="text-center mb-6">
                      <h3 className="text-lg font-bold text-foreground mb-1">RAISE ID</h3>
                      <p className="text-muted-foreground text-sm">Your unique registration code</p>
                    </div>
                    
                    <div className="bg-background/50 border-border/50 rounded-lg p-4 mb-4 flex justify-center items-center">
                      {registration.raiseId ? (
                        <RaiseProtocolEncoderGrid grid={registration.raiseId} size={160} />
                      ) : (
                        <p className="font-mono text-sm text-center text-muted-foreground">ID not generated</p>
                      )}
                    </div>

                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">
                        Present this ID at the event entrance
                      </p>
                    </div>

                    {registration.status === 'pending' && (
                      <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center text-center p-6">
                        <Clock className="w-12 h-12 text-amber-500 mb-2" />
                        <p className="text-sm font-medium text-amber-600">Pending Approval</p>
                        <p className="text-xs text-muted-foreground mt-1">Your registration is under review</p>
                      </div>
                    )}
                    
                    {registration.status === 'rejected' && (
                      <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center text-center p-6">
                        <XCircle className="w-12 h-12 text-destructive mb-2" />
                        <p className="text-sm font-medium text-destructive">Registration Rejected</p>
                        <p className="text-xs text-muted-foreground mt-1">Please contact support for assistance</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
