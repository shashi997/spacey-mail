import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "@phosphor-icons/react";

/* ─── High Contrast Undeliverable Envelope SVG ─────────────────────────── */
const UndeliverableEnvelope = () => (
  <svg
    viewBox="0 0 160 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    className="w-48 h-auto tracking-normal transition-transform duration-300 hover:scale-105"
  >
    {/* Envelope body - Increased contrast */}
    <rect x="8" y="28" width="144" height="86" rx="2" stroke="#32FCC7" strokeWidth="1.2" opacity="0.5" />
    {/* Flap */}
    <path d="M8 28 L80 76 L152 28" stroke="#32FCC7" strokeWidth="1.2" opacity="0.5" fill="none" />
    {/* Bottom fold */}
    <path d="M8 114 L52 72" stroke="#32FCC7" strokeWidth="1" opacity="0.3" />
    <path d="M152 114 L108 72" stroke="#32FCC7" strokeWidth="1" opacity="0.3" />
    
    {/* RETURN TO SENDER stamp */}
    <g transform="rotate(-15 80 60)">
      <rect x="22" y="50" width="116" height="20" rx="1" stroke="#1AD6FF" strokeWidth="1" opacity="0.6" fill="none" />
      <text
        x="80"
        y="62"
        textAnchor="middle"
        fill="#1AD6FF"
        fontSize="7"
        fontFamily="'IBM Plex Mono', monospace"
        fontWeight="700"
        letterSpacing="2.5"
        opacity="0.9"
      >
        RETURN TO SENDER
      </text>
    </g>
    
    {/* Postmark circle */}
    <circle cx="126" cy="44" r="14" stroke="#32FCC7" strokeWidth="1" strokeDasharray="3 2" opacity="0.5" />
    <text
      x="126"
      y="41"
      textAnchor="middle"
      fill="#32FCC7"
      fontSize="5"
      fontFamily="'IBM Plex Mono', monospace"
      fontWeight="700"
      letterSpacing="1"
      opacity="0.8"
    >
      NOT
    </text>
    <text
      x="126"
      y="47"
      textAnchor="middle"
      fill="#32FCC7"
      fontSize="5"
      fontFamily="'IBM Plex Mono', monospace"
      fontWeight="700"
      letterSpacing="1"
      opacity="0.8"
    >
      FOUND
    </text>
  </svg>
);

const NotFound = () => {
  return (
    <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center px-6 selection:bg-brand-neon-green/30">
      <div className="text-center space-y-10 max-w-lg animate-in fade-in zoom-in-95 duration-500 ease-out">

        {/* Envelope Illustration with subtle neon depth glow */}
        <div className="relative flex justify-center mb-2">
          <UndeliverableEnvelope />
          <div className="absolute inset-0 bg-brand-neon-green/5 blur-3xl rounded-full pointer-events-none -z-10" />
        </div>

        {/* Informative Eyebrow */}
        <p className="text-xs font-mono font-bold uppercase tracking-[0.3em] text-brand-neon-green">
          Error Code: 404
        </p>

        {/* Headline — High Contrast & Proper Kerning */}
        <h1 className="text-5xl md:text-6xl font-extrabold text-white font-heading tracking-tight leading-[1.15]">
          Letter not
          <br />
          <span className="text-brand-neon-green">delivered.</span>
        </h1>

        {/* Body Copy — Boosted size & higher opacity contrast for perfect readability */}
        <p className="text-base font-mono text-brand-light-grey/85 leading-relaxed max-w-md mx-auto">
          This address doesn't exist in our system. The page may have been
          moved, deleted, or the link you followed is out of date.
        </p>

        {/* Action Button — Crisp, high contrast text and a clean hover layout */}
        <div className="pt-4">
          <Button
            asChild
            className="
              group
              bg-transparent border border-brand-neon-green text-brand-neon-green
              hover:bg-brand-neon-green hover:text-brand-bg
              active:scale-[0.98]
              font-mono font-bold text-xs uppercase tracking-widest
              px-10 py-6 rounded-none
              transition-all duration-200 cursor-pointer
              shadow-lg shadow-brand-neon-green/5 hover:shadow-brand-neon-green/20
            "
          >
            <Link to="/" className="inline-flex items-center">
              <ArrowLeftIcon
                size={14}
                weight="bold"
                className="mr-3 inline-block group-hover:-translate-x-1.5 transition-transform duration-200"
                aria-hidden
              />
              Back to homepage
            </Link>
          </Button>
        </div>
        
      </div>
    </div>
  );
};

export default NotFound;