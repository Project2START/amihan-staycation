"use client";

import Link from "next/link";
import UnitImage from "./UnitImage";
import ImageBroken from "./ImageBroken";
import { formatMoney } from "../lib/formatMoney";
import Rating from "./Rating";
import RenderIcon from "../ui/RenderIcon";
import { FaCircleCheck } from "react-icons/fa6";

export interface IProductAttribute {
  name: string;
  iconId: string;
  quantity: number;
}

export interface IProductPhoto {
  image_url: string;
  alt: string;
  id: string;
}

export interface IProductItemProps {
  id: string;
  name: string;
  price: number;
  about: string;
  photos: IProductPhoto[];
  attributes: IProductAttribute[];
  maxPersons: number;
}

export default function ProductItem({
  name,
  price,
  id,
  photos,
  attributes,
  about,
  linkPath,
  maxPersons,
}: IProductItemProps & { linkPath: string }) {
  const visibleAttributes = attributes.slice(0, 4);
  const iconExcessCount = Math.max(
    0,
    attributes.length - visibleAttributes.length,
  );

  return (
    <article className="min-w-0 overflow-hidden rounded-lg border-2 border-[#0B5173]/30 bg-white text-secondary-normal lg:grid lg:grid-cols-[20rem_1fr] xl:grid-cols-[22rem_1fr]">
      <div className="relative">
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between p-3 lg:p-4">
          <div className="rounded-full bg-black/45 px-2.5 py-1 backdrop-blur-sm">
            <Rating value={4.5} textColor="text-[#efefef]" />
          </div>

          <div className="rounded-full bg-black/35 px-2.5 py-1.5 text-white backdrop-blur-sm">
            <ul className="flex items-center gap-x-2">
              {visibleAttributes.map((attribute, index) => (
                <li key={`${attribute.iconId}-${index}`} className="shadow-lg">
                  <RenderIcon iconId={attribute.iconId} />
                  <span className="block w-max translate-x-[50%] translate-y-[-40%] rounded-full bg-white text-xs text-success-normal">
                    <FaCircleCheck />
                  </span>
                </li>
              ))}
              {iconExcessCount !== 0 ? (
                <li className="text-xs">+{iconExcessCount}</li>
              ) : null}
            </ul>
          </div>
        </div>

        {photos[0] ? (
          <UnitImage
            src={photos[0].image_url}
            alt={photos[0].alt}
            style="h-[12rem] w-full sm:h-[13.5rem] lg:h-full lg:min-h-[16rem]"
          />
        ) : (
          <ImageBroken
            style="h-[12rem] w-full bg-gray-200 sm:h-[13.5rem] lg:h-full lg:min-h-[16rem]"
            iconStyle="text-2xl opacity-50"
          />
        )}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent px-4 pb-3 pt-8 lg:px-5 lg:pb-4 lg:pt-12">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/80 sm:text-[11px]">
            Guest Capacity
          </p>
          <p className="text-sm font-bold text-white sm:text-base">
            Up to {maxPersons} guests
          </p>
        </div>
      </div>

      <div className="flex h-full flex-col p-4 sm:p-5 lg:p-6">
        <div className="flex items-start justify-between gap-3 font-bold">
          <h3 className="min-w-0 flex-1 truncate text-lg sm:text-xl lg:text-2xl">
            {name}
          </h3>
          <div className="shrink-0 text-right">
            <div className="text-lg sm:text-xl lg:text-2xl">
              {formatMoney(price, { decimals: 2, symbol: "₱" })}
            </div>
            <span className="text-xs font-normal sm:text-sm">
              1 night base rate
            </span>
          </div>
        </div>

        <p className="mt-3 text-sm leading-6 text-secondary-normal/80 sm:text-[0.95rem] lg:text-base">
          {about?.trim()
            ? `${about.trim().slice(0, 190)}${about.trim().length > 190 ? "..." : ""}`
            : "A relaxing stay with complete essentials and carefully prepared comforts for every guest."}
        </p>

        <div className="mt-5 lg:mt-auto">
          <Link
            href={`${linkPath}/${id}`}
            className="w-full primary-button-link inline-flex px-[0.9rem] py-[0.75rem] hover-animation lg:hover:bg-primary-normal/80 lg:mt-[1.5rem] lg:p-4"
          >
            <span className="text-xs text-nowrap">View Details</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
