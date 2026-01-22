import Link from "next/link";

export default function ReadyPromptSection() {
  return (
    <div>
      <div className="py-[2.5rem] lg:py-[3.5rem]">
        <h2 className="text-center text-xl lg:text-3xl">Ready to Relax?</h2>
        <p className="py-[1rem] text-xs text-center md:text-sm lg:text-base lg:py-[1.5rem]">
          Book your next getaway and experience the warmth of Amihan Staycation
          today.
        </p>
        <div className="flex justify-center">
          <Link
            href={"/dashboard"}
            className="primary-button-link py-[1rem] lg:px-[7.5rem] lg:py-[1.25rem] lg:text-base"
          >
            Browse Units
          </Link>
        </div>
      </div>
    </div>
  );
}
