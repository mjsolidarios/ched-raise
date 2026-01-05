import { type ReactNode, useState, useRef, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CheckCircle, Clock, RotateCw, XCircle, Download } from 'lucide-react';
import { toPng } from 'html-to-image';
import { Button } from '@/components/ui/button';
import QRCode from "react-qr-code";
import { useFitText } from '@/hooks/use-fit-text';
import { UserAvatar } from './UserAvatar';
import { getRegionShortName } from '@/lib/regions';

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

  const paths = Array.from({ length: 12 }).map(() => {
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
  region?: string;
  ticketCode?: string;
  avatarSeed?: string;
  avatarColor?: string;
};

type RegistrationBusinessCardProps = {
  registration: Registration;
  actions?: ReactNode;
  hideFlipInstruction?: boolean;
  hideDownloadButton?: boolean;
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

export const RegistrationBusinessCard = ({ registration, actions, hideFlipInstruction, hideDownloadButton }: RegistrationBusinessCardProps) => {
  const [flipped, setFlipped] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLParagraphElement | null>(null);

  const [maxLines, setMaxLines] = useState(1);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 640px)');
    const updateLines = () => setMaxLines(mq.matches ? 2 : 1);
    updateLines();
    mq.addEventListener('change', updateLines);
    return () => mq.removeEventListener('change', updateLines);
  }, []);

  useFitText(nameRef, maxLines);

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (frontRef.current && backRef.current) {
      try {
        const { offsetWidth, offsetHeight } = frontRef.current;
        const options = {
          cacheBust: true,
          pixelRatio: 2,
          width: offsetWidth,
          height: offsetHeight,
          fontEmbedCSS: '',
          backgroundColor: '#0f172a', // Dark blue background (slate-900)
        };

        const dataUrlFront = await toPng(frontRef.current, options);
        // Create a dummy link to trigger download
        const link = document.createElement('a');
        link.download = `raise-id-${registration.id}-front.png`;
        link.href = dataUrlFront;
        link.click();

        // Small delay to ensure browser handles first download
        setTimeout(async () => {
          if (backRef.current) {
            // Remove transform for capture to ensure it's not mirrored
            const dataUrlBack = await toPng(backRef.current, {
              ...options,
              style: { transform: 'none' }
            });
            const linkBack = document.createElement('a');
            linkBack.download = `raise-id-${registration.id}-back.png`;
            linkBack.href = dataUrlBack;
            linkBack.click();
          }
        }, 500);

      } catch (err) {
        console.error('Could not generate image', err);
      }
    }
  };

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
        'flip-card group w-full max-w-[90vw] sm:max-w-none mx-auto cursor-pointer select-none',
        'transition-transform duration-300 hover:scale-[1.01] active:scale-[0.995]',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        flipped && 'is-flipped',
        'scale-100'
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
      <div className="flip-card-inner aspect-[1.586/1] w-full">
        {/* Front */}
        <div ref={frontRef} className="flip-card-face absolute inset-0">
          <div className="relative h-full rounded-xl sm:rounded-2xl p-[1px] bg-gradient-to-br from-primary/35 via-white/10 to-secondary/35 shadow-[0_18px_60px_-22px_hsl(222.5_90%_32.7%_/_0.7)]">
            <div className="glass-card relative overflow-hidden rounded-xl sm:rounded-2xl p-4 sm:p-5 h-full">
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
                <div className="flex items-start justify-between gap-2 sm:gap-4">
                  <div className="mt-0.5 sm:mt-1 flex items-center gap-2 content-center shrink-0">
                    <img
                      src="/logo-light.svg"
                      alt="RAISE logo"
                      className="h-3.5 sm:h-7"
                      draggable={false}
                    />
                  </div>

                  <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-[8px] sm:text-sm px-1.5 sm:px-3 py-0 sm:py-1 rounded-full backdrop-blur-xl',
                        'shadow-[0_0_0_1px_rgba(255,255,255,0.1)]',
                        'flex items-center gap-1 sm:gap-1.5',
                        getStatusColor(registration.status)
                      )}
                    >
                      {registration.status === 'confirmed' && <CheckCircle className="w-2.5 h-2.5 sm:w-4 sm:h-4" />}
                      {registration.status === 'pending' && <Clock className="w-2.5 h-2.5 sm:w-4 sm:h-4" />}
                      {registration.status === 'rejected' && <XCircle className="w-2.5 h-2.5 sm:w-4 sm:h-4" />}
                      <span className="font-semibold">{(registration.status || 'pending').toUpperCase()}</span>
                    </Badge>
                    {actions}
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-center">
                  <div className="flex flex-col mt-1 sm:mt-0 items-start mb-0 sm:mb-3">
                    <div className="scale-75 origin-top-left sm:scale-100 sm:origin-center">
                      <UserAvatar
                        seed={registration.avatarSeed || registration.ticketCode || registration.id}
                        size={40}
                        className="mb-0.5 sm:mb-2"
                        color={registration.avatarColor}
                        transparent
                      />
                    </div>
                  </div>
                  <p className="text-3xl sm:text-6xl font-bold tracking-tight text-white leading-tight">{fullName}</p>
                  <p className="text-[10px] sm:text-2xl text-muted-foreground mt-0.5 sm:mt-2 line-clamp-1">
                    {registrantTypeLabel}{registration.schoolAffiliation ? ` • ${registration.schoolAffiliation}` : ''}{registration.region ? ` • ${getRegionShortName(registration.region)}` : ''}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 sm:gap-4 text-sm mb-4 sm:mb-4">
                  <div>
                    <p className="uppercase tracking-wider text-muted-foreground font-semibold text-[8px] sm:text-sm">Valid Thru</p>
                    <p className="font-mono text-[9px] sm:text-2xl">01/30</p>
                  </div>
                  <div className="col-span-2">
                    <p className="uppercase tracking-wider text-muted-foreground font-semibold text-[8px] sm:text-sm">Email</p>
                    <p className="font-mono text-[9px] sm:text-2xl break-all line-clamp-1">{registration.email || ""}</p>
                  </div>
                </div>

                {/* Absolute badge container removed to fix overlapping */}

                {!hideFlipInstruction && (
                  <div className="absolute bottom-2 sm:bottom-2 right-2 sm:right-2 flex items-center gap-1 sm:gap-2 text-[9px] sm:text-xs text-muted-foreground">
                    <RotateCw className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                    <span>Tap to flip</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Back */}
        <div ref={backRef} className="flip-card-face flip-card-back absolute inset-0">
          <div className="relative h-full rounded-xl sm:rounded-2xl p-[1px] bg-gradient-to-br from-secondary/35 via-white/10 to-primary/35 shadow-[0_18px_60px_-22px_hsl(222.5_90%_32.7%_/_0.45)]">
            <div className="glass-card relative overflow-hidden rounded-xl sm:rounded-2xl p-4 sm:p-5 h-full">
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

              <div className="h-full flex flex-col justify-center items-center p-2 sm:p-6">
                <div className="relative w-full max-w-sm">
                  {/* Outer glow */}
                  <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/20 blur-2xl" />

                  {/* Main container */}
                  <div className="relative bg-transparent">
                    {/* Header */}
                    <div className="text-center mb-1 sm:mb-4">
                      <div className="inline-flex items-center justify-center w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 mb-1 sm:mb-3">
                        <div className="w-5 h-5 sm:w-8 sm:h-8 rounded-full flex items-center justify-center">
                          <img src="/r-icon.svg" alt="" className="w-4 h-4 sm:w-6 sm:h-6" />
                        </div>
                      </div>
                      <h3 className="hidden sm:block sm:text-2xl font-bold text-white mb-0.5 sm:mb-2">
                        RAISE ID
                      </h3>
                      <p className="hidden sm:block text-xs sm:text-sm text-muted-foreground/80 font-medium">
                        Present this code for attendance.
                      </p>
                    </div>

                    {/* Pattern container */}
                    <div className="relative mb-2 sm:mb-4 w-[120px] h-[120px] sm:w-[200px] sm:h-[200px] mx-auto">
                      {/* Pattern glow */}
                      <div className="absolute -inset-2 bg-gradient-to-br from-primary/30 via-primary/20 to-secondary/30 rounded-2xl blur-xl" />

                      {/* Pattern frame */}
                      <div className="relative bg-white rounded-xl sm:rounded-2xl p-1 shadow-lg">
                        <div className="relative bg-gradient-to-br from-slate-50 to-slate-100/80 rounded-lg sm:rounded-xl p-1 sm:p-2 border border-slate-200/50">
                          {/* Corner accents */}
                          <div className="absolute top-0 left-0 w-3 h-3 sm:w-4 sm:h-4 border-t-2 border-l-2 border-primary/30 rounded-tl-lg" />
                          <div className="absolute top-0 right-0 w-3 h-3 sm:w-4 sm:h-4 border-t-2 border-r-2 border-primary/30 rounded-tr-lg" />
                          <div className="absolute bottom-0 left-0 w-3 h-3 sm:w-4 sm:h-4 border-b-2 border-l-2 border-primary/30 rounded-bl-lg" />
                          <div className="absolute bottom-0 right-0 w-3 h-3 sm:w-4 sm:h-4 border-b-2 border-r-2 border-primary/30 rounded-br-lg" />

                          {/* Pattern display */}
                          <div className="flex justify-center items-center p-1 sm:p-2 bg-white rounded-md sm:rounded-lg">
                            <QRCode
                              value={registration.ticketCode || registration.id}
                              size={256}
                              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                              viewBox={`0 0 256 256`}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer instruction */}
                    <div className="text-center">
                      <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-2 rounded-full bg-white/10 border border-white/20">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-[10px] sm:text-xs font-medium text-foreground/80">
                          {registration.ticketCode || registration.id}
                        </p>
                      </div>
                    </div>

                    {/* Status overlays */}
                    {registration.status === 'pending' && (
                      <div className="absolute inset-0 z-10 bg-white/95 backdrop-blur-md rounded-3xl flex flex-col items-center justify-center text-center p-6 gap-2">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 mb-2">
                          <Clock className="w-8 h-8 text-amber-600" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <p className="text-base font-bold text-amber-700 leading-tight">Pending Approval</p>
                          <p className="text-sm text-amber-600/80 leading-tight">Your registration is under review</p>
                        </div>
                      </div>
                    )}

                    {registration.status === 'rejected' && (
                      <div className="absolute inset-0 z-10 bg-white/95 backdrop-blur-md rounded-3xl flex flex-col items-center justify-center text-center p-6 gap-2">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-2">
                          <XCircle className="w-8 h-8 text-red-600" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <p className="text-base font-bold text-red-700 leading-tight">Registration Rejected</p>
                          <p className="text-sm text-red-600/80 leading-tight">Please contact support for assistance</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {!hideDownloadButton && (
        <div className="flex justify-center mt-4 sm:mt-6">
          <Button
            onClick={handleDownload}
            variant="outline"
            className="group/btn gap-2 shadow-sm hover:shadow-md transition-all rounded-full bg-white/50 backdrop-blur-sm border-white/20 hover:bg-white/80"
          >
            <Download className="w-4 h-4 text-foreground/70 group-hover/btn:text-primary transition-colors" />
            <span className="text-foreground/80 group-hover/btn:text-foreground">Download ID</span>
          </Button>
        </div>
      )}
    </div >
  );
};
