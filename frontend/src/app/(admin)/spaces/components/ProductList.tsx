"use client";

import { useCallback, useEffect, useState } from "react";
import ProductItem, {
  IProductItemProps,
} from "@/app/shared/components/ProductItem";
import fetchWithAuthClient from "@/app/shared/lib/fetchWithAuthClient";
import { Skeleton } from "@mui/material";
import NotFoundClient from "@/app/shared/components/NotFoundClient";

export default function ProductList() {
  const [products, setProducts] = useState<IProductItemProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      const result = await fetchWithAuthClient("api/products/admin", {
        cache: "no-cache",
        method: "GET",
      });

      if (!result.ok) {
        setError(true);
        return;
      }

      const parsedProducts: {
        message: string;
        products: IProductItemProps[];
      } = await result.json();

      setProducts(parsedProducts.products ?? []);
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const handleSpacesUpdated = () => {
      fetchProducts();
    };

    window.addEventListener("spaces:updated", handleSpacesUpdated);

    return () => {
      window.removeEventListener("spaces:updated", handleSpacesUpdated);
    };
  }, [fetchProducts]);

  if (loading) {
    return (
      <div className="relative h-[80dvh] overflow-y-auto lg:mx-auto lg:h-[calc(100dvh-18rem)] lg:w-full lg:max-w-[1280px]">
        <div className="my-[1rem] grid gap-y-8 lg:mx-auto lg:mt-0 lg:w-full lg:max-w-[1280px] lg:gap-y-6">
          <div className="hidden lg:grid lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-6 lg:items-start">
            <div className="grid gap-4">
              <div className="rounded-xl border border-secondary-normal/10 bg-white p-5 shadow-sm">
                <Skeleton
                  variant="text"
                  animation="wave"
                  height={18}
                  width="50%"
                />
                <Skeleton
                  variant="text"
                  animation="wave"
                  height={40}
                  width="35%"
                />
              </div>
              <div className="rounded-xl border border-secondary-normal/10 bg-white p-4 shadow-sm">
                <Skeleton
                  variant="text"
                  animation="wave"
                  height={16}
                  width="55%"
                />
                <Skeleton
                  variant="text"
                  animation="wave"
                  height={18}
                  width="90%"
                />
              </div>
              <div className="rounded-xl border border-secondary-normal/10 bg-white p-4 shadow-sm">
                <Skeleton
                  variant="text"
                  animation="wave"
                  height={16}
                  width="55%"
                />
                <Skeleton
                  variant="text"
                  animation="wave"
                  height={18}
                  width="90%"
                />
              </div>
            </div>

            <div className="grid gap-y-6">
              {Array.from({ length: 2 }).map((_, i) => (
                <div
                  className="grid gap-y-4 rounded-2xl border border-secondary-normal/10 bg-white px-6 py-6 shadow-sm"
                  key={i}
                >
                  <Skeleton variant="rounded" animation="wave" height={260} />
                  <Skeleton variant="rounded" animation="wave" height={30} />
                  <Skeleton variant="rounded" animation="wave" height={60} />
                </div>
              ))}
            </div>
          </div>

          <div className="lg:hidden">
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                className="grid gap-y-5 px-[1.5rem] pt-[1rem] pb-[0.5rem]"
                key={i}
              >
                <Skeleton variant="rounded" animation="wave" height={200} />
                <Skeleton variant="rounded" animation="wave" height={30} />
                <Skeleton variant="rounded" animation="wave" height={60} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <NotFoundClient />;
  }

  return (
    <div className="relative h-[80dvh] overflow-y-auto lg:mx-auto lg:h-[calc(100dvh-18rem)] lg:w-full lg:max-w-[1280px]">
      <div className="pb-[4.5rem] lg:pb-0 ">
        <div className="bg-secondary-normal text-white text-center py-[1.5rem] lg:hidden">
          <h1 className="text-center">Your Staycation Spaces</h1>
          <p className="text-sm mt-[0.5rem]">
            Manage your perfect getaways in one place.
          </p>
        </div>

        <div className="lg:grid lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-6 lg:items-start">
          <aside className="hidden lg:sticky lg:top-0 lg:flex lg:flex-col lg:gap-4">
            <div className="rounded-xl border border-secondary-normal/10 bg-white p-5 text-secondary-normal shadow-sm">
              <p className="text-[0.62rem] uppercase tracking-[0.08em] text-secondary-normal/60">
                Total Units
              </p>
              <p className="mt-1 text-3xl font-semibold">{products.length}</p>
            </div>
            <div className="rounded-xl border border-secondary-normal/10 bg-white p-4 text-secondary-normal shadow-sm">
              <p className="text-[0.62rem] uppercase tracking-[0.08em] text-secondary-normal/60">
                Availability
              </p>
              <p className="mt-1 text-sm font-medium text-secondary-normal/80">
                Keep your listings updated to improve booking confidence.
              </p>
            </div>
            <div className="rounded-xl border border-secondary-normal/10 bg-white p-4 text-secondary-normal shadow-sm">
              <p className="text-[0.62rem] uppercase tracking-[0.08em] text-secondary-normal/60">
                Quick Action
              </p>
              <p className="mt-1 text-sm font-medium text-secondary-normal/80">
                Use Add New Unit to publish another staycation space.
              </p>
            </div>
          </aside>

          <div className="mt-[3rem] mx-[1rem] grid gap-y-5 lg:mx-0 lg:mt-0 lg:gap-y-6">
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
                    linkPath="/spaces"
                  />
                );
              })
            ) : (
              <p className="opacity-30 font-bold horver_center text-nowrap mt-[2rem] lg:mt-[4rem]">
                Staycations are not currently available.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
