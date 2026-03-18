import { BiSolidBuildingHouse } from "react-icons/bi";
import { FaLock } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { PiHairDryerFill } from "react-icons/pi";
import { FaHeart } from "react-icons/fa";

const values = [
  {
    icon: <BiSolidBuildingHouse />,
    iconColor: "#2BCCDE",
    id: "stylish-&-inviting",
    description:
      "Relax in thoughtfully designed spaces that are both cozy and elegant.",
    title: "Stylish & Inviting Units",
  },
  {
    icon: <FaLock />,
    iconColor: "#B45B24",
    id: "privacy-&-comfort",
    description: "Enjoy a peaceful and private retreat for all types of stays.",
    title: "Privacy & Comfort",
  },
  {
    icon: <FaStar />,
    iconColor: "#E2D118",
    id: "exceptional-service",
    description:
      "Every detail is taken care of so you can focus on enjoying your time.",
    title: "Exceptional Service",
  },
  {
    icon: <PiHairDryerFill />,
    iconColor: "#5424B4",
    id: "convenient-amenities",
    description:
      "Hassle-free amenities and optional pool access for added enjoyment.",
    title: "Convenient Amenities",
  },
  {
    icon: <FaHeart />,
    iconColor: "#D31518",
    id: "memorable-experiences",
    description: "Cherish moments with loved ones in a welcoming space.",
    title: "Memorable Experiences",
  },
];

export default function ValuePropSection() {
  return (
    <section className="mt-2 sm:mt-3 md:mt-5 lg:mt-8 xl:mt-10 2xl:mt-12 min-[1921px]:mt-14">
      <div>
        <h2 className="pb-4 text-center lg:pb-6 xl:pb-7 2xl:pb-8">
          Why Choose{" "}
          <span className="text-primary-normal">Amihan Staycation</span>
        </h2>
      </div>
      <div className="grid gap-y-8 border-y-2 border-tertiary-normal/30 py-8 sm:gap-y-10 sm:py-10 md:gap-x-6 md:gap-y-10 md:py-12 lg:grid-cols-2 lg:gap-x-10 lg:gap-y-12 lg:px-6 lg:py-16 xl:gap-x-12 xl:px-8 2xl:gap-x-16 2xl:px-10 2xl:py-20 min-[1921px]:gap-x-20 min-[1921px]:px-14 min-[1921px]:py-24">
        {values.map((value) => {
          return (
            <div
              key={value.id}
              className="flex items-start gap-3 sm:gap-4 lg:gap-5 xl:gap-6"
            >
              <div>
                <span
                  style={{ color: value.iconColor }}
                  className="text-3xl sm:text-[2rem] lg:text-[2.4rem] xl:text-[2.7rem] 2xl:text-[3rem]"
                >
                  {value.icon}
                </span>
              </div>
              <div className="lg:ml-2">
                <h3 className="text-[0.95rem] sm:text-base lg:text-xl xl:text-2xl 2xl:text-[1.7rem] min-[1921px]:text-[1.9rem]">
                  {value.title}
                </h3>
                <p className="mt-1 text-xs sm:text-sm md:text-[0.95rem] lg:text-base xl:text-lg 2xl:text-xl min-[1921px]:text-[1.35rem]">
                  {value.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
