import Link from "next/link";

export default function ReadyPromptSection() {
  return (
    <div>
      <div className="py-[2.5rem]">
        <h2 className="text-center text-xl lg:text-2xl">Ready to Relax?</h2>
        <p className="py-[1rem] text-xs text-center md:text-sm">
          Book your next getaway and experience the warmth of Amihan Staycation
          today.
        </p>
        <div className="flex justify-center">
          <Link
            href={"/dashboard"}
            className="primary-button-link py-[1rem] lg:px-[7.5rem] lg:py-[1.25rem]"
          >
            Browse Units
          </Link>
        </div>
      </div>
    </div>
  );
}
