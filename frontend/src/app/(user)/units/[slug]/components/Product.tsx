import { HOST } from "@/app/shared/constants/config";
import {
  IProductAttribute,
  IProductItemProps,
} from "@/app/shared/components/ProductItem";

import { notFound } from "next/navigation";
import ProductPhotosView from "@/app/shared/components/ProductPhotosView";
import ProductDetails from "@/app/shared/components/ProductDetails";
import ProductHeader from "./ProductHeader";
import ProductBooking from "./ProductBooking";

export interface Product extends IProductItemProps {
  maxPersons: number;
  attributes: IProductAttribute[];
}

export default async function Product({ spaceId }: { spaceId: string }) {
  const result = await fetch(`${HOST}/api/products/${spaceId}`);

  if (!result.ok) {
    return notFound();
  }

  const parsedProduct: { message: string; product: Product } =
    await result.json();

  const product = parsedProduct.product;

  if (!product) {
    notFound();
  }

  return (
    <div className="text-secondary-normal">
      <div>
        <div>
          <ProductHeader name={product.name} />
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
        <div>
          <ProductBooking productId={product.id} />
        </div>
      </div>
    </div>
  );
}
