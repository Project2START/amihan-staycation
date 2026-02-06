import ProductItem, {
  IProductItemProps,
} from "@/app/shared/components/ProductItem";
import { HOST } from "@/app/shared/constants/config";
import { notFound } from "next/navigation";

export default async function UserProductList() {
  const result = await fetch(`${HOST}/api/products`, {
    cache: "no-cache",
  });

  if (!result.ok) {
    return notFound();
  }

  const parsedProducts: { message: string; products: IProductItemProps[] } =
    await result.json();

  return (
    <div className="my-[2rem] grid gap-y-5">
      {parsedProducts.products && parsedProducts.products.length !== 0 ? (
        parsedProducts.products.map((product) => {
          const { id, name, price, photos, attributes, about } = product;

          return (
            <ProductItem
              key={id}
              id={id}
              name={name}
              price={price}
              photos={photos}
              attributes={attributes}
              about={about}
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
