import ProductUnit, { IProductUnit } from "@/app/shared/components/ProductUnit";
import { HOST } from "@/app/shared/constants/config";

export default async function ProductUnits() {
  const result = await fetch(`${HOST}/api/products`, {
    cache: "no-cache",
  });

  if (!result.ok) {
    return <h1>An error occured</h1>;
  }

  const parsedProducts: { message: string; products: IProductUnit[] } =
    await result.json();

  // NEXT TASK: ALTERNATIVE WHEN ALT AND SRC IS MISSING
  return (
    <div className="h-[80dvh] overflow-y-auto">
      <div>
        <div className="mt-[3rem] mb-[4rem] mx-[1rem] grid gap-y-5">
          {parsedProducts.products.map((product) => {
            const { id, about, maxPersons, name, price, thumbnail } = product;
            const { alt, image_url } = thumbnail;
            return (
              <ProductUnit
                key={product.id}
                id={id}
                about={about}
                imgAlt={alt}
                imgSrc={image_url}
                maxPersons={maxPersons}
                name={name}
                price={price}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
