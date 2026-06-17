import { useState, type FormEvent } from "react";
import { FirebaseError } from "firebase/app";
import {
  EnvelopeSimple,
  PencilSimple,
  SignOut,
  CircleNotch,
  Check,
  X,
} from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useAuth } from "@/contexts/AuthContext";

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

const Dashboard = () => {
  const { currentUser, logout, updateUserProfile } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(currentUser?.firstName ?? "");
  const [lastName, setLastName] = useState(currentUser?.lastName ?? "");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  const startEditing = () => {
    // Reset fields to current values each time editing starts, in case
    // a previous edit was cancelled mid-way.
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
                  {initials || "—"}
                </div>
                <div className="space-y-0.5">
                  <p className="text-lg font-medium text-white font-heading">
                    {fullName || "—"}
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
          <div className="border-b border-white/10 px-5 py-4 sm:px-6">
            <h2 className="text-sm uppercase tracking-widest font-mono text-brand-light-grey/80">
              Your letters
            </h2>
          </div>

          <div className="flex flex-col items-center gap-3 px-5 py-12 text-center sm:px-6">
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
        </section>
      </div>
    </div>
  );
};

export default Dashboard;