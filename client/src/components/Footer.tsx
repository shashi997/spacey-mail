import { Link } from "react-router";
import { EnvelopeSimple } from "@phosphor-icons/react";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-white/5 bg-brand-bg">
      {/* Airmail stripe — mirrors header */}
      <div
        className="h-px w-full"
        style={{
          background:
            "repeating-linear-gradient(90deg, #32FCC7 0px, #32FCC7 12px, #080808 12px, #080808 16px, #1AD6FF 16px, #1AD6FF 28px, #080808 28px, #080808 32px)",
        }}
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 md:px-6 py-10 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-end">

        {/* Left: brand blurb */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <EnvelopeSimple size={16} className="text-brand-neon-green" aria-hidden />
            <span className="text-sm font-bold text-white font-heading tracking-tight">
              Spacey Mail
            </span>
          </div>
          <p className="text-xs font-mono text-brand-light-grey/30 max-w-xs leading-relaxed">
            Digital drafts to physical mail. Shipped the next business day,
            tracked by SMS, received with care.
          </p>
          <p className="text-xs font-mono text-brand-light-grey/20">
            © {year} Spacey Science Ltd. All rights reserved.
          </p>
        </div>

        {/* Right: nav links */}
        <nav
          className="flex flex-wrap gap-x-8 gap-y-3"
          aria-label="Footer navigation"
        >
          {[
            { label: "Features", to: "#features" },
            { label: "Pricing", to: "/pricing" },
            { label: "About", to: "/about" },
            { label: "Privacy", to: "/privacy" },
            { label: "Terms", to: "/terms" },
          ].map(({ label, to }) => (
            <Link
              key={label}
              to={to}
              className="text-xs uppercase tracking-widest font-mono text-brand-light-grey/30 hover:text-brand-neon-green transition-colors duration-150"
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