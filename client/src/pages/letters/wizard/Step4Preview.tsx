import { Button } from "@/components/ui/button";
import { useLetterStore } from "@/stores/useLetterStore";

const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;

const Step4Preview = () => {
  const subject = useLetterStore((s) => s.subject);
  const body = useLetterStore((s) => s.body);
  const extras = useLetterStore((s) => s.extras);
  const recipient = useLetterStore((s) => s.recipient);
  const sender = useLetterStore((s) => s.sender);
  const pricing = useLetterStore((s) => s.pricing);
  const nextStep = useLetterStore((s) => s.nextStep);
  const prevStep = useLetterStore((s) => s.prevStep);

  const formatAddress = (addr: { addressLine1: string; addressLine2?: string; city: string; state: string; zipCode: string }) => {
    const parts = [addr.addressLine1];
    if (addr.addressLine2) parts.push(addr.addressLine2);
    parts.push(`${addr.city}, ${addr.state} ${addr.zipCode}`);
    return parts.join(', ');
  };

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
          <p className="mt-1 text-base font-medium text-white">{subject || '(No subject)'}</p>
        </div>

        <div>
          <span className="text-[10px] uppercase tracking-widest font-mono text-brand-light-grey/50">
            Letter
          </span>
          <p className="mt-1 text-sm leading-relaxed text-brand-light-grey/90 whitespace-pre-wrap">
            {body || '(No content)'}
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
            <p className="mt-0.5 text-white">{recipient.name || '(Not set)'}</p>
            <p className="text-brand-light-grey/70 text-xs">{formatAddress(recipient)}</p>
            {recipient.facilityName && (
              <p className="text-brand-light-grey/70 text-xs">Facility: {recipient.facilityName}</p>
            )}
            {recipient.inmateId && (
              <p className="text-brand-light-grey/70 text-xs">Inmate ID: {recipient.inmateId}</p>
            )}
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-widest font-mono text-brand-light-grey/50">
              From
            </span>
            <p className="mt-0.5 text-white">{sender.name || '(Not set)'}</p>
            <p className="text-brand-light-grey/70 text-xs">{sender.email}</p>
          </div>
        </div>

        <hr className="border-white/10" />

        <div>
          <span className="text-[10px] uppercase tracking-widest font-mono text-brand-light-grey/50">
            Price Breakdown
          </span>
          <div className="mt-2 space-y-1 text-sm">
            <div className="flex justify-between text-brand-light-grey/70">
              <span>Base price</span>
              <span>{formatPrice(pricing.basePriceInCents)}</span>
            </div>
            {pricing.extrasPriceInCents > 0 && (
              <div className="flex justify-between text-brand-light-grey/70">
                <span>Extras</span>
                <span>{formatPrice(pricing.extrasPriceInCents)}</span>
              </div>
            )}
            {pricing.facilityFeeInCents > 0 && (
              <div className="flex justify-between text-brand-light-grey/70">
                <span>Facility fee</span>
                <span>{formatPrice(pricing.facilityFeeInCents)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-white/10 pt-1 font-bold text-white">
              <span>Total</span>
              <span>{formatPrice(pricing.totalPriceInCents)}</span>
            </div>
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
