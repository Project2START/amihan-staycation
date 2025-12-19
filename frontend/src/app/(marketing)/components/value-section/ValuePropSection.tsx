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
    <div className="md:mt-[1rem]">
      <div>
        <h2 className="text-center pb-[1rem] lg:pb-[1.5rem]">
          Why Choose{" "}
          <span className="text-primary-normal">Amihan Staycation</span>
        </h2>
      </div>
      <div className="grid gap-y-10 border-y-2 border-tertiary-normal/30 py-[2.5rem] lg:gap-y-12 lg:px-[1.5rem]">
        {values.map((value) => {
          return (
            <div key={value.id} className="flex items-center gap-3">
              <div>
                <span style={{ color: value.iconColor }} className="text-3xl">
                  {value.icon}
                </span>
              </div>
              <div>
                <h3>{value.title}</h3>
                <p className="text-xs mt-[0.25rem] md:text-sm">
                  {value.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
