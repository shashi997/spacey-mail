import { Link } from "react-router";
import { List } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-brand-bg/95 backdrop-blur-md">
      {/* Airmail stripe — the one analog detail that grounds the brand */}
      <div
        className="h-1 w-full"
        style={{
          background:
            "repeating-linear-gradient(90deg, #32FCC7 0px, #32FCC7 12px, #080808 12px, #080808 16px, #1AD6FF 16px, #1AD6FF 28px, #080808 28px, #080808 32px)",
        }}
        aria-hidden="true"
      />

      <div className="container mx-auto flex h-14 items-center justify-between px-4 md:px-6">

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 group transition-opacity duration-150 hover:opacity-75"
        >
          <img
            src="/PrimaryLogo_colouredfull.png"
            alt="Spacey Mail logo"
            className="h-7 w-auto object-contain"
            onError={(e) => { e.currentTarget.style.display = "none"; }}
          />
          <span className="text-base font-bold tracking-tight text-white font-heading">
            Mail
          </span>
          {/* Postmark dot — subtle brand detail */}
          <span
            className="w-1.5 h-1.5 rounded-full bg-brand-neon-green opacity-80 group-hover:opacity-100 transition-opacity"
            aria-hidden="true"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
          {[
            { label: "Home", to: "/" },
            { label: "Features", to: "#features" },
            { label: "Pricing", to: "/pricing" },
            { label: "About", to: "/about" },
          ].map(({ label, to }) => (
            <Link
              key={label}
              to={to}
              className="text-xs uppercase tracking-widest font-mono text-brand-light-grey/60 hover:text-brand-neon-green transition-colors duration-150"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Auth actions */}
        <div className="hidden md:flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs uppercase tracking-widest font-mono text-brand-light-grey/60 hover:text-white hover:bg-brand-dark-grey px-4"
          >
            Log in
          </Button>
          <Button
            size="sm"
            className="
              relative text-xs uppercase tracking-widest font-mono font-bold
              bg-transparent border border-brand-neon-green text-brand-neon-green
              hover:bg-brand-neon-green hover:text-brand-bg
              active:scale-[0.97]
              transition-all duration-150
              px-5 py-2 rounded-none
            "
          >
            Start writing
          </Button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-brand-light-grey/60 hover:text-white active:scale-90 transition-transform duration-150"
          aria-label="Open menu"
        >
          <List size={22} />
        </button>
      </div>
    </header>
  );
};

export default Header;