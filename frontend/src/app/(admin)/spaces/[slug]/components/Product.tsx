import { HOST } from "@/app/shared/constants/config";
import {
  IProductAttribute,
  IProductItemProps,
} from "@/app/shared/components/ProductItem";
import ProductHeader from "./ProductHeader";
import ProductPhotosView from "../../../../shared/components/ProductPhotosView";
import ProductDetails from "../../../../shared/components/ProductDetails";
import ProductFooter from "./ProductFooter";
import { notFound } from "next/navigation";
import { IoPeopleOutline } from "react-icons/io5";
import { FiHome } from "react-icons/fi";
import { formatMoney } from "@/app/shared/lib/formatMoney";

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
      <div className="px-[1rem] md:hidden">
        <div>
          <ProductHeader product={product} />
        </div>
        <div>
          <ProductPhotosView photos={product.photos} />
        </div>
        <div>
          <ProductDetails
            id={product.id}
            about={product.about}
            attributes={product.attributes}
            maxPersons={product.maxPersons}
            price={product.price}
          />
        </div>
      </div>

      <div className="hidden md:block lg:hidden">
        <section className="mx-auto w-full max-w-[62rem] px-2 pb-6 pt-3">
          <div className="rounded-[1.75rem] border border-secondary-normal/10 bg-[#f8fbfa] p-6 shadow-[0_14px_40px_rgba(0,0,0,0.06)]">
            <ProductHeader product={product} />

            <div className="mb-5 flex flex-wrap items-center gap-2 border-b border-secondary-normal/10 pb-5 pt-2">
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-primary-normal">
                {formatMoney(product.price, { decimals: 2, symbol: "PHP " })} /
                night
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs">
                <IoPeopleOutline className="text-sm" />
                {product.maxPersons} guests max
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs">
                <FiHome className="text-sm" />
                {product.attributes.length} amenities
              </span>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-secondary-normal/10 bg-white p-3 shadow-sm">
                <ProductPhotosView photos={product.photos} />
              </div>

              <div className="rounded-2xl border border-secondary-normal/10 bg-white px-6 py-4 shadow-sm">
                <ProductDetails
                  id={product.id}
                  about={product.about}
                  attributes={product.attributes}
                  maxPersons={product.maxPersons}
                  price={product.price}
                />
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="hidden lg:block">
        <section className="mx-auto w-full max-w-[90rem] px-2 pb-8 pt-4">
          <div className="rounded-[2rem] border border-secondary-normal/10 bg-[#f8fbfa] p-8 shadow-[0_18px_55px_rgba(0,0,0,0.08)] xl:p-10">
            <div className="mb-8 border-b border-secondary-normal/10 pb-7">
              <ProductHeader product={product} />
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-primary-normal">
                  {formatMoney(product.price, { decimals: 2, symbol: "PHP " })}{" "}
                  / night
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs">
                  <IoPeopleOutline className="text-sm" />
                  {product.maxPersons} guests max
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs">
                  <FiHome className="text-sm" />
                  {product.attributes.length} amenities
                </span>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-8 xl:gap-10">
              <div className="col-span-12 space-y-7 lg:col-span-8">
                <div className="rounded-2xl border border-secondary-normal/10 bg-white p-4 shadow-sm">
                  <ProductPhotosView photos={product.photos} />
                </div>

                <div className="rounded-2xl border border-secondary-normal/10 bg-white px-7 py-4 shadow-sm xl:px-8 xl:py-5">
                  <ProductDetails
                    id={product.id}
                    about={product.about}
                    attributes={product.attributes}
                    maxPersons={product.maxPersons}
                    price={product.price}
                  />
                </div>
              </div>

              <aside className="col-span-12 lg:col-span-4">
                <div className="sticky top-24 rounded-2xl border border-secondary-normal/10 bg-white p-6 shadow-sm xl:p-7">
                  <h2 className="text-xl font-bold">Unit Management</h2>
                  <p className="mt-2 text-sm text-secondary-normal/75">
                    Use the action controls in the header to edit details,
                    configure settings, or delete this unit.
                  </p>
                  <div className="mt-5 space-y-2 text-xs text-secondary-normal/80">
                    <p>Changes apply immediately to guest-facing listings.</p>
                    <p>
                      Review photos and details carefully before publishing
                      updates.
                    </p>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </div>

      <div>
        <ProductFooter />
      </div>
    </div>
  );
}
