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
import { Checkbox } from "@/components/ui/checkbox";

import { useAuth } from "@/contexts/AuthContext";

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  termsAccepted: boolean;
}

interface FieldErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  termsAccepted?: string;
}

const INITIAL_VALUES: FormValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  termsAccepted: false,
};

// Maps Firebase's stable error codes to copy people can act on. Kept in
// the page (not AuthContext) since the context shouldn't know about UI.
const getAuthErrorMessage = (err: unknown): string => {
  if (err instanceof FirebaseError) {
    switch (err.code) {
      case "auth/email-already-in-use":
        return "An account already exists with this email. Try logging in instead.";
      case "auth/invalid-email":
        return "That email address doesn't look right.";
      case "auth/weak-password":
        return "Please choose a stronger password.";
      case "auth/popup-closed-by-user":
        return "Sign-in was cancelled.";
      case "auth/too-many-requests":
        return "Too many attempts. Please wait a moment and try again.";
      default:
        return "Something went wrong while creating your account. Please try again.";
    }
  }
  return "Something went wrong while creating your account. Please try again.";
};

const validate = (values: FormValues): FieldErrors => {
  const errors: FieldErrors = {};

  if (!values.firstName.trim()) errors.firstName = "First name is required.";
  if (!values.lastName.trim()) errors.lastName = "Last name is required.";

  if (!values.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!values.password) {
    errors.password = "Password is required.";
  } else if (values.password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = "Please confirm your password.";
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = "Passwords don't match.";
  }

  if (!values.termsAccepted) {
    errors.termsAccepted = "You must agree to continue.";
  }

  return errors;
};

