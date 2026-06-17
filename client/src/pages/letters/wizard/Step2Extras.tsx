import { Button } from "@/components/ui/button";
import { useLetterStore } from "@/stores/useLetterStore";

const Step2Extras = () => {
  const extras = useLetterStore((s) => s.extras);
  const updateStep2 = useLetterStore((s) => s.updateStep2);
  const nextStep = useLetterStore((s) => s.nextStep);
  const prevStep = useLetterStore((s) => s.prevStep);

  const toggleExtra = (id: string) => {
    const next = extras.includes(id)
      ? extras.filter((e) => e !== id)
      : [...extras, id];
    updateStep2({ extras: next });
  };

  return (
    <div className="space-y-6">
      <p className="text-brand-light-grey/70 text-sm font-mono">
        Choose any extras to include with your letter.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {["photo", "sticker", "drawing", "gift"].map((item) => {
          const selected = extras.includes(item);
          return (
            <button
              key={item}
              type="button"
              onClick={() => toggleExtra(item)}
              className={`flex items-center gap-3 rounded-none border p-4 text-left transition-colors ${
                selected
                  ? "border-brand-neon-green bg-brand-neon-green/10 text-white"
                  : "border-white/10 bg-brand-dark-grey/40 text-brand-light-grey/70 hover:border-white/20 hover:text-white"
              }`}
            >
              <div
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-none border text-xs font-bold ${
                  selected
                    ? "border-brand-neon-green bg-brand-neon-green text-brand-bg"
                    : "border-white/20"
                }`}
              >
                {selected ? "✓" : ""}
              </div>
              <span className="text-sm font-medium capitalize">{item}</span>
            </button>
          );
        })}
      </div>

      <div className="flex justify-between pt-4">
        <Button
          onClick={prevStep}
          variant="outline"
          className="h-12 px-6 text-sm font-mono rounded-none border-white/20 bg-transparent text-white hover:bg-white/5"
        >
          Back
        </Button>
        <Button
          onClick={nextStep}
          className="h-12 px-6 text-sm uppercase tracking-widest font-mono font-bold rounded-none"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default Step2Extras;
