import FacebookIcon from "./icons/FacebookIcon";
import TiktokIcon from "./icons/TiktokIcon";
import ImageMainLogo from "./ImageMainLogo";
import { MdEmail } from "react-icons/md";
import { BsFillTelephoneFill } from "react-icons/bs";
import Link from "next/link";

export default function FooterMain() {
  return (
    <footer>
      <div className="bg-secondary-normal text-white">
        <div className="mx-auto w-full max-w-7xl px-[1.5rem] py-[2rem] md:px-[3rem] md:py-[2.5rem] lg:px-[4rem] lg:py-[3rem]">
          <div className="grid grid-cols-1 gap-y-8 md:gap-y-9 lg:grid-cols-12 lg:gap-x-10 lg:items-start">
            <div className="lg:col-span-5">
              <div className="flex items-start gap-x-4 md:gap-x-5">
                <div className="bg-white w-max rounded-full shrink-0 p-0.5 md:p-1">
                  <ImageMainLogo alt="Amihan Staycation Footer Logo" />
                </div>
                <div>
                  <p className="text-[0.7rem] leading-relaxed md:text-sm lg:text-[0.95rem] text-white/90">
                    Azure Urban Residences, KM 16, W Service Rd, Parañaque,
                    Metro Manila, Philippines
                  </p>
                </div>
              </div>
            </div>

            <div className="md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-6 lg:col-span-7 lg:grid-cols-2">
              <div>
                <h5 className="text-xs font-bold tracking-wide md:text-sm lg:text-base">
                  FOLLOW US
                </h5>
                <div className="mt-[0.65rem] flex items-center gap-x-3 md:gap-x-4">
                  <div className="rounded-md p-1.5 transition-colors hover:bg-white/10 cursor-pointer">
                    <FacebookIcon />
                  </div>
                  <div className="rounded-md p-1.5 transition-colors hover:bg-white/10 cursor-pointer">
                    <TiktokIcon />
                  </div>
                </div>
              </div>

              <div className="mt-6 md:mt-0">
                <h5 className="text-xs font-bold tracking-wide md:text-sm lg:text-base">
                  REACH US OUT
                </h5>
                <div className="mt-[0.65rem] flex flex-col gap-y-2.5 lg:gap-y-3">
                  <div className="flex items-center gap-x-2.5 lg:gap-x-3 text-white/95">
                    <span className="text-white text-sm lg:text-base">
                      <MdEmail />
                    </span>
                    <a
                      href="mailto:amihanstudio.n.businesses@gmail.com"
                      className="text-[0.7rem] md:text-xs lg:text-sm transition-colors hover:text-primary-normal"
                    >
                      amihanstudio.n.businesses@gmail.com
                    </a>
                  </div>
                  <div className="flex items-center gap-x-2.5 lg:gap-x-3 text-white/95">
                    <span className="text-white text-sm lg:text-base">
                      <BsFillTelephoneFill />
                    </span>
                    <a
                      href="tel:09174316457"
                      className="text-[0.7rem] md:text-xs lg:text-sm transition-colors hover:text-primary-normal"
                    >
                      0917 431 6457
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 md:mt-9 pt-5 md:pt-6 border-t border-white/20 flex flex-col gap-y-3 md:flex-row md:items-center md:justify-between">
            <p className="text-[0.65rem] text-center md:text-left md:text-xs lg:text-sm text-white/90">
              All rights reserved. Copyright (2025-2026) - AmihanStaycation.com™
            </p>

            <div className="flex justify-center md:justify-end items-center">
              <div className="flex items-center">
                <div className="border-r border-white/40 pr-[0.6rem] md:pr-[0.8rem]">
                  <Link
                    href={"/terms-and-conditions"}
                    className="text-primary-normal text-[0.7rem] md:text-xs lg:text-sm font-semibold transition-colors hover:text-white"
                  >
                    Terms & conditions
                  </Link>
                </div>
                <div className="pl-[0.6rem] md:pl-[0.8rem]">
                  <Link
                    href={"/privacy-policy"}
                    className="text-primary-normal text-[0.7rem] md:text-xs lg:text-sm font-semibold transition-colors hover:text-white"
                  >
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
