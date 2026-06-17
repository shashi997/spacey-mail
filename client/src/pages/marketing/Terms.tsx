const Terms = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-brand-bg text-brand-light-grey px-6 py-24 md:py-36">
      {/* Subtle Background Elements */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-brand-neon-green/5 blur-3xl"
      />

      <div className="relative z-10 mx-auto max-w-3xl">
        <div className="mb-12 border-b border-brand-light-grey/10 pb-8">
          <p className="mb-3 text-sm font-medium text-brand-neon-green uppercase tracking-widest">
            Spacey Science
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white font-heading">
            Terms of Service
          </h1>
          <p className="mt-4 text-brand-light-grey/60 text-sm">
            Last Updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="space-y-10 text-base leading-relaxed text-brand-light-grey/80">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white font-heading">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using the Spacey Science platform to create and send physical mail, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white font-heading">
              2. Service Description
            </h2>
            <p>
              Spacey Science provides a digital-to-physical mailing service. We allow users to input text, upload images, and format letters digitally, which we then professionally print, package, and hand off to third-party postal carriers for delivery to specified addresses (including military bases and correctional facilities).
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white font-heading">
              3. User Conduct and Content Rules
            </h2>
            <p>
              You are solely responsible for the content of the mail you send. You agree NOT to use our service to send:
            </p>
            <ul className="list-disc pl-5 space-y-2 marker:text-brand-neon-blue">
              <li>Illegal, threatening, harassing, or defamatory materials.</li>
              <li>Contraband instructions or explicit material prohibited by the destination facility.</li>
              <li>Material that infringes on the intellectual property rights of others.</li>
            </ul>
            <p className="text-brand-light-grey/60 text-sm mt-2 border-l-2 border-brand-neon-blue pl-4 py-1">
              Note: Mail sent to correctional facilities or military bases is strictly regulated. We are not responsible if the receiving facility rejects, confiscates, or destroys your mail due to rule violations.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white font-heading">
              4. Delivery and Liability
            </h2>
            <p>
              While we guarantee high-quality printing and timely handoff to postal carriers, we do not control the postal network. We are not liable for delayed, lost, or damaged mail once it has been transferred to the carrier. Tracking information will be provided where applicable.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white font-heading">
              5. Refunds and Cancellations
            </h2>
            <p>
              Because our service involves physical printing, orders cannot be canceled or refunded once they have entered the "Processing" or "Printing" stage. If an error occurs on our end regarding print quality, please contact support for a reprint or refund.
            </p>
          </section>

          <section className="space-y-4 mt-12 border-t border-brand-light-grey/10 pt-8">
            <p className="text-sm text-brand-light-grey/60">
              * This is a draft Terms of Service for Spacey Science. A fully detailed legal document should be reviewed by legal counsel prior to commercial launch.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;