import { Link } from "react-router";
import { EnvelopeSimple } from "@phosphor-icons/react";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-white/10 bg-brand-bg">
      {/* Airmail stripe — mirrors header */}
      <div
        className="h-px w-full"
        style={{
          background:
            "repeating-linear-gradient(90deg, #32FCC7 0px, #32FCC7 12px, #080808 12px, #080808 16px, #1AD6FF 16px, #1AD6FF 28px, #080808 28px, #080808 32px)",
        }}
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 md:gap-12 items-start">

        {/* Left: brand blurb */}
        <div className="space-y-6 max-w-lg">
          <div className="flex items-center gap-2">
            <EnvelopeSimple size={20} className="text-brand-neon-green" aria-hidden />
            <span className="text-lg font-bold text-white font-heading tracking-tight">
              Spacey Mail
            </span>
          </div>
          <p className="text-sm font-mono text-brand-light-grey/70 leading-relaxed max-w-md">
            Our service allows you to easily send letters anytime, without the hassle of paper and pen. 
            The physical version of the letter you write through our site is printed using special printers, 
            enveloped, and mailed.
          </p>
          <p className="text-xs font-mono text-brand-light-grey/40">
            © {year} Spacey Science Ltd. All rights reserved.
          </p>
        </div>

        {/* Right: nav links - only essential legal links */}
        <nav
          className="flex flex-col gap-y-3 md:flex-row md:gap-x-8 md:items-center"
          aria-label="Footer navigation"
        >
          {[
            { label: "Privacy", to: "/privacy" },
            { label: "Terms", to: "/terms" },
          ].map(({ label, to }) => (
            <Link
              key={label}
              to={to}
              className="text-xs uppercase tracking-widest font-mono text-brand-light-grey/50 hover:text-white transition-colors duration-150"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
};

export default Footer;