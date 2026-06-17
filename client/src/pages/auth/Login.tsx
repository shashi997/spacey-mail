import { useState, useEffect, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { FirebaseError } from "firebase/app";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeSlash,
  GoogleLogo,
  CircleNotch,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useAuth } from "@/contexts/AuthContext";

interface FieldErrors {
  email?: string;
  password?: string;
}

// Maps Firebase's stable error codes to copy people can act on. Kept in
// the page (not AuthContext) since the context shouldn't know about UI.
const getAuthErrorMessage = (err: unknown): string => {
  if (err instanceof FirebaseError) {
    switch (err.code) {
      case "auth/invalid-credential":
      case "auth/wrong-password":
      case "auth/user-not-found":
        return "Incorrect email or password.";
      case "auth/invalid-email":
        return "That email address doesn't look right.";
      case "auth/too-many-requests":
        return "Too many attempts. Please wait a moment and try again.";
      case "auth/popup-closed-by-user":
        return "Sign-in was cancelled.";
      default:
        return "Something went wrong while logging in. Please try again.";
    }
  }
  return "Something went wrong while logging in. Please try again.";
};

const Login = () => {
  const navigate = useNavigate();
  const { login, loginWithGoogle, currentUser, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);

  const isBusy = submitting || googleSubmitting;

  // Navigate only once AuthContext's onAuthStateChanged listener has
  // actually populated currentUser. login()/loginWithGoogle() resolving
  // does NOT mean currentUser is set yet — that happens asynchronously
  // in a separate Firebase callback. Navigating directly after the
  // await was racing that callback and bouncing back to /login.
  useEffect(() => {
    if (!loading && currentUser) {
      navigate("/dashboard", { replace: true });
    }
  }, [currentUser, loading, navigate]);

  const validate = (): FieldErrors => {
    const errors: FieldErrors = {};
    if (!email.trim()) errors.email = "Email is required.";
    if (!password) errors.password = "Password is required.";
    return errors;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    try {
      await login(email.trim(), password);
      // No navigate() here — the useEffect above handles it once
      // currentUser is actually populated.
    } catch (err) {
      setFormError(getAuthErrorMessage(err));
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setFormError(null);
    setGoogleSubmitting(true);
    try {
      await loginWithGoogle();
      // Same as above — useEffect handles navigation.
    } catch (err) {
      setFormError(getAuthErrorMessage(err));
      setGoogleSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-bg px-4 py-12 sm:py-16">
      <div className="w-full max-w-md space-y-8">
        {/* Header with back arrow */}
        <div className="space-y-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-brand-light-grey/80 hover:text-white transition-colors"
          >
            <ArrowLeft size={24} aria-hidden="true" />
            <span className="text-sm uppercase tracking-widest font-mono">
              Back to Home
            </span>
          </Link>

          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-white font-heading">
              Log in
            </h1>
            <p className="text-lg text-brand-light-grey/80 font-mono leading-relaxed">
              Welcome back. Write and send letters easily.
            </p>
          </div>
        </div>

        {/* Server / Firebase error banner */}
        {formError && (
          <div
            role="alert"
            className="rounded-md border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm font-mono text-red-300"
          >
            {formError}
          </div>
        )}

        {/* Form */}
        <form className="space-y-6" noValidate onSubmit={handleSubmit}>
          <div className="space-y-2.5">
            <Label
              htmlFor="email"
              className="text-sm uppercase tracking-widest font-mono text-brand-light-grey/80"
            >
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="your email address"
              autoComplete="email"
              autoFocus
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setFieldErrors((prev) => ({ ...prev, email: undefined }));
              }}
              aria-invalid={!!fieldErrors.email}
              aria-describedby={fieldErrors.email ? "email-error" : undefined}
              disabled={isBusy}
              className="h-12 text-base bg-brand-dark-grey/80 border-white/20 focus:border-brand-neon-green focus:ring-brand-neon-green/30 text-white placeholder:text-brand-light-grey/50"
            />
            {fieldErrors.email && (
              <p id="email-error" className="text-sm font-mono text-red-400">
                {fieldErrors.email}
              </p>
            )}
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="password"
                className="text-sm uppercase tracking-widest font-mono text-brand-light-grey/80"
              >
                Password
              </Label>
              <Link
                to="/forgot-password"
                className="text-sm font-mono text-brand-neon-green hover:text-brand-neon-blue hover:underline underline-offset-2 transition-colors"
              >
                Forgot your password?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="your password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setFieldErrors((prev) => ({ ...prev, password: undefined }));
                }}
                aria-invalid={!!fieldErrors.password}
                aria-describedby={
                  fieldErrors.password ? "password-error" : undefined
                }
                disabled={isBusy}
                className="h-12 text-base pr-12 bg-brand-dark-grey/80 border-white/20 focus:border-brand-neon-green focus:ring-brand-neon-green/30 text-white placeholder:text-brand-light-grey/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-light-grey/60 hover:text-white transition-colors focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeSlash size={22} /> : <Eye size={22} />}
              </button>
            </div>
            {fieldErrors.password && (
              <p id="password-error" className="text-sm font-mono text-red-400">
                {fieldErrors.password}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isBusy}
            className="w-full h-14 text-base uppercase tracking-widest font-mono font-bold rounded-none hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {submitting ? (
              <span className="inline-flex items-center gap-2">
                <CircleNotch size={20} className="animate-spin" />
                Logging in...
              </span>
            ) : (
              "Log in"
            )}
          </Button>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-brand-bg px-3 text-xs uppercase tracking-widest font-mono text-brand-light-grey/50">
                Or
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleLogin}
            disabled={isBusy}
            className="w-full h-14 text-base font-mono font-medium rounded-none border-white/20 bg-transparent text-white hover:bg-white/5 hover:text-white transition-colors disabled:opacity-60"
          >
            {googleSubmitting ? (
              <span className="inline-flex items-center gap-2">
                <CircleNotch size={20} className="animate-spin" />
                Connecting to Google...
              </span>
            ) : (
              <span className="inline-flex items-center gap-2">
                <GoogleLogo size={20} weight="bold" />
                Continue with Google
              </span>
            )}
          </Button>
        </form>

        {/* Register link */}
        <div className="flex flex-col items-center gap-2 pt-4">
          <p className="text-base text-brand-light-grey/70 font-mono">
            Not a member?
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 text-brand-neon-green hover:text-brand-neon-blue text-base font-medium underline underline-offset-4 transition-colors"
          >
            Click here to register for free!{" "}
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;