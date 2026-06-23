import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useLetterStore } from "@/stores/useLetterStore";
import LetterEditor from "@/components/LetterEditor";
import PaperColorPicker, { PAPER_COLORS } from "@/components/PaperColorPicker";
import AuthGateDialog from "./AuthGateDialog";

const Step1Editor = () => {
  const { currentUser } = useAuth();
  const body = useLetterStore((s) => s.body);
  const paperColor = useLetterStore((s) => s.paperColor);
  const updateStep1 = useLetterStore((s) => s.updateStep1);
  const nextStep = useLetterStore((s) => s.nextStep);

  const [showAuthGate, setShowAuthGate] = useState(false);

  const handleBodyChange = (html: string, delta: unknown) => {
    updateStep1({ body: html, bodyDelta: delta });
  };

  const handlePaperColorChange = (color: string) => {
    updateStep1({ paperColor: color });
  };

  const handleSaveAndContinue = () => {
    if (!currentUser) {
      setShowAuthGate(true);
    } else {
      nextStep();
    }
  };

  const selectedColor = PAPER_COLORS.find((c) => c.value === paperColor) ?? PAPER_COLORS[0];

  return (
    <>
      <div className="space-y-6">
        <PaperColorPicker value={paperColor} onChange={handlePaperColorChange} />

        <div>
          <LetterEditor
            value={body}
            onChange={handleBodyChange}
            placeholder="Start writing your letter here..."
            paperColor={selectedColor.bg}
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
