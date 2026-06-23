import { useParams, Navigate } from "react-router";
import { SparkleIcon, StarIcon } from "@phosphor-icons/react";

import Step1Editor from "./Step1Editor";
import Step2Extras from "./Step2Extras";
import Step3Addressing from "./Step3Addressing";
import Step4Preview from "./Step4Preview";
import Step5Checkout from "./Step5Checkout";
import { useLetterStore, isValidCategory, type Category } from "@/stores/useLetterStore";

const STEP_LABELS = ["Write", "Extras", "Address", "Preview", "Checkout"];

const STEP_COMPONENTS = [
  Step1Editor,
  Step2Extras,
  Step3Addressing,
  Step4Preview,
  Step5Checkout,
] as const;

const LetterWizard = () => {
  const { category } = useParams<{ category: string }>();
  const storeCategory = useLetterStore((s) => s.category);
  const currentStep = useLetterStore((s) => s.currentStep);
  const setCategory = useLetterStore((s) => s.setCategory);

  if (!category || !isValidCategory(category)) {
    return <Navigate to="/letter" replace />;
  }

  if (storeCategory !== category) {
    setCategory(category as Category);
  }

  const StepComponent = STEP_COMPONENTS[currentStep];

  return (
    <div className="min-h-screen bg-brand-bg text-white px-6 py-12">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="flex justify-center items-center gap-2 text-brand-neon-green mb-4 font-mono text-xs uppercase tracking-widest">
            <SparkleIcon size={16} />
            <span>Write your letter</span>
            <StarIcon size={16} />
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight capitalize">
            {category === 'prison' && 'Letter to Prison'}
            {category === 'soldier' && 'Letter to a Soldier'}
            {category === 'beloved' && 'Letter to My Beloved'}
            {category === 'regular' && 'Regular Letter'}
          </h1>
        </div>

        {/* Progress Steps */}
        <div className="mb-10 flex items-center justify-center gap-0">
          {STEP_LABELS.map((label, i) => {
            const isActive = i === currentStep;
            const isComplete = i < currentStep;
            return (
              <div key={label} className="flex items-center">
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold font-mono transition-colors ${
                      isActive
                        ? "bg-brand-neon-green text-brand-bg"
                        : isComplete
                        ? "bg-brand-neon-green/30 text-brand-neon-green"
                        : "bg-white/10 text-brand-light-grey/50"
                    }`}
                  >
                    {i + 1}
                  </div>
                  <span
                    className={`text-[10px] font-mono uppercase tracking-wider ${
                      isActive
                        ? "text-brand-neon-green"
                        : isComplete
                        ? "text-brand-neon-green/60"
                        : "text-brand-light-grey/40"
                    }`}
                  >
                    {label}
                  </span>
                </div>
                {i < STEP_LABELS.length - 1 && (
                  <div
                    className={`mx-2 -mt-5 h-px w-10 sm:w-16 ${
                      i < currentStep
                        ? "bg-brand-neon-green/50"
                        : "bg-white/10"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Current Step */}
        <StepComponent />
      </div>
    </div>
  );
};

export default LetterWizard;
