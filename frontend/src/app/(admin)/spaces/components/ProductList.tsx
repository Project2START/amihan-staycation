import ProductItem, {
  IProductItemProps,
} from "@/app/shared/components/ProductItem";

import fetchWithAuth from "@/app/shared/lib/fetchWithAuth";
import { notFound } from "next/navigation";

export default async function ProductList() {
  const result = await fetchWithAuth("api/products/admin", {
    cache: "no-cache",
    method: "GET",
  });

  if (!result.ok) {
    return notFound();
  }

  const parsedProducts: { message: string; products: IProductItemProps[] } =
    await result.json();

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
              <p className="mt-1 text-3xl font-semibold">
                {parsedProducts.products.length}
              </p>
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
