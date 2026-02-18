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
}

export default function ProductItem({
  name,
  price,
  id,
  photos,
  attributes,
  linkPath,
}: IProductItemProps & { linkPath: string }) {
  let iconExcess_count = 0;
  return (
    <div className="overflow-hidden min-w-0 border-2 border-[#0B5173]/30 text-secondary-normal rounded-lg">
      <div className="relative">
        <div className="px-[1rem] py-[0.5rem] w-full h-[2.5rem] absolute top-0 left-0 bg-linear-to-r from-[#000000]/50 to-[#808080]/20 z-1 flex items-center">
          <div className="flex items-center text-xs h-full flex-1/2 min-w-0 overflow-x-hidden">
            <Rating value={4.5} textColor="text-[#efefef]" />
          </div>
          <div className="flex-1/2 min-w-0 overflow-x-hidden flex justify-end text-white">
            <ul className="flex items-center gap-x-2">
              {attributes.map((attribute, index) => {
                if (index <= 3) {
                  return (
                    <li key={attribute.iconId} className=" shadow-lg">
                      <RenderIcon iconId={attribute.iconId} />
                      <span className="text-xs text-success-normal translate-x-[50%] translate-y-[-40%] block rounded-full bg-white w-max">
                        <FaCircleCheck />
                      </span>
                    </li>
                  );
                } else {
                  iconExcess_count += 1;
                }
              })}
              {iconExcess_count !== 0 ? (
                <li className="text-xs">+{iconExcess_count}</li>
              ) : null}
            </ul>
          </div>
        </div>
        {photos[0] ? (
          <UnitImage
            src={photos[0].image_url}
            alt={photos[0].alt}
            style="w-full h-[12rem]"
          />
        ) : (
          <ImageBroken
            style="w-[9rem] h-[6rem] bg-gray-200"
            iconStyle="text-2xl opacity-50"
          />
        )}
      </div>
      <div className="p-[1rem]">
        <div className="flex justify-between items-center font-bold ">
          <span className="text-xl flex-1/2 truncate">{name}</span>
          <span className="text-lg flex-1/2 truncate text-right">
            {formatMoney(price, { decimals: 2, symbol: "₱" })}
          </span>
        </div>
        <div>
          <Link
            href={`${linkPath}/${id}`}
            className="primary-button-link px-[0.75rem] py-[0.75rem] mt-[1.5rem]"
          >
            <span className="text-xs text-nowrap">View Details</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
