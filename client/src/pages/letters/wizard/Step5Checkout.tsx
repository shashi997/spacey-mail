import { Button } from "@/components/ui/button";
import { useLetterStore } from "@/stores/useLetterStore";

const Step5Checkout = () => {
  const prevStep = useLetterStore((s) => s.prevStep);
  const reset = useLetterStore((s) => s.reset);

  const handleSend = () => {
    // TODO: Integrate with payment/backend to submit the letter
    reset();
  };

  return (
    <div className="space-y-6">
      <p className="text-brand-light-grey/70 text-sm font-mono">
        Review the summary and send your letter.
      </p>

      <div className="rounded-none border border-white/10 bg-brand-dark-grey/40 p-6 text-center">
        <p className="text-brand-light-grey/60 text-sm font-mono">
          Checkout & payment integration coming soon.
        </p>
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
          onClick={handleSend}
          className="h-12 px-8 text-sm uppercase tracking-widest font-mono font-bold rounded-none"
        >
          Send Letter
        </Button>
      </div>
    </div>
  );
};

export default Step5Checkout;
