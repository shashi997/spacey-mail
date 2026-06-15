import { Button } from "@/components/ui/button";
import {
  EnvelopeSimpleOpenIcon,
  UsersIcon,
  PaletteIcon,
  SmileyWinkIcon,
  PrinterIcon,
  TruckIcon,
  ArrowUpRightIcon,
} from "@phosphor-icons/react";

const Home = () => {
  const features = [
    {
      icon: <EnvelopeSimpleOpenIcon size={30} className="text-brand-neon-green" />,
      accent: "bg-brand-neon-green",
      title: "Easy Letter Writing",
      description:
        "Write and send letters online from the comfort of your home. No post office visits needed.",
      className: "md:col-span-2",
    },
    {
      icon: <UsersIcon size={30} className="text-brand-neon-blue" />,
      accent: "bg-brand-neon-blue",
      title: "Multiple Recipients",
      description:
        "Send letters to loved ones, military personnel overseas, and inmates from a single platform.",
      className: "md:col-span-1",
    },
    {
      icon: <PaletteIcon size={30} className="text-brand-baby-blue" />,
      accent: "bg-brand-baby-blue",
      title: "Personalized Every Time",
      description:
        "Customize paper, envelopes, colors, scents, and include photos or supporting documents.",
      className: "md:col-span-1",
    },
    {
      icon: <SmileyWinkIcon size={30} className="text-brand-neon-green" />,
      accent: "bg-brand-neon-green",
      title: "Emoji Support",
      description:
        "Digital emojis are printed in full color so your messages keep their personality on paper.",
      className: "md:col-span-1",
    },
    {
      icon: <PrinterIcon size={30} className="text-brand-neon-blue" />,
      accent: "bg-brand-neon-blue",
      title: "Premium Printing",
      description:
        "Every letter is professionally printed on high-quality paper with sharp, consistent results.",
      className: "md:col-span-1",
    },
    {
      icon: <TruckIcon size={30} className="text-brand-baby-blue" />,
      accent: "bg-brand-baby-blue",
      title: "Tracked Delivery",
      description:
        "Letters are processed quickly and shipped with tracking updates sent directly to your phone.",
      className: "md:col-span-3",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-brand-bg text-brand-light-grey selection:bg-brand-neon-green/30">
      {/* Subtle Layout Lines */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
      >
        <div className="mx-auto h-full max-w-6xl border-x border-white" />
      </div>

      {/* Hero */}
      <section className="relative z-10 px-6 py-24 md:py-36">
        <div className="mx-auto max-w-5xl text-center">
          {/* Eyebrow */}
          <div className="mb-8 flex items-center justify-center gap-3 text-sm font-medium text-brand-light-grey/75">
            <div className="h-px w-10 bg-brand-neon-green" />
            <span>Send real letters without visiting the post office</span>
          </div>

          {/* Glow */}
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-32 h-72 w-72 -translate-x-1/2 rounded-full bg-brand-neon-green/10 blur-3xl"
          />

          <h1 className="relative mx-auto max-w-4xl text-5xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl leading-[1.05]">
            Write online.
            <br />
            <span className="text-brand-neon-green">
              We print and deliver.
            </span>
          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-lg leading-relaxed text-brand-light-grey/85 md:text-xl">
            Create letters from any device and have them professionally printed,
            packaged, and delivered to loved ones, military personnel, or
            inmates—without leaving your home.
          </p>

          <div className="mx-auto mt-10 flex max-w-lg flex-col gap-4 sm:flex-row sm:justify-center">
            <Button
              size="lg"
              className="
                h-14
                px-8
                rounded-none
                bg-brand-neon-green
                text-brand-bg
                font-semibold
                hover:bg-brand-baby-blue
                transition-colors
                shadow-lg
                shadow-brand-neon-green/10
              "
            >
              Start Your Letter
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="
                h-14
                px-8
                rounded-none
                border-brand-light-grey/30
                text-white                 /* Explicitly forces the text to be white when normal */
                bg-transparent             /* Ensures background is clean before hover */
                hover:bg-white
                hover:text-brand-bg
                transition-colors
              "
            >
              How It Works
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="relative z-10 border-t border-brand-light-grey/10 bg-brand-dark-grey/20 px-6 py-24"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 border-b border-brand-light-grey/10 pb-8">
            <p className="mb-3 text-sm font-medium text-brand-neon-blue">
              Why people use our service
            </p>

            <h2 className="max-w-4xl text-3xl font-extrabold tracking-tight text-white md:text-5xl">
              Everything you need to send{" "}
              <span className="text-brand-neon-blue">
                meaningful physical mail
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.title}
                className={`
                  ${feature.className}
                  group
                  relative
                  overflow-hidden
                  border
                  border-brand-light-grey/10
                  bg-brand-dark-grey/40
                  p-8
                  transition-all
                  duration-300
                  will-change-transform
                  hover:-translate-y-1
                  hover:border-brand-light-grey/20
                  hover:bg-brand-dark-grey/60
                `}
              >
                <div
                  className={`absolute left-0 top-0 h-0.5 w-full ${feature.accent}`}
                />

                <div className="flex h-full flex-col justify-between">
                  <div>
                    <div className="mb-6">
                      {feature.icon}
                    </div>

                    <h3 className="mb-3 text-xl font-bold tracking-tight text-white">
                      {feature.title}
                    </h3>

                    <p className="max-w-xl text-sm leading-relaxed text-brand-light-grey/80">
                      {feature.description}
                    </p>
                  </div>

                  <div className="mt-10 flex justify-end border-t border-brand-light-grey/5 pt-6">
                    <ArrowUpRightIcon
                      size={16}
                      className="
                        text-brand-neon-green
                        opacity-20
                        transition-all
                        duration-300
                        group-hover:-translate-y-1
                        group-hover:translate-x-1
                        group-hover:opacity-100
                      "
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;