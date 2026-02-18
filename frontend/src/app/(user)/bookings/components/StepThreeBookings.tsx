"use client";

import PaymentMethods from "./PaymentMethods";
import UploadPaymentScreenshot from "./UploadPaymentScreenshot";

export default function StepThreeBookings() {
  return (
    <div className="h-[60vh] px-[0.25rem] py-[1.5rem] overflow-y-auto shadow-[inset_0_12px_12px_-12px_rgba(0,0,0,0.2),inset_0_-12px_12px_-12px_rgba(0,0,0,0.2)]">
      <div>
        <h2 className="text-center font-normal mb-[1rem]">Security Deposit</h2>
      </div>
      <div>
        <p className="leading-7">
          A <strong>₱1,000 refundable deposit</strong> is required.{" "}
          <strong>Upload your payment screenshot with reference</strong> to
          confirm your booking. Refunds are issued after checkout if no damages
          occur.
        </p>
      </div>

      <div>
        <PaymentMethods />
      </div>
      <div>
        <UploadPaymentScreenshot />
      </div>
    </div>
  );
}
