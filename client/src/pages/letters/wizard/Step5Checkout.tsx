import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useLetterStore } from "@/stores/useLetterStore";
import { lettersApi } from "@/api/letters.api";
import { CircleNotch } from "@phosphor-icons/react";

const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;

const Step5Checkout = () => {
  const { currentUser } = useAuth();
  const prevStep = useLetterStore((s) => s.prevStep);
  const goToStep = useLetterStore((s) => s.goToStep);
  const store = useLetterStore.getState();

  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validate = (): string | null => {
    const s = useLetterStore.getState();

    if (!s.body || s.body === '<p><br></p>') return 'Step 1: Letter body is required';

    if (!s.recipient.name.trim()) return 'Step 3: Recipient name is required';
    if (!s.recipient.addressLine1.trim()) return 'Step 3: Recipient address is required';
    if (!s.recipient.city.trim()) return 'Step 3: Recipient city is required';
    if (s.recipient.state.length !== 2) return 'Step 3: Recipient state must be a 2-letter code';
    if (!s.recipient.zipCode.trim()) return 'Step 3: Recipient ZIP code is required';

    if (s.recipient.type === 'correctional') {
      if (!s.recipient.facilityName?.trim()) return 'Step 3: Facility name is required for correctional mail';
      if (!s.recipient.inmateId?.trim()) return 'Step 3: Inmate ID is required for correctional mail';
    }

    if (!s.sender.name.trim()) return 'Step 3: Sender name is required';
    if (!s.sender.email.trim()) return 'Step 3: Sender email is required';
    if (!s.sender.addressLine1.trim()) return 'Step 3: Sender address is required';
    if (!s.sender.city.trim()) return 'Step 3: Sender city is required';
    if (s.sender.state.length !== 2) return 'Step 3: Sender state must be a 2-letter code';
    if (!s.sender.zipCode.trim()) return 'Step 3: Sender ZIP code is required';

    return null;
  };

  const handleSend = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSending(true);
    setError(null);

    try {
      const storeState = useLetterStore.getState();
      const letterData = {
        category: storeState.category,
        currentStep: storeState.currentStep,
        body: storeState.body,
        bodyDelta: storeState.bodyDelta,
        paperColor: storeState.paperColor,
        extras: storeState.extras,
        recipient: storeState.recipient,
        sender: storeState.sender,
      };

      let letterId = storeState.letterId;
      if (letterId) {
        const res = await lettersApi.update(letterId, letterData);
        if (!res.success) throw new Error(res.error.message);
      } else {
        const res = await lettersApi.create(letterData);
        if (!res.success) throw new Error(res.error.message);
        letterId = res.data.id;
        useLetterStore.getState().setLetterId(letterId);
      }

      const checkoutRes = await lettersApi.createCheckout(letterId!);
      if (!checkoutRes.success) throw new Error(checkoutRes.error.message);

      window.location.href = checkoutRes.data.url;
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-brand-light-grey/70 text-sm font-mono">
        Review the summary and send your letter.
      </p>

      {currentUser && (
        <div className="rounded-none border border-white/10 bg-brand-dark-grey/40 p-6">
          <h3 className="text-xs uppercase tracking-widest font-mono text-brand-neon-green mb-4">
            Order Summary
          </h3>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-brand-light-grey/70">
              <span>Base price</span>
              <span>{formatPrice(store.pricing.basePriceInCents)}</span>
            </div>
            {store.pricing.extrasPriceInCents > 0 && (
              <div className="flex justify-between text-brand-light-grey/70">
                <span>Extras</span>
                <span>{formatPrice(store.pricing.extrasPriceInCents)}</span>
              </div>
            )}
            {store.pricing.facilityFeeInCents > 0 && (
              <div className="flex justify-between text-brand-light-grey/70">
                <span>Facility fee</span>
                <span>{formatPrice(store.pricing.facilityFeeInCents)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-white/10 pt-2 font-bold text-white text-base">
              <span>Total</span>
              <span>{formatPrice(store.pricing.totalPriceInCents)}</span>
            </div>
          </div>
        </div>
      )}

      {!currentUser && (
        <div className="rounded-none border border-yellow-500/40 bg-yellow-500/10 px-4 py-3 text-sm font-mono text-yellow-300">
          You need to be logged in to send a letter. Please log in or create an account.
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="rounded-none border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm font-mono text-red-300 whitespace-pre-wrap"
        >
          {error}
        </div>
      )}

      <div className="flex justify-between pt-4">
        <Button
          onClick={prevStep}
          variant="outline"
          disabled={sending}
          className="h-12 px-6 text-sm font-mono rounded-none border-white/20 bg-transparent text-white hover:bg-white/5"
        >
          Back
        </Button>

        <Button
          onClick={handleSend}
          disabled={sending || !currentUser}
          className="h-12 px-8 text-sm uppercase tracking-widest font-mono font-bold rounded-none disabled:opacity-60"
        >
          {sending ? (
            <span className="inline-flex items-center gap-2">
              <CircleNotch size={18} className="animate-spin" />
              Processing...
            </span>
          ) : (
            'Pay & Send Letter'
          )}
        </Button>
      </div>
    </div>
  );
};

export default Step5Checkout;
