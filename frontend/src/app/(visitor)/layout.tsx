import React from "react";
import FooterMain from "@/app/shared/components/FooterMain";

export default function VisitorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <FooterMain />
    </>
  );
}
