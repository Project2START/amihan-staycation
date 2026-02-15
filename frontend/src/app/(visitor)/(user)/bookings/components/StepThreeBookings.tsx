"use client";

import UploadPaymentScreenshot from "./UploadPaymentScreenshot";

export default function StepThreeBookings() {
  return (
    <div>
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
        <UploadPaymentScreenshot />
      </div>
    </div>
  );
}
