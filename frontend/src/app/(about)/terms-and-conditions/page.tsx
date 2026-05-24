import LegalPageLayout from "../components/LegalPageLayout";

export default function TermsAndConditionsPage() {
  return (
    <LegalPageLayout
      title="Terms and Conditions"
      subtitle="Please read these Terms and Conditions carefully before using Amihan Staycation. By creating an account, making a booking, or using our platform, you agree to these terms."
    >
      <section>
        <h2 className="text-lg md:text-xl font-semibold">
          Acceptance of Terms
        </h2>
        <p className="mt-2 text-sm md:text-base text-gray-700">
          By accessing or using Amihan Staycation, you confirm that you have
          read, understood, and agreed to be bound by these Terms and
          Conditions. If you do not agree, please discontinue use of the
          platform.
        </p>
      </section>

      <section>
        <h2 className="text-lg md:text-xl font-semibold">User Accounts</h2>
        <p className="mt-2 text-sm md:text-base text-gray-700">
          You are responsible for providing accurate account details and for
          maintaining the confidentiality of your login credentials. You are
          also responsible for activities made under your account.
        </p>
      </section>

      <section>
        <h2 className="text-lg md:text-xl font-semibold">
          Booking and Reservations
        </h2>
        <p className="mt-2 text-sm md:text-base text-gray-700">
          Booking requests are subject to property availability and confirmation
          by the property owner. Reservation details such as dates, occupancy,
          and rates must be reviewed carefully before confirming your booking.
        </p>
      </section>

      <section>
        <h2 className="text-lg md:text-xl font-semibold">
          Payments and Refunds
        </h2>
        <p className="mt-2 text-sm md:text-base text-gray-700">
          Payments must be completed according to the instructions shown in the
          platform. Refunds, when applicable, are subject to the cancellation
          policy of the booked property and any agreed reservation terms.
        </p>
      </section>

      <section>
        <h2 className="text-lg md:text-xl font-semibold">
          User Responsibilities
        </h2>
        <ul className="mt-3 space-y-2 text-sm md:text-base text-gray-700 list-disc pl-5">
          <li>Provide truthful and complete booking information.</li>
          <li>
            Comply with property rules and check-in/check-out requirements.
          </li>
          <li>Respect property owners, staff, and other guests.</li>
          <li>Use the platform in a lawful and responsible manner.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg md:text-xl font-semibold">
          Prohibited Activities
        </h2>
        <ul className="mt-3 space-y-2 text-sm md:text-base text-gray-700 list-disc pl-5">
          <li>Using false identities or fraudulent payment information.</li>
          <li>Attempting unauthorized access to accounts or system data.</li>
          <li>Posting harmful, abusive, or misleading content.</li>
          <li>Using the platform for illegal or unauthorized transactions.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg md:text-xl font-semibold">
          Cancellations and Modifications
        </h2>
        <p className="mt-2 text-sm md:text-base text-gray-700">
          Cancellation and modification requests are governed by the property's
          booking terms. Fees or restrictions may apply depending on timing and
          policy conditions.
        </p>
      </section>

      <section>
        <h2 className="text-lg md:text-xl font-semibold">
          Limitation of Liability
        </h2>
        <p className="mt-2 text-sm md:text-base text-gray-700">
          Amihan Staycation provides a platform for users and property owners to
          connect. We are not liable for indirect losses, disruptions, or
          disputes arising from property services, except where required by
          applicable law.
        </p>
      </section>

      <section>
        <h2 className="text-lg md:text-xl font-semibold">Termination of Use</h2>
        <p className="mt-2 text-sm md:text-base text-gray-700">
          We reserve the right to suspend or terminate access to the platform
          for users who violate these terms, engage in fraudulent behavior, or
          misuse the service.
        </p>
      </section>

      <section>
        <h2 className="text-lg md:text-xl font-semibold">Governing Law</h2>
        <p className="mt-2 text-sm md:text-base text-gray-700">
          These Terms and Conditions are governed by the laws applicable in the
          Philippines. Any legal concerns shall be handled under the appropriate
          jurisdiction and legal procedures.
        </p>
      </section>
    </LegalPageLayout>
  );
}
