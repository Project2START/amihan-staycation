import { HOST } from "@/app/shared/constants/config";
import {
  IProductAttribute,
  IProductItemProps,
} from "@/app/shared/components/ProductItem";
import ProductHeader from "./ProductHeader";
import ProductPhotosView from "./ProductPhotosView";

interface Product extends IProductItemProps {
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

  console.log(product);
  return (
    <div className="text-secondary-normal px-[1rem]">
      <div>
        <ProductHeader name={product.name} id={product.id} />
      </div>
      <div>
        <ProductPhotosView photos={product.photos} />
      </div>
    </div>
  );
}
