import { HOST } from "@/app/shared/constants/config";
import {
  IProductAttribute,
  IProductItemProps,
} from "@/app/shared/components/ProductItem";

import { notFound } from "next/navigation";
import ProductPhotosView from "@/app/shared/components/ProductPhotosView";
import ProductDetails from "@/app/shared/components/ProductDetails";
import GuestProductHeader from "./GuestProductHeader";

export interface Product extends IProductItemProps {
  maxPersons: number;
  attributes: IProductAttribute[];
}

export default async function GuestProduct({ spaceId }: { spaceId: string }) {
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
      <div className="px-[1rem] pb-[2rem]">
        <div>
          <GuestProductHeader name={product.name} />
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
    </div>
  );
}
