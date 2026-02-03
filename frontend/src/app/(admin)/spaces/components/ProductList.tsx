import ProductItem, {
  IProductItemProps,
} from "@/app/shared/components/ProductItem";

import { HOST } from "@/app/shared/constants/config";

export default async function ProductList() {
  const result = await fetch(`${HOST}/api/products`, {
    cache: "no-cache",
  });

  if (!result.ok) {
    return <h1>An error occured</h1>;
  }

  const parsedProducts: { message: string; products: IProductItemProps[] } =
    await result.json();

  return (
    <div className="h-[80dvh] overflow-y-auto relative">
      <div>
        <div className="bg-secondary-normal text-white text-center py-[1.5rem]">
          <h1 className="text-center">Your Staycation Spaces</h1>
          <p className="text-sm mt-[0.5rem]">
            Manage your perfect getaways in one place.
          </p>
        </div>
        <div className="mt-[3rem] mb-[4rem] mx-[1rem] grid gap-y-5">
          {parsedProducts.products && parsedProducts.products.length !== 0 ? (
            parsedProducts.products.map((product) => {
              const { id, name, price, photos } = product;

              return (
                <ProductItem
                  key={product.id}
                  id={id}
                  name={name}
                  price={price}
                  photos={photos}
                />
              );
            })
          ) : (
            <p className="opacity-30 font-bold horver_center text-nowrap mt-[2rem]">
              Staycations are not currently available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
