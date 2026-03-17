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

  const hasSearched = searched === "1";
  const totalProducts = parsedProducts.products?.length ?? 0;

  return (
    <div className="grid gap-y-8 mt-[2rem]">
      {hasSearched ? (
        <p className="text-sm font-semibold text-gray-600">
          Search Result: {totalProducts} unit{totalProducts === 1 ? "" : "s"}{" "}
          found
        </p>
      ) : null}

      {parsedProducts.products && parsedProducts.products.length !== 0 ? (
        parsedProducts.products.map((product) => {
          const { id, name, price, photos, attributes, about, maxPersons } =
            product;

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
              linkPath="/units"
            />
          );
        })
      ) : (
        <p className="opacity-30 font-bold horver_center text-nowrap mt-[2rem]">
          Staycations are not currently available.
        </p>
      )}
    </div>
  );
}
