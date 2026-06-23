import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useLetterStore } from "@/stores/useLetterStore";
import AuthGateDialog from "./AuthGateDialog";

const Step1Editor = () => {
  const { currentUser } = useAuth();
  const subject = useLetterStore((s) => s.subject);
  const body = useLetterStore((s) => s.body);
  const updateStep1 = useLetterStore((s) => s.updateStep1);
  const nextStep = useLetterStore((s) => s.nextStep);

  const [showAuthGate, setShowAuthGate] = useState(false);

  const handleSaveAndContinue = () => {
    updateStep1({ subject, body });
    if (!currentUser) {
      setShowAuthGate(true);
    } else {
      nextStep();
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="space-y-2">
          <Label
            htmlFor="letter-subject"
            className="text-xs uppercase tracking-widest font-mono text-brand-light-grey/80"
          >
            Subject
          </Label>
          <Input
            id="letter-subject"
            type="text"
            placeholder="Your letter subject..."
            value={subject}
            onChange={(e) => updateStep1({ subject: e.target.value })}
            className="h-12 text-base bg-brand-dark-grey/80 border-white/20 focus:border-brand-neon-green focus:ring-brand-neon-green/30 text-white placeholder:text-brand-light-grey/50"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="letter-body"
            className="text-xs uppercase tracking-widest font-mono text-brand-light-grey/80"
          >
            Your letter
          </Label>
          <Textarea
            id="letter-body"
            placeholder="Start writing your letter here..."
            value={body}
            onChange={(e) => updateStep1({ body: e.target.value })}
            className="min-h-62.5 text-base bg-brand-dark-grey/80 border-white/20 focus:border-brand-neon-green focus:ring-brand-neon-green/30 text-white placeholder:text-brand-light-grey/50"
          />
        </div>

        <div className="flex justify-end pt-2">
          <Button
            onClick={handleSaveAndContinue}
            className="h-12 px-8 text-sm uppercase tracking-widest font-mono font-bold rounded-none"
          >
            Save & Continue
          </Button>
        </div>
      </div>

      <AuthGateDialog
        open={showAuthGate}
        onAuthSuccess={() => {
          setShowAuthGate(false);
          nextStep();
        }}
      />
    </>
  );
};

export default Step1Editor;