const Register = () => {
  const navigate = useNavigate();
  const { signup, loginWithGoogle, currentUser, loading } = useAuth();

  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);

  // Navigate only once AuthContext's onAuthStateChanged listener has
  // actually populated currentUser (see Login.tsx for the full
  // explanation of why navigating right after signup()/loginWithGoogle()
  // resolves is a race condition).
  useEffect(() => {
    if (!loading && currentUser) {
      navigate("/dashboard", { replace: true });
    }
  }, [currentUser, loading, navigate]);

  const updateField = <K extends keyof FormValues>(
    field: K,
    value: FormValues[K]
  ) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    // Clear the error for this field as soon as the person edits it,
    // rather than leaving stale errors visible after a correction.
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const errors = validate(values);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    try {
      await signup(
        values.email.trim(),
        values.password,
        values.firstName.trim(),
        values.lastName.trim()
      );
      // No navigate() here — the useEffect above handles it once
      // currentUser is actually populated.
    } catch (err) {
      setFormError(getAuthErrorMessage(err));
      setSubmitting(false);
    }
  };

  const handleGoogleSignup = async () => {
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

  const isBusy = submitting || googleSubmitting;

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
              Register
            </h1>
            <p className="text-lg text-brand-light-grey/80 font-mono leading-relaxed">
              Write and send letters easily.
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
              value={values.email}
              onChange={(e) => updateField("email", e.target.value)}
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
            <Label
              htmlFor="password"
              className="text-sm uppercase tracking-widest font-mono text-brand-light-grey/80"
            >
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="your password"
                autoComplete="new-password"
                required
                value={values.password}
                onChange={(e) => updateField("password", e.target.value)}
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

          <div className="space-y-2.5">
            <Label
              htmlFor="confirmPassword"
              className="text-sm uppercase tracking-widest font-mono text-brand-light-grey/80"
            >
              Confirm Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="your new password again"
                autoComplete="new-password"
                required
                value={values.confirmPassword}
                onChange={(e) =>
                  updateField("confirmPassword", e.target.value)
                }
                aria-invalid={!!fieldErrors.confirmPassword}
                aria-describedby={
                  fieldErrors.confirmPassword
                    ? "confirmPassword-error"
                    : undefined
                }
                disabled={isBusy}
                className="h-12 text-base pr-12 bg-brand-dark-grey/80 border-white/20 focus:border-brand-neon-green focus:ring-brand-neon-green/30 text-white placeholder:text-brand-light-grey/50"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-light-grey/60 hover:text-white transition-colors focus:outline-none"
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
              >
                {showConfirmPassword ? (
                  <EyeSlash size={22} />
                ) : (
                  <Eye size={22} />
                )}
              </button>
            </div>
            {fieldErrors.confirmPassword && (
              <p
                id="confirmPassword-error"
                className="text-sm font-mono text-red-400"
              >
                {fieldErrors.confirmPassword}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2.5">
              <Label
                htmlFor="firstName"
                className="text-sm uppercase tracking-widest font-mono text-brand-light-grey/80"
              >
                First Name
              </Label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                placeholder="your name"
                autoComplete="given-name"
                required
                value={values.firstName}
                onChange={(e) => updateField("firstName", e.target.value)}
                aria-invalid={!!fieldErrors.firstName}
                aria-describedby={
                  fieldErrors.firstName ? "firstName-error" : undefined
                }
                disabled={isBusy}
                className="h-12 text-base bg-brand-dark-grey/80 border-white/20 focus:border-brand-neon-green focus:ring-brand-neon-green/30 text-white placeholder:text-brand-light-grey/50"
              />
              {fieldErrors.firstName && (
                <p
                  id="firstName-error"
                  className="text-sm font-mono text-red-400"
                >
                  {fieldErrors.firstName}
                </p>
              )}
            </div>
            <div className="space-y-2.5">
              <Label
                htmlFor="lastName"
                className="text-sm uppercase tracking-widest font-mono text-brand-light-grey/80"
              >
                Last Name
              </Label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                placeholder="your last name"
                autoComplete="family-name"
                required
                value={values.lastName}
                onChange={(e) => updateField("lastName", e.target.value)}
                aria-invalid={!!fieldErrors.lastName}
                aria-describedby={
                  fieldErrors.lastName ? "lastName-error" : undefined
                }
                disabled={isBusy}
                className="h-12 text-base bg-brand-dark-grey/80 border-white/20 focus:border-brand-neon-green focus:ring-brand-neon-green/30 text-white placeholder:text-brand-light-grey/50"
              />
              {fieldErrors.lastName && (
                <p
                  id="lastName-error"
                  className="text-sm font-mono text-red-400"
                >
                  {fieldErrors.lastName}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-start gap-3 py-2">
              <Checkbox
                id="terms"
                name="terms"
                required
                checked={values.termsAccepted}
                onCheckedChange={(checked) =>
                  updateField("termsAccepted", checked === true)
                }
                disabled={isBusy}
                aria-invalid={!!fieldErrors.termsAccepted}
                className="mt-1 h-5 w-5 border-white/30 bg-brand-dark-grey/80 focus:ring-brand-neon-green focus:ring-offset-brand-bg data-[state=checked]:bg-brand-neon-green data-[state=checked]:border-brand-neon-green"
              />
              <Label
                htmlFor="terms"
                className="text-sm text-brand-light-grey/80 font-mono leading-relaxed pt-0.5"
              >
                I have read and agree to the{" "}
                <Link
                  to="/privacy"
                  className="text-brand-neon-green hover:text-brand-neon-blue underline underline-offset-2 transition-colors"
                >
                  Privacy Policy
                </Link>{" "}
                and{" "}
                <Link
                  to="/terms"
                  className="text-brand-neon-green hover:text-brand-neon-blue underline underline-offset-2 transition-colors"
                >
                  Terms
                </Link>
              </Label>
            </div>
            {fieldErrors.termsAccepted && (
              <p className="text-sm font-mono text-red-400">
                {fieldErrors.termsAccepted}
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
                Creating account...
              </span>
            ) : (
              "Register"
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
            onClick={handleGoogleSignup}
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

        {/* Login link */}
        <div className="flex flex-col items-center gap-2 pt-4">
          <p className="text-base text-brand-light-grey/70 font-mono">
            Are you already a member?
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-brand-neon-green hover:text-brand-neon-blue text-base font-medium underline underline-offset-4 transition-colors"
          >
            Click here to log in! <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;