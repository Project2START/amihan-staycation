export default function ProductFooter() {
  return (
    <footer className="mt-[3rem] w-full border-t border-secondary-normal/10 bg-secondary-normal px-4 py-5 text-white md:px-8 md:py-6 lg:px-12">
      <div className="mx-auto flex w-full max-w-[90rem] flex-col gap-3 text-xs md:flex-row md:items-center md:justify-between md:text-sm">
        <p className="font-semibold tracking-wide">Amihan Admin Workspace</p>
        <p className="text-white/80">
          Keep listing details updated for accurate guest-facing availability.
        </p>
      </div>
    </footer>
  );
}
