import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLetterStore } from "@/stores/useLetterStore";

const RECIPIENT_TYPES = [
  { value: 'standard', label: 'Standard' },
  { value: 'apo_fpo', label: 'APO / FPO (Military)' },
  { value: 'correctional', label: 'Correctional Facility' },
] as const;

const Step3Addressing = () => {
  const recipient = useLetterStore((s) => s.recipient);
  const sender = useLetterStore((s) => s.sender);
  const updateStep3 = useLetterStore((s) => s.updateStep3);
  const nextStep = useLetterStore((s) => s.nextStep);
  const prevStep = useLetterStore((s) => s.prevStep);

  const handleRecipientChange = (field: string, value: string) => {
    updateStep3({ recipient: { ...recipient, [field]: value } });
  };

  const handleSenderChange = (field: string, value: string) => {
    updateStep3({ sender: { ...sender, [field]: value } });
  };

  return (
    <div className="space-y-6">
      <p className="text-brand-light-grey/70 text-sm font-mono">
        Who is this letter for?
      </p>

      {/* Recipient Section */}
      <div className="space-y-4 rounded-none border border-white/10 bg-brand-dark-grey/40 p-5">
        <h3 className="text-xs uppercase tracking-widest font-mono text-brand-neon-green">
          Recipient
        </h3>

        <div className="space-y-2">
          <Label htmlFor="recipient-name" className="text-xs uppercase tracking-widest font-mono text-brand-light-grey/80">
            Full Name
          </Label>
          <Input
            id="recipient-name"
            placeholder="John Doe"
            value={recipient.name}
            onChange={(e) => handleRecipientChange('name', e.target.value)}
            className="h-11 text-sm bg-brand-bg border-white/20 focus:border-brand-neon-green text-white placeholder:text-brand-light-grey/50"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-widest font-mono text-brand-light-grey/80">
            Recipient Type
          </Label>
          <div className="flex flex-wrap gap-2">
            {RECIPIENT_TYPES.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => handleRecipientChange('type', value)}
                className={`px-4 py-2 text-xs font-mono uppercase tracking-wider transition-colors ${
                  recipient.type === value
                    ? 'bg-brand-neon-green text-brand-bg font-bold'
                    : 'border border-white/20 text-brand-light-grey/70 hover:border-white/40'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="recipient-addr1" className="text-xs uppercase tracking-widest font-mono text-brand-light-grey/80">
            Address Line 1
          </Label>
          <Input
            id="recipient-addr1"
            placeholder="Street address, P.O. box"
            value={recipient.addressLine1}
            onChange={(e) => handleRecipientChange('addressLine1', e.target.value)}
            className="h-11 text-sm bg-brand-bg border-white/20 focus:border-brand-neon-green text-white placeholder:text-brand-light-grey/50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="recipient-addr2" className="text-xs uppercase tracking-widest font-mono text-brand-light-grey/80">
            Address Line 2 <span className="text-brand-light-grey/40">(optional)</span>
          </Label>
          <Input
            id="recipient-addr2"
            placeholder="Apt, suite, unit, etc."
            value={recipient.addressLine2 ?? ''}
            onChange={(e) => handleRecipientChange('addressLine2', e.target.value)}
            className="h-11 text-sm bg-brand-bg border-white/20 focus:border-brand-neon-green text-white placeholder:text-brand-light-grey/50"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-1 space-y-2">
            <Label htmlFor="recipient-city" className="text-xs uppercase tracking-widest font-mono text-brand-light-grey/80">
              City
            </Label>
            <Input
              id="recipient-city"
              placeholder="City"
              value={recipient.city}
              onChange={(e) => handleRecipientChange('city', e.target.value)}
              className="h-11 text-sm bg-brand-bg border-white/20 focus:border-brand-neon-green text-white placeholder:text-brand-light-grey/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="recipient-state" className="text-xs uppercase tracking-widest font-mono text-brand-light-grey/80">
              State
            </Label>
            <Input
              id="recipient-state"
              placeholder="CA"
              maxLength={2}
              value={recipient.state}
              onChange={(e) => handleRecipientChange('state', e.target.value.toUpperCase())}
              className="h-11 text-sm bg-brand-bg border-white/20 focus:border-brand-neon-green text-white placeholder:text-brand-light-grey/50 uppercase"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="recipient-zip" className="text-xs uppercase tracking-widest font-mono text-brand-light-grey/80">
              ZIP Code
            </Label>
            <Input
              id="recipient-zip"
              placeholder="12345"
              maxLength={10}
              value={recipient.zipCode}
              onChange={(e) => handleRecipientChange('zipCode', e.target.value)}
              className="h-11 text-sm bg-brand-bg border-white/20 focus:border-brand-neon-green text-white placeholder:text-brand-light-grey/50"
            />
          </div>
        </div>

        {recipient.type === 'correctional' && (
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="space-y-2">
              <Label htmlFor="facility-name" className="text-xs uppercase tracking-widest font-mono text-brand-light-grey/80">
                Facility Name
              </Label>
              <Input
                id="facility-name"
                placeholder="e.g. San Quentin State Prison"
                value={recipient.facilityName ?? ''}
                onChange={(e) => handleRecipientChange('facilityName', e.target.value)}
                className="h-11 text-sm bg-brand-bg border-white/20 focus:border-brand-neon-green text-white placeholder:text-brand-light-grey/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inmate-id" className="text-xs uppercase tracking-widest font-mono text-brand-light-grey/80">
                Inmate ID
              </Label>
              <Input
                id="inmate-id"
                placeholder="Inmate identification number"
                value={recipient.inmateId ?? ''}
                onChange={(e) => handleRecipientChange('inmateId', e.target.value)}
                className="h-11 text-sm bg-brand-bg border-white/20 focus:border-brand-neon-green text-white placeholder:text-brand-light-grey/50"
              />
            </div>
          </div>
        )}
      </div>

      {/* Sender Section */}
      <div className="space-y-4 rounded-none border border-white/10 bg-brand-dark-grey/40 p-5">
        <h3 className="text-xs uppercase tracking-widest font-mono text-brand-neon-green">
          Your Details (Sender)
        </h3>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="sender-name" className="text-xs uppercase tracking-widest font-mono text-brand-light-grey/80">
              Your Name
            </Label>
            <Input
              id="sender-name"
              placeholder="Jane Doe"
              value={sender.name}
              onChange={(e) => handleSenderChange('name', e.target.value)}
              className="h-11 text-sm bg-brand-bg border-white/20 focus:border-brand-neon-green text-white placeholder:text-brand-light-grey/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sender-email" className="text-xs uppercase tracking-widest font-mono text-brand-light-grey/80">
              Your Email
            </Label>
            <Input
              id="sender-email"
              type="email"
              placeholder="jane@example.com"
              value={sender.email}
              onChange={(e) => handleSenderChange('email', e.target.value)}
              className="h-11 text-sm bg-brand-bg border-white/20 focus:border-brand-neon-green text-white placeholder:text-brand-light-grey/50"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sender-addr1" className="text-xs uppercase tracking-widest font-mono text-brand-light-grey/80">
            Your Address
          </Label>
          <Input
            id="sender-addr1"
            placeholder="Street address"
            value={sender.addressLine1}
            onChange={(e) => handleSenderChange('addressLine1', e.target.value)}
            className="h-11 text-sm bg-brand-bg border-white/20 focus:border-brand-neon-green text-white placeholder:text-brand-light-grey/50"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-1 space-y-2">
            <Label htmlFor="sender-city" className="text-xs uppercase tracking-widest font-mono text-brand-light-grey/80">
              City
            </Label>
            <Input
              id="sender-city"
              placeholder="City"
              value={sender.city}
              onChange={(e) => handleSenderChange('city', e.target.value)}
              className="h-11 text-sm bg-brand-bg border-white/20 focus:border-brand-neon-green text-white placeholder:text-brand-light-grey/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sender-state" className="text-xs uppercase tracking-widest font-mono text-brand-light-grey/80">
              State
            </Label>
            <Input
              id="sender-state"
              placeholder="CA"
              maxLength={2}
              value={sender.state}
              onChange={(e) => handleSenderChange('state', e.target.value.toUpperCase())}
              className="h-11 text-sm bg-brand-bg border-white/20 focus:border-brand-neon-green text-white placeholder:text-brand-light-grey/50 uppercase"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sender-zip" className="text-xs uppercase tracking-widest font-mono text-brand-light-grey/80">
              ZIP Code
            </Label>
            <Input
              id="sender-zip"
              placeholder="12345"
              maxLength={10}
              value={sender.zipCode}
              onChange={(e) => handleSenderChange('zipCode', e.target.value)}
              className="h-11 text-sm bg-brand-bg border-white/20 focus:border-brand-neon-green text-white placeholder:text-brand-light-grey/50"
            />
          </div>
        </div>
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
