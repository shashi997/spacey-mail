import { useState, useEffect, type FormEvent } from "react";
import { FirebaseError } from "firebase/app";
import {
  EnvelopeSimple,
  PencilSimple,
  SignOut,
  CircleNotch,
  Check,
  X,
  ArrowRight,
} from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useAuth } from "@/contexts/AuthContext";
import { lettersApi, type LetterResponse } from "@/api/letters.api";
import { useNavigate } from "react-router";

const getErrorMessage = (err: unknown): string => {
  if (err instanceof FirebaseError) {
    switch (err.code) {
      case "auth/requires-recent-login":
        return "For security, please log out and back in before changing your profile.";
      case "permission-denied":
        return "You don't have permission to update this profile.";
      default:
        return "Couldn't save your changes. Please try again.";
    }
  }
  return "Something went wrong. Please try again.";
};

const STATUS_COLORS: Record<string, string> = {
  draft: 'text-yellow-400',
  processing: 'text-brand-neon-blue',
  paid: 'text-brand-neon-green',
  failed: 'text-red-400',
  refunded: 'text-brand-light-grey/60',
  unpaid: 'text-yellow-400',
  pending_print: 'text-brand-neon-blue',
  printing: 'text-brand-neon-blue',
  shipped: 'text-brand-neon-green',
  delivered: 'text-brand-neon-green',
  returned: 'text-red-400',
};

