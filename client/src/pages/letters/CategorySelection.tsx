import { Link } from "react-router";
import {
  ShieldCheckIcon,
  MedalMilitaryIcon,
  HeartIcon,
  EnvelopeSimpleIcon,
  ArrowUpRightIcon,
  StarIcon,
  SparkleIcon,
} from "@phosphor-icons/react";
import { Card } from "@/components/ui/card";

interface LetterCategory {
  slug: string;
  icon: React.ReactNode;
  accent: string;
  iconBg: string;
  arrowColor: string;
  title: string;
  description: string;
}

const letterCategories: LetterCategory[] = [
  {
    slug: "/letter/prison",
    icon: <ShieldCheckIcon size={34} weight="bold" />,
    accent: "bg-brand-neon-green",
    iconBg: "bg-brand-neon-green/10 text-brand-neon-green",
    arrowColor: "text-brand-neon-green",
    title: "Letter to Prison",
    description:
      "Stay connected with someone incarcerated. We print and deliver your message directly to their facility.",
  },
  {
    slug: "/letter/soldier",
    icon: <MedalMilitaryIcon size={34} weight="bold" />,
    accent: "bg-brand-neon-blue",
    iconBg: "bg-brand-neon-blue/10 text-brand-neon-blue",
    arrowColor: "text-brand-neon-blue",
    title: "Letter to a Soldier",
    description:
      "Send support, encouragement, and updates to military personnel wherever they serve.",
  },
  {
    slug: "/letter/beloved",
    icon: <HeartIcon size={34} weight="bold" />,
    accent: "bg-brand-baby-blue",
    iconBg: "bg-brand-baby-blue/10 text-brand-baby-blue",
    arrowColor: "text-brand-baby-blue",
    title: "Letter to My Beloved",
    description:
      "Create a personal message for someone special and make your words unforgettable.",
  },
  {
    slug: "/letter/regular",
    icon: <EnvelopeSimpleIcon size={34} weight="bold" />,
    accent: "bg-brand-neon-green",
    iconBg: "bg-brand-neon-green/10 text-brand-neon-green",
    arrowColor: "text-brand-neon-green",
    title: "Regular Letter",
    description:
      "Write any letter to anyone. We'll print, package, and deliver it for you.",
  },
];

const Letters = () => {
  return (
    <div className="min-h-screen bg-brand-bg text-white px-6 py-20">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="flex justify-center items-center gap-2 text-brand-neon-green mb-5 font-mono text-sm uppercase tracking-widest">
            <SparkleIcon size={18} />
            <span>Choose a letter type</span>
            <StarIcon size={18} />
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            What kind of letter
            <br />
            <span className="text-brand-neon-green">do you want to send?</span>
          </h1>

          <p className="mt-6 mx-auto max-w-2xl text-brand-light-grey/80 text-lg leading-relaxed">
            Select a category and start writing. We'll handle printing and delivery.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {letterCategories.map((category) => (
            <Link
              key={category.slug}
              to={category.slug}
              className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-neon-green rounded-xl"
            >
              <Card className="relative overflow-hidden h-full border-white/10 bg-brand-dark-grey/40 p-6 rounded-xl transition-all duration-300 hover:-translate-y-2 hover:border-white/20 hover:bg-brand-dark-grey/70 text-white shadow-none">
                {/* Accent Top Line */}
                <div className={`absolute top-0 left-0 w-full h-1 ${category.accent}`} />

                <div className="flex flex-col h-full">
                  {/* Icon Container */}
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${category.iconBg}`}>
                    {category.icon}
                  </div>

                  {/* Title */}
                  <h2 className="text-xl font-bold mb-3">{category.title}</h2>

                  {/* Description */}
                  <p className="text-sm text-brand-light-grey/75 leading-relaxed flex-1">
                    {category.description}
                  </p>

                  {/* Dynamic Hover Arrow */}
                  <div className="mt-8 flex justify-end">
                    <ArrowUpRightIcon
                      size={22}
                      className={`text-brand-light-grey/40 transition-all duration-300 group-hover:opacity-100 ${category.arrowColor} group-hover:-translate-y-1 group-hover:translate-x-1`}
                    />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Letters;