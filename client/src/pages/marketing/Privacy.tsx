const Privacy = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-brand-bg text-brand-light-grey px-6 py-24 md:py-36">
      {/* Subtle Background Elements */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-brand-neon-blue/5 blur-3xl"
      />

      <div className="relative z-10 mx-auto max-w-3xl">
        <div className="mb-12 border-b border-brand-light-grey/10 pb-8">
          <p className="mb-3 text-sm font-medium text-brand-neon-blue uppercase tracking-widest">
            Spacey Science
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white font-heading">
            Privacy Policy
          </h1>
          <p className="mt-4 text-brand-light-grey/60 text-sm">
            Last Updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="space-y-10 text-base leading-relaxed text-brand-light-grey/80">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white font-heading">
              1. Information We Collect
            </h2>
            <p>
              To provide our digital-to-physical mailing services, we collect necessary personal information including your name, email address, payment details, and the physical mailing addresses of your recipients (including military APO/FPO and correctional facility addresses).
            </p>
            <p>
              We also securely process the content of the digital letters, photos, and documents you upload for the sole purpose of printing and mailing them.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white font-heading">
              2. How We Use Your Information
            </h2>
            <ul className="list-disc pl-5 space-y-2 marker:text-brand-neon-green">
              <li>To convert your digital drafts into physical mail.</li>
              <li>To process payments and prevent fraudulent transactions.</li>
              <li>To provide tracking updates via email or SMS.</li>
              <li>To ensure compliance with specific delivery constraints (e.g., correctional facility mail room rules).</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white font-heading">
              3. Data Security & Content Privacy
            </h2>
            <p>
              We treat your personal correspondence with the highest level of confidentiality. Your letters and uploaded attachments are encrypted during transmission. Once a letter is successfully printed, packaged, and handed over to the carrier, the digital file is scheduled for secure deletion from our active print queues to protect your privacy.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white font-heading">
              4. Third-Party Sharing
            </h2>
            <p>
              We do not sell your personal data. We only share necessary information with trusted third parties required to fulfill your order, such as secure payment processors and postal carriers (e.g., USPS, FedEx).
            </p>
          </section>

          <section className="space-y-4 mt-12 border-t border-brand-light-grey/10 pt-8">
            <p className="text-sm text-brand-light-grey/60">
              * This is a draft privacy policy for Spacey Science. A fully detailed legal document should be reviewed by legal counsel prior to commercial launch.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;