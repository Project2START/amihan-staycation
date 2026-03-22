import getPaymentOptions from "@/app/shared/lib/getPaymentOptions";

export function getPaymentLogo(paymentMethod: string): string {
  const options = getPaymentOptions();
  const match = options.find(
    (opt) => opt.paymentName.toLowerCase() === paymentMethod.toLowerCase(),
  );
  return match?.paymentImage ?? "/images/payment-logos/default.png";
}
