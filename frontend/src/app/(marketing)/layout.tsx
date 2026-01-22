import FooterMain from "../shared/components/FooterMain";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main className="grow">{children}</main>
      <FooterMain />
    </>
  );
}
