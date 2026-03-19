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
import Link from "next/link";
import { MdArrowBackIos } from "react-icons/md";
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
      <div className="md:hidden">
        <div>
          <div>
            <ProductHeader name={product.name} />
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
          <div>
            <ProductBooking productId={product.id} />
          </div>
        </div>
      </div>

      <div className="hidden md:block lg:hidden">
        <ProductTabletLayout product={product} />
      </div>

      <div className="hidden lg:block">
        <ProductDesktopLayout product={product} />
      </div>
    </div>
  );
}

function ProductTabletLayout({ product }: { product: Product }) {
  return (
    <section className="mx-auto w-full max-w-[62rem] px-1 pb-6 mt-[2rem]">
      <div className="rounded-[1.75rem] border border-secondary-normal/10 bg-[#f8fbfa] p-6 shadow-[0_14px_40px_rgba(0,0,0,0.06)]">
        <div className="mb-6 space-y-3 border-b border-secondary-normal/10 pb-5">
          <Link
            href="/units"
            className="inline-flex items-center gap-2 rounded-full border border-secondary-normal/20 bg-white px-4 py-2 text-xs font-semibold tracking-wide transition hover:bg-primary-light/40"
          >
            <MdArrowBackIos className="text-[0.7rem]" />
            Back to units
          </Link>

          <h1 className="max-w-[28ch] text-[2.05rem] font-bold leading-tight">
            {product.name}
          </h1>

          <div className="flex flex-wrap items-center gap-2">
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
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-secondary-normal/10 bg-white p-3 shadow-sm">
            <ProductPhotosView photos={product.photos} />
          </div>

          <div className="grid grid-cols-12 gap-5">
            <div className="col-span-7 rounded-2xl border border-secondary-normal/10 bg-white px-6 py-4 shadow-sm">
              <ProductDetails
                id={product.id}
                about={product.about}
                attributes={product.attributes}
                maxPersons={product.maxPersons}
                price={product.price}
              />
            </div>

            <aside className="col-span-5 space-y-3">
              <div className="rounded-2xl border border-primary-normal/25 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-bold">Reserve This Unit</h2>
                <p className="mt-1.5 text-xs text-secondary-normal/75">
                  Select your schedule and continue to booking.
                </p>
                <ProductBooking productId={product.id} />
              </div>

              <div className="rounded-2xl border border-secondary-normal/10 bg-white p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-secondary-normal/60">
                  Booking Note
                </p>
                <p className="mt-2 text-xs text-secondary-normal/80">
                  Final availability is confirmed after you select dates.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductDesktopLayout({ product }: { product: Product }) {
  return (
    <section className="mx-auto w-full max-w-[90rem] px-2 pb-8 mt-[3rem]">
      <div className="rounded-[2rem] border border-secondary-normal/10 bg-[#f8fbfa] p-8 shadow-[0_18px_55px_rgba(0,0,0,0.08)] xl:p-10">
        <div className="mb-8 flex items-start justify-between gap-6 border-b border-secondary-normal/10 pb-7">
          <div className="space-y-3">
            <Link
              href="/units"
              className="inline-flex items-center gap-2 rounded-full border border-secondary-normal/20 bg-white px-4 py-2 text-xs font-semibold tracking-wide transition hover:bg-primary-light/40"
            >
              <MdArrowBackIos className="text-[0.7rem]" />
              Back to units
            </Link>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary-normal/60">
                Private staycation unit
              </p>
              <h1 className="mt-2 max-w-[22ch] text-4xl font-bold leading-tight text-secondary-normal xl:text-[2.9rem]">
                {product.name}
              </h1>
            </div>
          </div>

          <div className="hidden rounded-2xl border border-secondary-normal/10 bg-white p-5 text-sm text-secondary-normal shadow-sm lg:block">
            <div className="flex items-center justify-between gap-6">
              <div>
                <p className="text-xs uppercase tracking-[0.15em] text-secondary-normal/60">
                  From
                </p>
                <p className="text-2xl font-bold text-primary-normal">
                  {formatMoney(product.price, { decimals: 2, symbol: "PHP " })}
                </p>
                <p className="text-xs text-secondary-normal/60">per night</p>
              </div>
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 rounded-lg bg-primary-light/40 px-3 py-2">
                  <IoPeopleOutline className="text-lg" />
                  <span>Up to {product.maxPersons} guests</span>
                </div>
                <div className="inline-flex items-center gap-2 rounded-lg bg-primary-light/40 px-3 py-2">
                  <FiHome className="text-lg" />
                  <span>{product.attributes.length} amenities</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8 xl:gap-10">
          <div className="col-span-12 space-y-7 lg:col-span-7 xl:col-span-8">
            <div className="overflow-hidden rounded-2xl border border-secondary-normal/10 bg-white p-3 shadow-sm xl:p-4">
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

          <aside className="col-span-12 lg:col-span-5 xl:col-span-4">
            <div className="space-y-4 lg:sticky lg:top-24">
              <div className="rounded-2xl border border-primary-normal/25 bg-white p-6 shadow-[0_16px_35px_rgba(0,0,0,0.08)] xl:p-7">
                <h2 className="text-xl font-bold">Reserve This Unit</h2>
                <p className="mt-2 text-sm text-secondary-normal/75">
                  Lock in your preferred schedule and complete your booking in a
                  few steps.
                </p>
                <ProductBooking productId={product.id} />
              </div>

              <div className="rounded-2xl border border-secondary-normal/10 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-secondary-normal/60">
                  Booking Note
                </p>
                <p className="mt-2 text-sm text-secondary-normal/80">
                  Availability and rates may change based on selected dates and
                  number of guests.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
