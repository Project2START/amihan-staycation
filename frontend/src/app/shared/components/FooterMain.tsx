import FacebookIcon from "./icons/FacebookIcon";
import TiktokIcon from "./icons/TiktokIcon";
import ImageMainLogo from "./ImageMainLogo";
import { MdEmail } from "react-icons/md";
import { BsFillTelephoneFill } from "react-icons/bs";
import Link from "next/link";

export default function FooterMain() {
  return (
    <footer>
      <div className="bg-secondary-normal px-[1.5rem] py-[2rem] text-white md:px-[5rem] lg:flex lg:justify-center">
        <div className="lg:flex lg:justify-center lg:flex-col lg:w-max">
          <div className="flex items-center gap-x-5">
            <div className="bg-white w-max rounded-full">
              <ImageMainLogo
                width={38}
                height={38}
                alt="Amihan Staycation Footer Logo"
              />
            </div>
            <p className="text-[0.6rem] md:text-xs">
              Azure Urban Residences, KM 16, W Service Rd, Parañaque, 1700,
              Taguig, 1630 Metro Manila, Taguig, Philippines
            </p>
          </div>
          <div className="mt-[2rem] flex">
            <div className="border-r-2 border-white/50 pr-[1rem] md:pr-[1.5rem]">
              <h5 className="text-xs font-bold">FOLLOW US</h5>
              <div className="flex gap-x-2 mt-[0.5rem] md:gap-x-3">
                <div>
                  <FacebookIcon />
                </div>
                <div>
                  <TiktokIcon />
                </div>
              </div>
            </div>
            <div className="pl-[1rem] md:pl-[1.5rem]">
              <h5 className="text-xs font-bold">REACH US OUT</h5>
              <div className="flex flex-col gap-y-2 mt-[0.5rem] md:flex-row md:gap-x-5">
                <div className="flex items-center gap-x-2">
                  <span className="text-white">
                    <MdEmail />
                  </span>
                  <a
                    href="mailto:amihanstudio.n.businesses@gmail.com"
                    className="text-[0.65rem] md:text-xs"
                  >
                    amihanstudio.n.businesses@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-x-2">
                  <span className="text-white">
                    <BsFillTelephoneFill />
                  </span>
                  <a
                    href="tel:09174316457"
                    className="text-[0.65rem] md:text-xs"
                  >
                    0917 431 6457
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-[2rem] text-[0.6rem] text-center md:text-xs md:flex md:items-center md:gap-x-5">
            <p>All rights reserved. Copyright (2025-2026) - AStaycation.com™</p>
            <div className="flex justify-center">
              <div className="flex mt-[0.5rem] md:mt-0">
                <div className="border-r-2 border-white/50 pr-[0.5rem]">
                  <Link href={""} className="text-primary-normal">
                    Terms & conditions
                  </Link>
                </div>
                <div className="pl-[0.5rem]">
                  <Link href={""} className="text-primary-normal">
                    Privacy statement
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
