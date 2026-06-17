import { Link, useLocation, useNavigate } from "react-router";
import { ListIcon, UserIcon, LockKeyIcon, XIcon, CaretDownIcon, SquaresFourIcon, SignOutIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";


const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, loading, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";
 
  const fullName = currentUser
    ? `${currentUser.firstName} ${currentUser.lastName}`.trim()
    : "";
  const initials = currentUser
    ? `${currentUser.firstName?.[0] ?? ""}${currentUser.lastName?.[0] ?? ""}`.toUpperCase()
    : "";
 
  const handleLogout = async () => {
    setMobileMenuOpen(false);
    await logout();
    navigate("/");
  };
 
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
 
        {/* Desktop auth actions */}
        <nav className="hidden md:flex items-center gap-3" aria-label="Account">
          {!loading && !currentUser && !isAuthPage && (
            <>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-xs uppercase tracking-widest font-mono text-brand-light-grey/60 hover:text-white hover:bg-brand-dark-grey px-4"
              >
                <Link to="/login">
                  <UserIcon size={14} className="mr-2" aria-hidden="true" />
                  Log in
                </Link>
              </Button>
              <Button
                size="sm"
                asChild
                className="
                  relative text-xs uppercase tracking-widest font-mono font-bold
                  bg-transparent border border-brand-neon-green text-brand-neon-green
                  hover:bg-brand-neon-green hover:text-brand-bg
                  active:scale-[0.97]
                  transition-all duration-150
                  px-5 py-2 rounded-none
                "
              >
                <Link to="/register">
                  <LockKeyIcon size={14} className="mr-2" aria-hidden="true" />
                  Register
                </Link>
              </Button>
            </>
          )}
 
          {!loading && !currentUser && isAuthPage && (
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-xs uppercase tracking-widest font-mono text-brand-light-grey/60 hover:text-white hover:bg-brand-dark-grey px-4"
            >
              <Link to="/">
                <XIcon size={14} className="mr-2" aria-hidden="true" />
                Back to Home
              </Link>
            </Button>
          )}
 
          {!loading && currentUser && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex items-center gap-2.5 rounded-none px-2 py-1.5 text-left transition-colors hover:bg-brand-dark-grey focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-neon-green/50"
                  aria-label="Account menu"
                >
                  <Avatar className="h-8 w-8 rounded-none border border-brand-neon-green/40">
                    <AvatarFallback className="rounded-none bg-brand-neon-green/15 font-mono text-xs font-semibold text-brand-neon-green">
                      {initials || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="max-w-40 truncate font-mono text-sm text-white">
                    {fullName || currentUser.email}
                  </span>
                  <CaretDownIcon
                    size={14}
                    className="text-brand-light-grey/60"
                    aria-hidden="true"
                  />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 rounded-none border-white/10 bg-brand-dark-grey font-mono text-brand-light-grey"
              >
                <DropdownMenuItem asChild className="cursor-pointer focus:bg-white/5 focus:text-white">
                  <Link to="/dashboard">
                    <SquaresFourIcon size={16} className="mr-2" aria-hidden="true" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-red-400 focus:bg-red-500/10 focus:text-red-300"
                >
                  <SignOutIcon size={16} className="mr-2" aria-hidden="true" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </nav>
 
        {/* Mobile menu button */}
        <button
          className="md:hidden text-brand-light-grey/60 hover:text-white active:scale-90 transition-transform duration-150"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <XIcon size={22} /> : <ListIcon size={22} />}
        </button>
      </div>
 
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/5 bg-brand-bg/95 backdrop-blur-md px-4 py-4 space-y-3">
          {!loading && !currentUser && !isAuthPage && (
            <>
              <Button
                variant="ghost"
                className="w-full justify-start text-left text-xs uppercase tracking-widest font-mono text-brand-light-grey/60 hover:text-white hover:bg-brand-dark-grey px-0"
                asChild
              >
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <UserIcon size={14} className="mr-2" aria-hidden="true" />
                  Log in
                </Link>
              </Button>
              <Button
                className="w-full justify-start text-left text-xs uppercase tracking-widest font-mono font-bold
                  bg-transparent border border-brand-neon-green text-brand-neon-green
                  hover:bg-brand-neon-green hover:text-brand-bg
                  active:scale-[0.97]
                  transition-all duration-150
                  px-5 py-2 rounded-none"
                asChild
              >
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <LockKeyIcon size={14} className="mr-2" aria-hidden="true" />
                  Register
                </Link>
              </Button>
            </>
          )}
 
          {!loading && !currentUser && isAuthPage && (
            <Button
              variant="ghost"
              className="w-full justify-start text-left text-xs uppercase tracking-widest font-mono text-brand-light-grey/60 hover:text-white hover:bg-brand-dark-grey px-0"
              asChild
            >
              <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                <XIcon size={14} className="mr-2" aria-hidden="true" />
                Back to Home
              </Link>
            </Button>
          )}
 
          {!loading && currentUser && (
            <>
              <div className="flex items-center gap-3 px-0 py-2">
                <Avatar className="h-9 w-9 rounded-none border border-brand-neon-green/40">
                  <AvatarFallback className="rounded-none bg-brand-neon-green/15 font-mono text-xs font-semibold text-brand-neon-green">
                    {initials || "?"}
                  </AvatarFallback>
                </Avatar>
                <span className="truncate font-mono text-sm text-white">
                  {fullName || currentUser.email}
                </span>
              </div>
              <Button
                variant="ghost"
                className="w-full justify-start text-left text-xs uppercase tracking-widest font-mono text-brand-light-grey/60 hover:text-white hover:bg-brand-dark-grey px-0"
                asChild
              >
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  <SquaresFourIcon size={14} className="mr-2" aria-hidden="true" />
                  Dashboard
                </Link>
              </Button>
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="w-full justify-start text-left text-xs uppercase tracking-widest font-mono text-red-400 hover:text-red-300 hover:bg-red-500/10 px-0"
              >
                <SignOutIcon size={14} className="mr-2" aria-hidden="true" />
                Log out
              </Button>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;