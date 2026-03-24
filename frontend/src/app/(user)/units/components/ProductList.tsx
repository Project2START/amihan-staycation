import ProductItem, {
  IProductItemProps,
} from "@/app/shared/components/ProductItem";
import { HOST } from "@/app/shared/constants/config";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

interface ProductListProps {
  searchParams?: Record<string, string | string[] | undefined>;
}

const getFirstValue = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
};

export default async function ProductList({ searchParams }: ProductListProps) {
  const cookieStore = await cookies();

  const token = cookieStore.get("auth_token")?.value;

  const query = new URLSearchParams();

  const checkIn = getFirstValue(searchParams?.checkIn);
  const checkOut = getFirstValue(searchParams?.checkOut);
  const adults = getFirstValue(searchParams?.adults);
  const children = getFirstValue(searchParams?.children);
  const searched = getFirstValue(searchParams?.searched);

  const hasActiveSearch =
    searched === "1" ||
    Boolean(checkIn) ||
    Boolean(checkOut) ||
    Boolean(adults) ||
    Boolean(children);

  if (checkIn) query.set("checkIn", checkIn);
  if (checkOut) query.set("checkOut", checkOut);
  if (adults) query.set("adults", adults);
  if (children) query.set("children", children);

  const fetchUrl = query.toString()
    ? `${HOST}/api/products?${query.toString()}`
    : `${HOST}/api/products`;

  const result = await fetch(fetchUrl, {
    cache: "no-cache",
    headers: token ? { Cookie: `auth_token=${token}` } : {},
  });

  if (!result.ok) {
    return notFound();
  }

  const parsedProducts: { message: string; products: IProductItemProps[] } =
    await result.json();

  const totalProducts = parsedProducts.products?.length ?? 0;

  let suggestedProducts: IProductItemProps[] = [];

  if (hasActiveSearch && totalProducts === 0) {
    try {
      const suggestionsResult = await fetch(`${HOST}/api/products`, {
        cache: "no-cache",
        headers: token ? { Cookie: `auth_token=${token}` } : {},
      });

      if (suggestionsResult.ok) {
        const suggestionsParsed: {
          message: string;
          products: IProductItemProps[];
        } = await suggestionsResult.json();

        suggestedProducts = (suggestionsParsed.products ?? []).slice(0, 3);
      }
    } catch {}
  }

  return (
    <div className="grid gap-y-8 mt-[2rem] md:w-[55%]">
      {hasActiveSearch ? (
        <p className="text-sm font-semibold text-gray-600">
          Search Result: {totalProducts} unit{totalProducts === 1 ? "" : "s"}{" "}
          found
        </p>
      ) : null}

      {parsedProducts.products && parsedProducts.products.length !== 0 ? (
        parsedProducts.products.map((product) => {
          const {
            id,
            name,
            price,
            photos,
            attributes,
            about,
            maxPersons,
            rating,
            ratingCount,
          } = product;

          return (
            <ProductItem
              key={id}
              id={id}
              name={name}
              price={price}
              photos={photos}
              attributes={attributes}
              about={about}
              maxPersons={maxPersons}
              rating={rating}
              ratingCount={ratingCount}
              linkPath="/units"
            />
          );
        })
      ) : hasActiveSearch ? (
        <div className="grid gap-y-5">
          <p className="text-sm font-semibold text-gray-600 opacity-50">
            No exact matches found.
          </p>

          {suggestedProducts.length > 0 ? (
            <div className="grid gap-y-4 mt-[2rem]">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-gray-500">
                Suggested alternatives
              </p>
              {suggestedProducts.map((product) => {
                const {
                  id,
                  name,
                  price,
                  photos,
                  attributes,
                  about,
                  maxPersons,
                  rating,
                  ratingCount,
                } = product;

                return (
                  <ProductItem
                    key={id}
                    id={id}
                    name={name}
                    price={price}
                    photos={photos}
                    attributes={attributes}
                    about={about}
                    maxPersons={maxPersons}
                    rating={rating}
                    ratingCount={ratingCount}
                    linkPath="/units"
                  />
                );
              })}
            </div>
          ) : null}
        </div>
      ) : (
        <p className="opacity-30 font-bold horver_center text-nowrap mt-[2rem]">
          Staycations are not currently available.
        </p>
      )}
    </div>
  );
}
