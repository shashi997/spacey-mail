import { useState, type FormEvent } from "react";
import { FirebaseError } from "firebase/app";
import {
  GoogleLogo,
  CircleNotch,
  Eye,
  EyeSlash,
} from "@phosphor-icons/react";

import {
  Dialog, // Changed from DialogRoot
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";

type AuthView = "prompt" | "login" | "register";

interface AuthGateDialogProps {
  open: boolean;
  onAuthSuccess: () => void;
}

const getAuthErrorMessage = (err: unknown): string => {
  if (err instanceof FirebaseError) {
    switch (err.code) {
      case "auth/invalid-credential":
      case "auth/wrong-password":
      case "auth/user-not-found":
        return "Incorrect email or password.";
      case "auth/invalid-email":
        return "That email address doesn't look right.";
      case "auth/email-already-in-use":
        return "An account already exists with this email.";
      case "auth/weak-password":
        return "Please choose a stronger password (8+ characters).";
      case "auth/too-many-requests":
        return "Too many attempts. Please wait a moment and try again.";
      case "auth/popup-closed-by-user":
        return "Sign-in was cancelled.";
      default:
        return "Something went wrong. Please try again.";
    }
  }
  return "Something went wrong. Please try again.";
};

const AuthGateDialog = ({ open, onAuthSuccess }: AuthGateDialogProps) => {
  const { login, signup, loginWithGoogle } = useAuth();
  const [view, setView] = useState<AuthView>("prompt");
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const isBusy = submitting;

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setShowPassword(false);
    setFirstName("");
    setLastName("");
    setFormError(null);
    setSubmitting(false);
  };

  const handleViewChange = (newView: AuthView) => {
    setView(newView);
    setFormError(null);
  };

  const handleSuccess = () => {
    resetForm();
    onAuthSuccess();
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);
    try {
      await login(email.trim(), password);
      handleSuccess();
    } catch (err) {
      setFormError(getAuthErrorMessage(err));
      setSubmitting(false);
    }
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!firstName.trim() || !lastName.trim()) {
      setFormError("First and last name are required.");
      setSubmitting(false);
      return;
    }
    if (password.length < 8) {
      setFormError("Password must be at least 8 characters.");
      setSubmitting(false);
      return;
    }

    setSubmitting(true);
    try {
      await signup(email.trim(), password, firstName.trim(), lastName.trim());
      handleSuccess();
    } catch (err) {
      setFormError(getAuthErrorMessage(err));
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setFormError(null);
    setSubmitting(true);
    try {
      await loginWithGoogle();
      handleSuccess();
    } catch (err) {
      setFormError(getAuthErrorMessage(err));
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        /* Block dismiss — user must auth or refresh */
      }}
    >
      <DialogContent
        showCloseButton={false} // Fixed prop name matching your dialog.tsx component definition
        onInteractOutside={(e: Event) => e.preventDefault()}
        onEscapeKeyDown={(e: KeyboardEvent) => e.preventDefault()}
        className="bg-brand-dark-grey border-white/10 text-white sm:max-w-md"
      >
        {view === "prompt" && (
          <>
            <DialogHeader className="gap-3">
              <DialogTitle className="text-lg font-bold text-white">
                Save your letter
              </DialogTitle>
              <DialogDescription className="text-sm leading-relaxed text-brand-light-grey/80">
                Your letter has not yet been saved because you are not logged
                in. To prevent your letter from being deleted, you must log in
                now or register if you are not already a member. After logging
                in, please return to this page to continue saving your letter.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-3 pt-2">
              <Button
                onClick={() => handleViewChange("login")}
                className="w-full h-12 text-sm uppercase tracking-widest font-mono font-bold rounded-none"
              >
                Log in
              </Button>
              <Button
                onClick={() => handleViewChange("register")}
                variant="outline"
                className="w-full h-12 text-sm font-mono font-medium rounded-none border-white/20 bg-transparent text-white hover:bg-white/5"
              >
                Register
              </Button>
            </div>
          </>
        )}

        {view === "login" && (
          <>
            <DialogHeader className="gap-3">
              <DialogTitle className="text-lg font-bold text-white">
                Log in
              </DialogTitle>
              <DialogDescription className="text-sm text-brand-light-grey/80">
                Sign in to save your letter and continue.
              </DialogDescription>
            </DialogHeader>

            {formError && (
              <div
                role="alert"
                className="rounded-none border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm font-mono text-red-300"
              >
                {formError}
              </div>
            )}

            <form className="space-y-4" noValidate onSubmit={handleLogin}>
              <div className="space-y-2">
                <Label
                  htmlFor="gate-email"
                  className="text-xs uppercase tracking-widest font-mono text-brand-light-grey/80"
                >
                  Email
                </Label>
                <Input
                  id="gate-email"
                  type="email"
                  placeholder="your email address"
                  autoComplete="email"
                  autoFocus
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isBusy}
                  className="h-11 text-sm bg-brand-bg border-white/20 focus:border-brand-neon-green text-white placeholder:text-brand-light-grey/50"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="gate-password"
                  className="text-xs uppercase tracking-widest font-mono text-brand-light-grey/80"
                >
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="gate-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="your password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isBusy}
                    className="h-11 text-sm pr-12 bg-brand-bg border-white/20 focus:border-brand-neon-green text-white placeholder:text-brand-light-grey/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-light-grey/60 hover:text-white focus:outline-none"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isBusy}
                className="w-full h-12 text-sm uppercase tracking-widest font-mono font-bold rounded-none"
              >
                {submitting ? (
                  <span className="inline-flex items-center gap-2">
                    <CircleNotch size={18} className="animate-spin" />
                    Logging in...
                  </span>
                ) : (
                  "Log in"
                )}
              </Button>
            </form>

            <div className="relative py-1">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-brand-dark-grey px-3 text-xs uppercase tracking-widest font-mono text-brand-light-grey/50">
                  Or
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleGoogle}
              disabled={isBusy}
              className="w-full h-12 text-sm font-mono font-medium rounded-none border-white/20 bg-transparent text-white hover:bg-white/5"
            >
              {submitting && !formError ? (
                <span className="inline-flex items-center gap-2">
                  <CircleNotch size={18} className="animate-spin" />
                  Connecting...
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  <GoogleLogo size={18} weight="bold" />
                  Continue with Google
                </span>
              )}
            </Button>

            <DialogFooter className="justify-center pt-1">
              <button
                type="button"
                onClick={() => handleViewChange("prompt")}
                className="text-sm text-brand-light-grey/60 hover:text-brand-neon-green transition-colors"
              >
                Back
              </button>
            </DialogFooter>
          </>
        )}

        {view === "register" && (
          <>
            <DialogHeader className="gap-2">
              <DialogTitle className="text-lg font-bold text-white">
                Create an account
              </DialogTitle>
              <DialogDescription className="text-sm text-brand-light-grey/80">
                Register to save your letter and continue.
              </DialogDescription>
            </DialogHeader>

            {formError && (
              <div
                role="alert"
                className="rounded-none border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm font-mono text-red-300"
              >
                {formError}
              </div>
            )}

            <form className="space-y-4" noValidate onSubmit={handleRegister}>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label
                    htmlFor="gate-firstName"
                    className="text-xs uppercase tracking-widest font-mono text-brand-light-grey/80"
                  >
                    First Name
                  </Label>
                  <Input
                    id="gate-firstName"
                    type="text"
                    placeholder="your name"
                    autoComplete="given-name"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={isBusy}
                    className="h-11 text-sm bg-brand-bg border-white/20 focus:border-brand-neon-green text-white placeholder:text-brand-light-grey/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="gate-lastName"
                    className="text-xs uppercase tracking-widest font-mono text-brand-light-grey/80"
                  >
                    Last Name
                  </Label>
                  <Input
                    id="gate-lastName"
                    type="text"
                    placeholder="your last name"
                    autoComplete="family-name"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={isBusy}
                    className="h-11 text-sm bg-brand-bg border-white/20 focus:border-brand-neon-green text-white placeholder:text-brand-light-grey/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="gate-reg-email"
                  className="text-xs uppercase tracking-widest font-mono text-brand-light-grey/80"
                >
                  Email
                </Label>
                <Input
                  id="gate-reg-email"
                  type="email"
                  placeholder="your email address"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isBusy}
                  className="h-11 text-sm bg-brand-bg border-white/20 focus:border-brand-neon-green text-white placeholder:text-brand-light-grey/50"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="gate-reg-password"
                  className="text-xs uppercase tracking-widest font-mono text-brand-light-grey/80"
                >
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="gate-reg-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="at least 8 characters"
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isBusy}
                    className="h-11 text-sm pr-12 bg-brand-bg border-white/20 focus:border-brand-neon-green text-white placeholder:text-brand-light-grey/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-light-grey/60 hover:text-white focus:outline-none"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isBusy}
                className="w-full h-12 text-sm uppercase tracking-widest font-mono font-bold rounded-none"
              >
                {submitting ? (
                  <span className="inline-flex items-center gap-2">
                    <CircleNotch size={18} className="animate-spin" />
                    Creating account...
                  </span>
                ) : (
                  "Register"
                )}
              </Button>
            </form>

            <div className="relative py-1">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-brand-dark-grey px-3 text-xs uppercase tracking-widest font-mono text-brand-light-grey/50">
                  Or
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleGoogle}
              disabled={isBusy}
              className="w-full h-12 text-sm font-mono font-medium rounded-none border-white/20 bg-transparent text-white hover:bg-white/5"
            >
              {submitting && !formError ? (
                <span className="inline-flex items-center gap-2">
                  <CircleNotch size={18} className="animate-spin" />
                  Connecting...
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  <GoogleLogo size={18} weight="bold" />
                  Continue with Google
                </span>
              )}
            </Button>

            <DialogFooter className="justify-center pt-1">
              <button
                type="button"
                onClick={() => handleViewChange("prompt")}
                className="text-sm text-brand-light-grey/60 hover:text-brand-neon-green transition-colors"
              >
                Back
              </button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthGateDialog;