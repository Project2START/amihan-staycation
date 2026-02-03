import Rating from "@/app/shared/components/Rating";
import { Product } from "./Product";
import { formatMoney } from "@/app/shared/lib/formatMoney";
import IconLabel from "@/app/shared/components/IconLabel";
import ClampedParagraph from "@/app/shared/components/ClampedParagraph";

export default function ProductDetails({
  price,
  about,
  attributes,
  maxPersons,
}: Pick<Product, "about" | "attributes" | "maxPersons" | "price">) {
  return (
    <div className="text-xs grid gap-y-7 my-[1rem]">
      <div className="flex items-start justify-between">
        <div className="flex items-center mt-[0.5rem]">
          <Rating value={4.5} textColor="font-bold" />
          <button className="underline ml-[0.5rem]">
            <span>Based on 5 reviews</span>
          </button>
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-bold">
            {formatMoney(price, { decimals: 2, symbol: "₱" })}
          </span>
          <span>1 night, {maxPersons} persons max</span>
        </div>
      </div>
      <div>
        <h2
          className="mb-[1rem]"
          style={{ display: about === "" ? "none" : "block" }}
        >
          About this unit
        </h2>

        <div className="leading-7">
          <ClampedParagraph text={about} />
        </div>
      </div>
      <div>
        <h3
          className="mb-[2rem]"
          style={{ display: attributes.length === 0 ? "none" : "block" }}
        >
          Everything You’ll Enjoy Here
        </h3>
        <ul className="flex flex-wrap gap-3">
          {attributes.map((attribute) => {
            return (
              <li key={attribute.iconId}>
                <IconLabel
                  iconId={attribute.iconId}
                  name={attribute.name}
                  quantity={attribute.quantity}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
