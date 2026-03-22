"use client";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

export default function LegalPageLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  const router = useRouter();
  return (
    <main className="min-h-screen bg-[#f7f8fb] text-secondary-normal px-4 py-8 md:px-8 md:py-10 lg:px-10 lg:py-12">
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-5 text-xs md:text-sm md:mb-7">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex font-semibold text-primary-normal underline underline-offset-2 hover:text-primary-dark focus:outline-none"
          >
            Back to Page
          </button>
        </div>

        <section className="rounded-2xl border border-secondary-normal/12 bg-white shadow-sm p-5 md:p-8 lg:p-10">
          <header className="border-b border-secondary-normal/10 pb-4 md:pb-5 lg:pb-6">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">
              {title}
            </h1>
            <p className="mt-2 text-sm md:text-base text-gray-600 max-w-3xl">
              {subtitle}
            </p>
          </header>

          <div className="mt-6 md:mt-7 lg:mt-8 space-y-6 md:space-y-7 lg:space-y-8">
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}
