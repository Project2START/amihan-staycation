import LegalPageLayout from "../components/LegalPageLayout";

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      subtitle="Welcome to Amihan Staycation. Your privacy is important to us. This page explains how we collect, use, and protect your personal information when you book accommodations through our system."
    >
      <section>
        <h2 className="text-lg md:text-xl font-semibold">
          Information We Collect
        </h2>
        <p className="mt-2 text-sm md:text-base text-gray-700">
          When you create an account or book a staycation, we may collect:
        </p>
        <ul className="mt-3 space-y-2 text-sm md:text-base text-gray-700 list-disc pl-5">
          <li>Full Name</li>
          <li>Email Address</li>
          <li>Contact Number</li>
          <li>Valid ID</li>
          <li>Booking Details</li>
          <li>Payment Information (Screenshots)</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg md:text-xl font-semibold">
          How We Use Your Information
        </h2>
        <p className="mt-2 text-sm md:text-base text-gray-700">
          Your information is used to:
        </p>
        <ul className="mt-3 space-y-2 text-sm md:text-base text-gray-700 list-disc pl-5">
          <li>Process booking reservations</li>
          <li>Confirm and manage staycation schedules</li>
          <li>Send booking notifications and reminders</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg md:text-xl font-semibold">
          Sharing Information
        </h2>
        <p className="mt-2 text-sm md:text-base text-gray-700">
          We do not sell your personal data. We only share information with:
        </p>
        <ul className="mt-3 space-y-2 text-sm md:text-base text-gray-700 list-disc pl-5">
          <li>Staycation property owners for reservation confirmation</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg md:text-xl font-semibold">Policy Updates</h2>
        <p className="mt-2 text-sm md:text-base text-gray-700">
          Amihan Staycation may update this policy. Changes will be shown on
          this page.
        </p>
      </section>
    </LegalPageLayout>
  );
}
