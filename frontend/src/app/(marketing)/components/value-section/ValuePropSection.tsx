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
    <div className="flex flex-cols justify-center text-secondary-normal md:mt-[1rem]">
      <div className="md:w-[70%] lg:w-[50%]">
        <div>
          <h2 className="font-bold text-center border-b-2 border-tertiary-normal/30 pb-[1rem] lg:text-xl">
            Why Choose{" "}
            <span className="text-primary-normal">Amihan Staycation</span>
          </h2>
        </div>
        <div className="grid gap-y-10 mt-[2.5rem] lg:gap-y-12 lg:px-[1.5rem]">
          {values.map((value) => {
            return (
              <div key={value.id} className="flex items-center gap-3">
                <div>
                  <span style={{ color: value.iconColor }} className="text-3xl">
                    {value.icon}
                  </span>
                </div>
                <div>
                  <h5 className="text-sm font-bold lg:text-base">
                    {value.title}
                  </h5>
                  <p className="text-xs mt-[0.25rem] lg:text-sm">
                    {value.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