const formatDate = (timestamp: any): string => {
  if (!timestamp) return '';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { currentUser, logout, updateUserProfile } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(currentUser?.firstName ?? "");
  const [lastName, setLastName] = useState(currentUser?.lastName ?? "");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  const [letters, setLetters] = useState<LetterResponse[]>([]);
  const [lettersLoading, setLettersLoading] = useState(true);
  const [lettersError, setLettersError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser) return;
    setLettersLoading(true);
    lettersApi.list().then((res) => {
      if (res.success) {
        setLetters(res.data);
        setLettersError(null);
      } else {
        setLettersError(res.error.message);
      }
      setLettersLoading(false);
    });
  }, [currentUser]);

  const startEditing = () => {
    setFirstName(currentUser?.firstName ?? "");
    setLastName(currentUser?.lastName ?? "");
    setSaveError(null);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setSaveError(null);
  };

  const handleSaveProfile = async (e: FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      setSaveError("First and last name can't be empty.");
      return;
    }

    setSaving(true);
    setSaveError(null);
    try {
      await updateUserProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });
      setIsEditing(false);
    } catch (err) {
      setSaveError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
    } finally {
      setLoggingOut(false);
    }
  };

  const fullName = currentUser
    ? `${currentUser.firstName} ${currentUser.lastName}`.trim()
    : "";
  const initials = currentUser
    ? `${currentUser.firstName?.[0] ?? ""}${currentUser.lastName?.[0] ?? ""}`.toUpperCase()
    : "";

  return (
    <div className="min-h-screen bg-brand-bg">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        {/* Page header */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-sm uppercase tracking-widest font-mono text-brand-neon-green">
              Dashboard
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-heading">
              {fullName ? `Hi, ${currentUser?.firstName}` : "Welcome back"}
            </h1>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleLogout}
            disabled={loggingOut}
            className="h-11 w-full sm:w-auto font-mono text-sm uppercase tracking-widest rounded-none border-white/20 bg-transparent text-white hover:bg-white/5 hover:text-white disabled:opacity-60"
          >
            {loggingOut ? (
              <span className="inline-flex items-center gap-2">
                <CircleNotch size={18} className="animate-spin" />
                Logging out...
              </span>
            ) : (
              <span className="inline-flex items-center gap-2">
                <SignOut size={18} />
                Log out
              </span>
            )}
          </Button>
        </div>

        {/* Profile card */}
        <section className="mt-10 border border-white/10 bg-brand-dark-grey/40">
          <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4 sm:px-6">
            <h2 className="text-sm uppercase tracking-widest font-mono text-brand-light-grey/80">
              Your profile
            </h2>
            {!isEditing && (
              <button
                type="button"
                onClick={startEditing}
                className="inline-flex items-center gap-1.5 text-sm font-mono text-brand-neon-green hover:text-brand-neon-blue transition-colors"
              >
                <PencilSimple size={16} />
                Edit
              </button>
            )}
          </div>

          <div className="px-5 py-6 sm:px-6">
            {!isEditing ? (
              <div className="flex items-center gap-4">
                <div
                  aria-hidden="true"
                  className="flex h-14 w-14 shrink-0 items-center justify-center bg-brand-neon-green/15 font-heading text-lg font-semibold text-brand-neon-green"
                >
                  {initials || "\u2014"}
                </div>
                <div className="space-y-0.5">
                  <p className="text-lg font-medium text-white font-heading">
                    {fullName || "\u2014"}
                  </p>
                  <p className="text-sm font-mono text-brand-light-grey/70">
                    {currentUser?.email}
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSaveProfile} className="space-y-5">
                {saveError && (
                  <div
                    role="alert"
                    className="rounded-md border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm font-mono text-red-300"
                  >
                    {saveError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="firstName"
                      className="text-sm uppercase tracking-widest font-mono text-brand-light-grey/80"
                    >
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      disabled={saving}
                      className="h-12 text-base bg-brand-dark-grey/80 border-white/20 focus:border-brand-neon-green focus:ring-brand-neon-green/30 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="lastName"
                      className="text-sm uppercase tracking-widest font-mono text-brand-light-grey/80"
                    >
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      disabled={saving}
                      className="h-12 text-base bg-brand-dark-grey/80 border-white/20 focus:border-brand-neon-green focus:ring-brand-neon-green/30 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm uppercase tracking-widest font-mono text-brand-light-grey/80">
                    Email
                  </Label>
                  <p className="font-mono text-sm text-brand-light-grey/60">
                    {currentUser?.email}{" "}
                    <span className="text-brand-light-grey/40">
                      (can't be changed here)
                    </span>
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-1">
                  <Button
                    type="submit"
                    disabled={saving}
                    className="h-12 sm:w-auto font-mono text-sm uppercase tracking-widest rounded-none disabled:opacity-60"
                  >
                    {saving ? (
                      <span className="inline-flex items-center gap-2">
                        <CircleNotch size={18} className="animate-spin" />
                        Saving...
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2">
                        <Check size={18} />
                        Save changes
                      </span>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={cancelEditing}
                    disabled={saving}
                    className="h-12 sm:w-auto font-mono text-sm uppercase tracking-widest rounded-none border-white/20 bg-transparent text-white hover:bg-white/5 hover:text-white disabled:opacity-60"
                  >
                    <span className="inline-flex items-center gap-2">
                      <X size={18} />
                      Cancel
                    </span>
                  </Button>
                </div>
              </form>
            )}
          </div>
        </section>

        {/* Letters section */}
        <section className="mt-8 border border-white/10 bg-brand-dark-grey/40">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-6">
            <h2 className="text-sm uppercase tracking-widest font-mono text-brand-light-grey/80">
              Your letters
            </h2>
            <Button
              asChild
              variant="ghost"
              className="text-xs font-mono uppercase tracking-widest text-brand-neon-green hover:text-brand-neon-blue px-0"
            >
              <a href="/letter">
                New letter
                <ArrowRight size={14} className="ml-1" />
              </a>
            </Button>
          </div>

          <div className="px-5 py-6 sm:px-6">
            {lettersLoading ? (
              <div className="flex justify-center py-8">
                <CircleNotch size={24} className="animate-spin text-brand-neon-green" />
              </div>
            ) : lettersError ? (
              <div className="rounded-none border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm font-mono text-red-300">
                {lettersError}
              </div>
            ) : letters.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-8 text-center">
                <EnvelopeSimple
                  size={36}
                  className="text-brand-light-grey/30"
                  aria-hidden="true"
                />
                <p className="font-mono text-base text-brand-light-grey/70">
                  You haven't written any letters yet.
                </p>
                <p className="max-w-sm font-mono text-sm text-brand-light-grey/50">
                  Letters you draft or send will show up here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {letters.map((letter) => (
                  <div
                    key={letter.id}
                    className="flex items-center justify-between border border-white/10 bg-brand-dark-grey/20 px-4 py-3 transition-colors hover:border-white/20"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white truncate">
                          {(() => {
                            const txt = letter.body ? new DOMParser().parseFromString(letter.body, 'text/html').body.textContent || '' : '';
                            return txt.substring(0, 60) || 'Letter draft';
                          })()}
                        </span>
                        <span className="text-[10px] uppercase font-mono text-brand-light-grey/50 px-1.5 py-0.5 border border-white/10">
                          {letter.category}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-3 text-xs font-mono text-brand-light-grey/60">
                        <span>To: {letter.recipient.name}</span>
                        <span>&middot;</span>
                        <span>{formatDate(letter.createdAt)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      <span className={`text-[10px] uppercase font-mono font-bold ${STATUS_COLORS[letter.paymentStatus] || 'text-brand-light-grey/50'}`}>
                        {letter.paymentStatus}
                      </span>
                      {letter.paymentStatus === 'draft' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/letter/${letter.category}`)}
                          className="text-[10px] font-mono uppercase tracking-wider rounded-none border-white/20 bg-transparent text-brand-neon-green hover:bg-white/5 h-7 px-3"
                        >
                          Continue
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
