import { Button } from "@/components/ui/button";
import { useLetterStore } from "@/stores/useLetterStore";

const Step4Preview = () => {
  const subject = useLetterStore((s) => s.subject);
  const body = useLetterStore((s) => s.body);
  const extras = useLetterStore((s) => s.extras);
  const recipientName = useLetterStore((s) => s.recipientName);
  const recipientAddress = useLetterStore((s) => s.recipientAddress);
  const senderName = useLetterStore((s) => s.senderName);
  const senderEmail = useLetterStore((s) => s.senderEmail);
  const nextStep = useLetterStore((s) => s.nextStep);
  const prevStep = useLetterStore((s) => s.prevStep);

  return (
    <div className="space-y-6">
      <p className="text-brand-light-grey/70 text-sm font-mono">
        Review your letter before checkout.
      </p>

      <div className="space-y-4 rounded-none border border-white/10 bg-brand-dark-grey/40 p-6">
        <div>
          <span className="text-[10px] uppercase tracking-widest font-mono text-brand-light-grey/50">
            Subject
          </span>
          <p className="mt-1 text-base font-medium text-white">{subject || "(No subject)"}</p>
        </div>

        <div>
          <span className="text-[10px] uppercase tracking-widest font-mono text-brand-light-grey/50">
            Letter
          </span>
          <p className="mt-1 text-sm leading-relaxed text-brand-light-grey/90 whitespace-pre-wrap">
            {body || "(No content)"}
          </p>
        </div>

        {extras.length > 0 && (
          <div>
            <span className="text-[10px] uppercase tracking-widest font-mono text-brand-light-grey/50">
              Extras
            </span>
            <div className="mt-1 flex flex-wrap gap-2">
              {extras.map((e) => (
                <span
                  key={e}
                  className="rounded-none bg-brand-neon-green/10 px-2.5 py-1 text-xs font-mono text-brand-neon-green capitalize"
                >
                  {e}
                </span>
              ))}
            </div>
          </div>
        )}

        <hr className="border-white/10" />

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-[10px] uppercase tracking-widest font-mono text-brand-light-grey/50">
              To
            </span>
            <p className="mt-0.5 text-white">{recipientName || "(Not set)"}</p>
            <p className="text-brand-light-grey/70">{recipientAddress}</p>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-widest font-mono text-brand-light-grey/50">
              From
            </span>
            <p className="mt-0.5 text-white">{senderName || "(Not set)"}</p>
            <p className="text-brand-light-grey/70">{senderEmail}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-2">
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
          Proceed to Checkout
        </Button>
      </div>
    </div>
  );
};

export default Step4Preview;
