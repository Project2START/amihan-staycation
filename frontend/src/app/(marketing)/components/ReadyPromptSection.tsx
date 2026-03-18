import Link from "next/link";

export default function ReadyPromptSection() {
  return (
    <section>
      <div className="py-10 sm:py-12 md:py-14 lg:py-16 xl:py-20 2xl:py-24 min-[1921px]:py-28">
        <h2 className="text-center text-xl sm:text-2xl md:text-3xl lg:text-[2.4rem] xl:text-[2.8rem] 2xl:text-[3.2rem] min-[1921px]:text-[3.7rem]">
          Ready to Relax?
        </h2>
        <p className="py-4 text-center text-xs sm:text-sm md:py-5 md:text-base lg:py-6 lg:text-lg xl:text-xl 2xl:text-2xl min-[1921px]:text-[1.6rem]">
          Book your next getaway and experience the warmth of Amihan Staycation
          today.
        </p>
        <div className="flex justify-center">
          <Link
            href={"/units"}
            className="primary-button-link px-10 py-4 text-sm sm:px-14 sm:py-4 md:px-16 lg:px-24 lg:py-5 lg:text-base xl:px-[7.5rem] xl:text-lg 2xl:px-36 min-[1921px]:px-44"
          >
            Browse Units
          </Link>
        </div>
      </div>
    </section>
  );
}
