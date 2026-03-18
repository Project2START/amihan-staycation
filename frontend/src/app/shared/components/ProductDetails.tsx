import Rating from "@/app/shared/components/Rating";
import { HOST } from "@/app/shared/constants/config";
import { Product } from "../../(admin)/spaces/[slug]/components/Product";
import { formatMoney } from "@/app/shared/lib/formatMoney";
import IconLabel from "@/app/shared/components/IconLabel";
import ClampedParagraph from "@/app/shared/components/ClampedParagraph";
import Link from "next/link";

type ProductReviewSummaryResponse = {
  reviews?: Array<{
    rating: number;
    isHidden: boolean;
  }>;
};

export default async function ProductDetails({
  price,
  about,
  attributes,
  maxPersons,
  id,
}: Pick<Product, "about" | "attributes" | "maxPersons" | "price" | "id">) {
  let averageRating = 0;
  let reviewCount = 0;

  if (HOST) {
    try {
      const response = await fetch(`${HOST}/api/reviews/product/${id}`, {
        cache: "no-store",
      });

      if (response.ok) {
        const data: ProductReviewSummaryResponse = await response.json();
        const visibleReviews = (data.reviews ?? []).filter(
          (review) => !review.isHidden,
        );

        reviewCount = visibleReviews.length;

        if (reviewCount > 0) {
          const total = visibleReviews.reduce(
            (sum, review) => sum + review.rating,
            0,
          );
          averageRating = total / reviewCount;
        }
      }
    } catch {
      averageRating = 0;
      reviewCount = 0;
    }
  }

  return (
    <div className="text-xs grid gap-y-7 my-[1rem]">
      <div className="flex items-start justify-between">
        <Link href={`/reviews?productId=${id}`}>
          <div className="flex items-center mt-[0.5rem]">
            <Rating
              value={Number(averageRating.toFixed(1))}
              textColor="font-bold"
            />
            {reviewCount === 0 ? (
              <span className="ml-[0.5rem]">No review as of the moment</span>
            ) : (
              <span className="underline ml-[0.5rem]">
                Based on {reviewCount} review{reviewCount === 1 ? "" : "s"}
              </span>
            )}
          </div>
        </Link>
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
