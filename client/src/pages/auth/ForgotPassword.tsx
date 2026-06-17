import { useState, type FormEvent } from "react";
import { Link } from "react-router";
import { FirebaseError } from "firebase/app";
import {
  ArrowLeft,
  CircleNotch,
  CheckCircle,
} from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useAuth } from "@/contexts/AuthContext";

const getAuthErrorMessage = (err: unknown): string => {
  if (err instanceof FirebaseError) {
    switch (err.code) {
      case "auth/invalid-email":
        return "That email address doesn't look right.";
      case "auth/too-many-requests":
        return "Too many attempts. Please wait a moment and try again.";
      default:
        return "Something went wrong. Please try again.";
    }
  }
  return "Something went wrong. Please try again.";
};

const ForgotPassword = () => {
  const { forgotPassword } = useAuth();

  const [email, setEmail] = useState("");
  const [fieldError, setFieldError] = useState<string | undefined>();
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!email.trim()) {
      setFieldError("Email is required.");
      return;
    }
    setFieldError(undefined);

    setSubmitting(true);
    try {
      await forgotPassword(email.trim());
      // Show a generic success state regardless of whether the address
      // is registered — this avoids confirming/denying account
      // existence to whoever is typing in the form.
      setSubmitted(true);
    } catch (err) {
      if (err instanceof FirebaseError && err.code === "auth/user-not-found") {
        setSubmitted(true);
      } else {
        setFormError(getAuthErrorMessage(err));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-bg px-4 py-12 sm:py-16">
      <div className="w-full max-w-md space-y-8">
        {/* Header with back arrow */}
        <div className="space-y-6">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-brand-light-grey/80 hover:text-white transition-colors"
          >
            <ArrowLeft size={24} aria-hidden="true" />
            <span className="text-sm uppercase tracking-widest font-mono">
              Back to Log In
            </span>
          </Link>

          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-white font-heading">
              Reset password
            </h1>
            <p className="text-lg text-brand-light-grey/80 font-mono leading-relaxed">
              {submitted
                ? "Check your inbox for a reset link."
                : "We'll email you a link to reset your password."}
            </p>
          </div>
        </div>

        {submitted ? (
          <div className="space-y-6">
            <div className="flex flex-col items-center gap-3 border border-white/10 bg-brand-dark-grey/40 px-6 py-10 text-center">
              <CheckCircle
                size={36}
                weight="fill"
                className="text-brand-neon-green"
                aria-hidden="true"
              />
              <p className="font-mono text-base text-white">
                If an account exists for{" "}
                <span className="text-brand-neon-green">{email}</span>, a
                reset link is on its way.
              </p>
              <p className="font-mono text-sm text-brand-light-grey/60">
                Didn't get it? Check spam, or try again in a few minutes.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => setSubmitted(false)}
              className="w-full h-12 font-mono text-sm uppercase tracking-widest rounded-none border-white/20 bg-transparent text-white hover:bg-white/5 hover:text-white"
            >
              Try a different email
            </Button>
          </div>
        ) : (
          <>
            {formError && (
              <div
                role="alert"
                className="rounded-md border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm font-mono text-red-300"
              >
                {formError}
              </div>
            )}

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
                    setFieldError(undefined);
                  }}
                  aria-invalid={!!fieldError}
                  aria-describedby={fieldError ? "email-error" : undefined}
                  disabled={submitting}
                  className="h-12 text-base bg-brand-dark-grey/80 border-white/20 focus:border-brand-neon-green focus:ring-brand-neon-green/30 text-white placeholder:text-brand-light-grey/50"
                />
                {fieldError && (
                  <p id="email-error" className="text-sm font-mono text-red-400">
                    {fieldError}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full h-14 text-base uppercase tracking-widest font-mono font-bold rounded-none hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {submitting ? (
                  <span className="inline-flex items-center gap-2">
                    <CircleNotch size={20} className="animate-spin" />
                    Sending link...
                  </span>
                ) : (
                  "Send reset link"
                )}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;