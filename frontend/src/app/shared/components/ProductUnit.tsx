"use client";

import Link from "next/link";
import UnitImage from "./UnitImage";
import { FaStar } from "react-icons/fa";

export interface IProductUnit {
  id: string;
  name: string;
  price: number;
  maxPersons: number;
  about: string;
  thumbnail: {
    image_url: string;
    alt: string;
    productId: string;
  };
}

export interface IProductUnitProps {
  id: string | number;
  imgSrc: string;
  imgAlt: string;
  about: string;
  price: number;
  maxPersons: number;
  name: string;
  rate?: number;
}

export default function ProductUnit({
  name,
  id,
  imgSrc,
  imgAlt,
  about,
  price,
  rate,
}: IProductUnitProps) {
  return (
    <div className="w-[100%] overflow-hidden">
      <div className="py-[1rem] px-[0.5rem] flex border-2 border-secondary-normal/20 rounded-lg">
        <div>
          <div>
            <UnitImage src={imgSrc} alt={imgAlt} style="w-[9rem] h-[6rem]" />
          </div>
        </div>
        <div className="mx-[0.5rem] min-w-0">
          <h3 className="truncate text-secondary-normal">{name}</h3>
          <p className="text-balance text-xs mt-[0.5rem] line-clamp-3 italic opacity-50">
            {about} Lorem ipsum dolor sit, amet consectetur adipisicing elit.
            Inventore ipsa corporis quibusdam beatae earum corrupti rem cum
            vitae voluptatum vero eius, explicabo dolores architecto? Maiores,
            quod aperiam, quaerat reiciendis odit placeat rerum ex eaque
            repudiandae rem doloribus illo? Illo officia ad animi ab natus
            cumque eos repellat harum perspiciatis inventore voluptates enim,
            suscipit provident sit dicta magni assumenda omnis nobis nam. Ea
            dolore nesciunt excepturi labore adipisci obcaecati saepe quia enim
            consequuntur quos, blanditiis voluptatibus accusantium a, aperiam
            numquam ad veritatis porro aut aliquam atque iusto quis? Dolore
            suscipit libero labore ex alias maxime quas. Beatae aperiam omnis
            veniam nobis.
          </p>
        </div>
        <div className="flex flex-col justify-between grow-1 place-items-end text-xs">
          <div className="flex items-center gap-x-1">
            <span className="text-secondary-normal">{rate}4.5</span>
            <span className="text-yellow-normal text-sm">
              <FaStar />
            </span>
          </div>
          <span className="font-bold text-sm text-secondary-normal text-nowrap">
            PHP {price}.00
          </span>
          <div>
            <Link
              href={"/sign-up"}
              className="primary-button-link px-[0.75rem] py-[0.5rem]"
            >
              <span className="text-xs text-nowrap">View Details</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
