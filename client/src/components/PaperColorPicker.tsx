import { Label } from "@/components/ui/label";

const PAPER_COLORS = [
  { value: 'white', label: 'White', bg: '#ffffff', text: '#1a1a1a' },
  { value: 'cream', label: 'Cream', bg: '#FFF8E7', text: '#1a1a1a' },
  { value: 'blue', label: 'Blue', bg: '#E8F4FD', text: '#1a1a1a' },
  { value: 'pink', label: 'Pink', bg: '#FDE8EF', text: '#1a1a1a' },
  { value: 'green', label: 'Green', bg: '#E8F8E8', text: '#1a1a1a' },
  { value: 'yellow', label: 'Yellow', bg: '#FFF9E0', text: '#1a1a1a' },
  { value: 'lavender', label: 'Lavender', bg: '#F0E8FF', text: '#1a1a1a' },
] as const;

interface PaperColorPickerProps {
  value: string;
  onChange: (value: string) => void;
}

const PaperColorPicker: React.FC<PaperColorPickerProps> = ({ value, onChange }) => {
  // const selected = PAPER_COLORS.find((c) => c.value === value) ?? PAPER_COLORS[0];

  return (
    <div className="space-y-2">
      <Label className="text-xs uppercase tracking-widest font-mono text-brand-light-grey/80">
        Paper Color
      </Label>
      <div className="flex gap-2 flex-wrap">
        {PAPER_COLORS.map((color) => (
          <button
            key={color.value}
            type="button"
            onClick={() => onChange(color.value)}
            title={color.label}
            className={`h-8 w-8 rounded-none border-2 transition-all ${
              value === color.value
                ? 'border-brand-neon-green scale-110'
                : 'border-white/20 hover:border-white/50'
            }`}
            style={{ backgroundColor: color.bg }}
          />
        ))}
      </div>
    </div>
  );
};

export { PAPER_COLORS };
export default PaperColorPicker;
