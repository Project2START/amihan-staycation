type FormatMoneyOptions = {
  symbol?: string;
  decimals?: number;
  symbolPosition?: "before" | "after";
};

export function formatMoney(
  amount: number,
  options: FormatMoneyOptions = {},
): string {
  const { symbol = "", decimals = 2, symbolPosition = "before" } = options;

  const formattedNumber = amount.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  if (!symbol) return formattedNumber;

  return symbolPosition === "before"
    ? `${symbol}${formattedNumber}`
    : `${formattedNumber}${symbol}`;
}
