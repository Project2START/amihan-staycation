import Link from "next/link";
import UnitImage from "./UnitImage";
import ImageBroken from "./ImageBroken";
import { formatMoney } from "../lib/formatMoney";
import Rating from "./Rating";

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
  photos: IProductPhoto[];
}

export default function ProductItem({
  name,
  price,
  id,
  photos,
}: IProductItemProps) {
  return (
    <div className="overflow-hidden min-w-0 border-2 border-[#0B5173]/30 text-secondary-normal rounded-lg">
      <div className="relative">
        <div className="w-full h-[2.5rem] absolute top-0 left-0 bg-linear-to-r from-[#000000]/50 to-[#808080]/20 z-1">
          <div className="flex items-center px-[1rem] py-[0.5rem] text-xs h-full">
            <Rating value={4.5} textColor="text-[#efefef]" />
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
            href={`/spaces/${id}`}
            className="primary-button-link px-[0.75rem] py-[0.75rem] mt-[1.5rem]"
          >
            <span className="text-xs text-nowrap">View Details</span>
          </Link>
        </div>
      </div>

      {/* <div className="py-[1rem] px-[0.5rem] flex border-2 border-secondary-normal/20 rounded-lg">
        <div>
          <div>
            {photos[0] ? (
              <UnitImage
                src={photos[0].image_url}
                alt={photos[0].alt}
                style="w-[9rem] h-[6rem]"
              />
            ) : (
              <ImageBroken
                style="w-[9rem] h-[6rem] bg-gray-200"
                iconStyle="text-2xl opacity-50"
              />
            )}
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
          <Rating value={4.5} />
          <span className="font-bold text-sm text-secondary-normal text-nowrap">
            {formatMoney(price, {
              decimals: 2,
              symbol: "₱",
            })}
          </span>
          <div>
            <Link
              href={`/spaces/${id}`}
              className="primary-button-link px-[0.75rem] py-[0.5rem]"
            >
              <span className="text-xs text-nowrap">View Details</span>
            </Link>
          </div>
        </div>
      </div> */}
    </div>
  );
}
