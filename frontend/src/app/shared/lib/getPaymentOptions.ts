export interface PaymentOption {
  id: string;
  paymentName: string;
  paymentImage: string;
}

const paymentOptions: PaymentOption[] = [
  {
    id: "banko-1",
    paymentName: "Banko",
    paymentImage: "/images/payment-logos/banko.png",
  },
  {
    id: "bdounibank-2",
    paymentName: "BDO Unibank",
    paymentImage: "/images/payment-logos/bdounibank.png",
  },
  {
    id: "bpi-3",
    paymentName: "BPI",
    paymentImage: "/images/payment-logos/bpi.png",
  },
  {
    id: "coins-4",
    paymentName: "Coins.ph",
    paymentImage: "/images/payment-logos/coins.png",
  },
  {
    id: "dragonpay-5",
    paymentName: "DragonPay",
    paymentImage: "/images/payment-logos/dragonpay.png",
  },
  {
    id: "fortunepay-6",
    paymentName: "FortunePay",
    paymentImage: "/images/payment-logos/fortunepay.png",
  },
  {
    id: "gcash-7",
    paymentName: "GCash",
    paymentImage: "/images/payment-logos/gcash.png",
  },
  {
    id: "grabpay-8",
    paymentName: "GrabPay",
    paymentImage: "/images/payment-logos/grabpay.png",
  },
  {
    id: "hitpay-9",
    paymentName: "HitPay",
    paymentImage: "/images/payment-logos/hitpay.png",
  },
  {
    id: "instapay-10",
    paymentName: "InstaPay",
    paymentImage: "/images/payment-logos/instapay.png",
  },
  {
    id: "landbank-11",
    paymentName: "LandBank",
    paymentImage: "/images/payment-logos/landbank.png",
  },
  {
    id: "maya-12",
    paymentName: "Maya",
    paymentImage: "/images/payment-logos/maya.png",
  },
  {
    id: "metrobank-13",
    paymentName: "Metrobank",
    paymentImage: "/images/payment-logos/metrobank.png",
  },
  {
    id: "palawanpay-14",
    paymentName: "PalawanPay",
    paymentImage: "/images/payment-logos/palawanpay.png",
  },
  {
    id: "paymongo-15",
    paymentName: "PayMongo",
    paymentImage: "/images/payment-logos/paymongo.png",
  },
  {
    id: "pearlpay-16",
    paymentName: "PearlPay",
    paymentImage: "/images/payment-logos/pearlpay.png",
  },
  {
    id: "pesonet-17",
    paymentName: "PESONet",
    paymentImage: "/images/payment-logos/pesonet.png",
  },
  {
    id: "pnb-18",
    paymentName: "PNB",
    paymentImage: "/images/payment-logos/pnb.png",
  },
  {
    id: "qrph-19",
    paymentName: "QR Ph",
    paymentImage: "/images/payment-logos/qrphl.png",
  },
  {
    id: "secubank-20",
    paymentName: "Security Bank",
    paymentImage: "/images/payment-logos/secubank.png",
  },
  {
    id: "shopeepay-21",
    paymentName: "ShopeePay",
    paymentImage: "/images/payment-logos/shopeepay.png",
  },
  {
    id: "starpay-22",
    paymentName: "StarPay",
    paymentImage: "/images/payment-logos/starpay.png",
  },
  {
    id: "unionbank-23",
    paymentName: "UnionBank",
    paymentImage: "/images/payment-logos/unionbank.png",
  },
  {
    id: "xendit-24",
    paymentName: "Xendit",
    paymentImage: "/images/payment-logos/xendit.png",
  },
];

export default function getPaymentOptions(): PaymentOption[] {
  return paymentOptions;
}
