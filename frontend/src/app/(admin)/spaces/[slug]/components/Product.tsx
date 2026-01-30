import { HOST } from "@/app/shared/constants/config";
import {
  IProductAttribute,
  IProductItemProps,
} from "@/app/shared/components/ProductItem";
import ProductHeader from "./ProductHeader";
import ProductPhotosView from "./ProductPhotosView";
import ProductDetails from "./ProductDetails";
import ProductFooter from "./ProductFooter";
import { notFound } from "next/navigation";

export interface Product extends IProductItemProps {
  maxPersons: number;
  attributes: IProductAttribute[];
}

export default async function Product({ spaceId }: { spaceId: string }) {
  const result = await fetch(`${HOST}/api/products/${spaceId}`);

  if (!result.ok) {
    return <h1>An error occured</h1>;
  }

  const parsedProduct: { message: string; product: Product } =
    await result.json();

  const product = parsedProduct.product;

  if (!product) {
    notFound();
  }

  console.log(parsedProduct);
  return (
    <div className="text-secondary-normal">
      <div className="px-[1rem]">
        <div>
          <ProductHeader product={product} />
        </div>
        <div>
          <ProductPhotosView photos={product.photos} />
        </div>
        <div>
          <ProductDetails
            about={product.about}
            attributes={product.attributes}
            maxPersons={product.maxPersons}
            price={product.price}
          />
        </div>
      </div>

      <div>
        <ProductFooter />
      </div>
    </div>
  );
}
