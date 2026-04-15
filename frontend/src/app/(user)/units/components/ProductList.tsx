"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProductItem, {
  IProductItemProps,
} from "@/app/shared/components/ProductItem";
import { HOST } from "@/app/shared/constants/config";
import { Skeleton } from "@mui/material";
import ErrorClient from "@/app/shared/components/ErrorClient";
import { CiCircleRemove } from "react-icons/ci";

const getFirstValue = (value: string | null) => {
  return value ?? undefined;
};

export default function ProductList() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<IProductItemProps[]>([]);
  const [suggestedProducts, setSuggestedProducts] = useState<
    IProductItemProps[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const router = useRouter();
  const checkIn = getFirstValue(searchParams.get("checkIn"));
  const checkOut = getFirstValue(searchParams.get("checkOut"));
  const adults = getFirstValue(searchParams.get("adults"));
  const children = getFirstValue(searchParams.get("children"));
  const totalGuests = getFirstValue(searchParams.get("totalGuests"));
  const searched = getFirstValue(searchParams.get("searched"));

  const hasActiveSearch =
    searched === "1" ||
    Boolean(checkIn) ||
    Boolean(checkOut) ||
    Boolean(adults) ||
    Boolean(children) ||
    Boolean(totalGuests);

  useEffect(() => {
    let mounted = true;

    const fetchProducts = async () => {
      setLoading(true);
      setError(false);

      try {
        const query = new URLSearchParams();
        if (checkIn) query.set("checkIn", checkIn);
        if (checkOut) query.set("checkOut", checkOut);
        if (adults) query.set("adults", adults);
        if (children) query.set("children", children);
        if (totalGuests) query.set("totalGuests", totalGuests);

        const fetchUrl = query.toString()
          ? `${HOST}/api/products?${query.toString()}`
          : `${HOST}/api/products`;

        const result = await fetch(fetchUrl, {
          cache: "no-cache",
          credentials: "include",
        });

        if (!result.ok) {
          if (mounted) setError(true);
          return;
        }

        const parsedProducts: {
          message: string;
          products: IProductItemProps[];
        } = await result.json();

        if (mounted) {
          setProducts(parsedProducts.products ?? []);
        }

        const totalProducts = parsedProducts.products?.length ?? 0;
        const isActiveSearch =
          searched === "1" ||
          Boolean(checkIn) ||
          Boolean(checkOut) ||
          Boolean(adults) ||
          Boolean(children) ||
          Boolean(totalGuests);

        if (isActiveSearch && totalProducts === 0) {
          try {
            const suggestionsResult = await fetch(`${HOST}/api/products`, {
              cache: "no-cache",
              credentials: "include",
            });

            if (suggestionsResult.ok) {
              const suggestionsParsed: {
                message: string;
                products: IProductItemProps[];
              } = await suggestionsResult.json();

              if (mounted) {
                setSuggestedProducts(
                  (suggestionsParsed.products ?? []).slice(0, 3),
                );
              }
            }
          } catch {}
        }
      } catch {
        if (mounted) setError(true);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      mounted = false;
    };
  }, [checkIn, checkOut, adults, children, totalGuests, searched]);

  if (loading) {
    return (
      <div className="my-[1rem] grid w-full gap-y-8 md:mt-[2rem] md:w-[55%]">
        {Array.from({ length: 2 }).map((_, i) => (
          <div className="grid gap-y-5" key={i}>
            <Skeleton variant="rounded" animation="wave" height={200} />
            <Skeleton variant="rounded" animation="wave" height={30} />
            <Skeleton variant="rounded" animation="wave" height={60} />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <ErrorClient onRetry={() => router.refresh()} />;
  }

  const totalProducts = products.length;

  return (
    <div className="grid gap-y-8 mt-[2rem] md:w-[55%]">
      {hasActiveSearch ? (
        <p className="w-max border-2 border-gray-300 rounded-full px-[1rem] py-[0.5rem] text-sm font-semibold text-gray-600 flex items-center gap-x-1">
          <span>
            Search Result: {totalProducts} unit
            {totalProducts === 1 ? "" : "s"} found
          </span>
          <button onClick={() => router.push("/units")}>
            <span className="text-xl text-red-900">
              <CiCircleRemove />
            </span>
          </button>
        </p>
      ) : null}

      {products && products.length !== 0 ? (
        products.map((product) => {
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
