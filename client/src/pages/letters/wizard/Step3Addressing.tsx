import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLetterStore } from "@/stores/useLetterStore";

const Step3Addressing = () => {
  const recipientName = useLetterStore((s) => s.recipientName);
  const recipientAddress = useLetterStore((s) => s.recipientAddress);
  const senderName = useLetterStore((s) => s.senderName);
  const senderEmail = useLetterStore((s) => s.senderEmail);
  const updateStep3 = useLetterStore((s) => s.updateStep3);
  const nextStep = useLetterStore((s) => s.nextStep);
  const prevStep = useLetterStore((s) => s.prevStep);

  return (
    <div className="space-y-6">
      <p className="text-brand-light-grey/70 text-sm font-mono">
        Who is this letter for?
      </p>

      <div className="space-y-2">
        <Label
          htmlFor="recipient-name"
          className="text-xs uppercase tracking-widest font-mono text-brand-light-grey/80"
        >
          Recipient Name
        </Label>
        <Input
          id="recipient-name"
          type="text"
          placeholder="Full name of the recipient"
          value={recipientName}
          onChange={(e) => updateStep3({ recipientName: e.target.value })}
          className="h-12 text-base bg-brand-dark-grey/80 border-white/20 focus:border-brand-neon-green text-white placeholder:text-brand-light-grey/50"
        />
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="recipient-address"
          className="text-xs uppercase tracking-widest font-mono text-brand-light-grey/80"
        >
          Recipient Address
        </Label>
        <Input
          id="recipient-address"
          type="text"
          placeholder="Facility / Address details"
          value={recipientAddress}
          onChange={(e) => updateStep3({ recipientAddress: e.target.value })}
          className="h-12 text-base bg-brand-dark-grey/80 border-white/20 focus:border-brand-neon-green text-white placeholder:text-brand-light-grey/50"
        />
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="sender-name"
          className="text-xs uppercase tracking-widest font-mono text-brand-light-grey/80"
        >
          Your Name (Sender)
        </Label>
        <Input
          id="sender-name"
          type="text"
          placeholder="Your full name"
          value={senderName}
          onChange={(e) => updateStep3({ senderName: e.target.value })}
          className="h-12 text-base bg-brand-dark-grey/80 border-white/20 focus:border-brand-neon-green text-white placeholder:text-brand-light-grey/50"
        />
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="sender-email"
          className="text-xs uppercase tracking-widest font-mono text-brand-light-grey/80"
        >
          Your Email
        </Label>
        <Input
          id="sender-email"
          type="email"
          placeholder="your email address"
          value={senderEmail}
          onChange={(e) => updateStep3({ senderEmail: e.target.value })}
          className="h-12 text-base bg-brand-dark-grey/80 border-white/20 focus:border-brand-neon-green text-white placeholder:text-brand-light-grey/50"
        />
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
          Preview
        </Button>
      </div>
    </div>
  );
};

export default Step3Addressing;
