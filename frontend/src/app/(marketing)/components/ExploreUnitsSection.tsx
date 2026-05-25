import Link from "next/link";
import { IProductItemProps } from "@/app/shared/components/ProductItem";
import RenderIcon from "@/app/shared/ui/RenderIcon";
import { HOST } from "@/app/shared/constants/config";
import { formatMoney } from "@/app/shared/lib/formatMoney";
import UnitImage from "@/app/shared/components/UnitImage";

const PREVIEW_LIMIT = 4;

export default async function ExploreUnitsSection() {
  let products: IProductItemProps[] = [];

  try {
    const result = await fetch(`${HOST}/api/products`, { cache: "no-cache" });
    if (result.ok) {
      const data: { products: IProductItemProps[] } = await result.json();
      products = (data.products ?? []).slice(0, PREVIEW_LIMIT);
    }
  } catch {}

  return (
    <section className="py-6 sm:py-10 md:py-12 lg:py-14 xl:py-16 2xl:py-20 min-[1921px]:py-24">
      <h2 className="mb-1 text-center text-xl font-bold sm:text-2xl md:text-3xl lg:text-[2.3rem] xl:text-[2.7rem] 2xl:text-[3.1rem] min-[1921px]:text-[3.5rem]">
        Explore Our Stays
      </h2>
      <p className="mb-6 text-center text-xs text-gray-500 sm:text-sm md:mb-8 md:text-base lg:mb-10 xl:text-lg 2xl:text-xl min-[1921px]:text-[1.35rem]">
        Browse a selection of our available units and find your perfect stay.
      </p>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 md:gap-6 lg:grid-cols-3 xl:grid-cols-3 xl:gap-7 2xl:grid-cols-4 2xl:gap-8 min-[1921px]:grid-cols-5 min-[1921px]:gap-8">
          {products.map((product, index) => (
            <div
              key={product.id}
              className={`w-full max-w-[22rem] justify-self-center overflow-hidden rounded-xl border border-[#0B5173]/20 bg-white shadow-[0_10px_30px_-20px_rgba(11,81,115,0.8)] sm:max-w-none ${
                index >= 2 ? "hidden lg:block" : ""
              }`}
            >
              <Link
                href={`/units/${product.id}`}
                className="block group hover-animation lg:hover:opacity-[0.8]"
              >
                <div className="relative bg-[#f5f8fa] p-2 md:p-2.5">
                  {product.photos?.[0] ? (
                    <UnitImage
                      src={product.photos[0].image_url}
                      alt={product.photos[0].alt || product.name}
                      style="w-full h-[10.5rem] sm:h-[11rem] md:h-[12rem] lg:h-[12.5rem] xl:h-[13rem]"
                      sizes="(min-width: 1920px) 20rem, (min-width: 1536px) 18rem, (min-width: 1280px) 18rem, (min-width: 1024px) 16rem, (min-width: 640px) 45vw, 92vw"
                    />
                  ) : (
                    <div className="flex h-[10.5rem] w-full items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400 sm:h-[11rem] md:h-[12rem] lg:h-[12.5rem] xl:h-[13rem]">
                      No photo available
                    </div>
                  )}
                  <div className="absolute bottom-4 right-4 rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold text-secondary-normal shadow-sm md:text-xs lg:px-3.5 lg:py-1.5">
                    {formatMoney(product.price, { decimals: 2, symbol: "₱" })}
                    /night
                  </div>
                </div>

                <div className="p-4 md:p-5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="line-clamp-1 text-[0.95rem] font-semibold leading-tight text-secondary-normal underline-offset-4 decoration-[#0B5173]/50 group-hover:underline md:text-base lg:text-[1.02rem] xl:text-lg">
                      {product.name}
                    </h3>
                    <span className="whitespace-nowrap text-[11px] text-gray-500 md:text-xs lg:text-sm">
                      {product.maxPersons} guest
                      {product.maxPersons === 1 ? "" : "s"}
                    </span>
                  </div>

                  {product.attributes?.length ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {product.attributes.slice(0, 2).map((attribute) => (
                        <span
                          key={attribute.iconId}
                          className="flex items-center gap-1 rounded-full border border-[#0B5173]/20 bg-[#0B5173]/5 px-2.5 py-1 text-[11px] text-[#0B5173] md:text-xs"
                        >
                          <RenderIcon
                            iconId={attribute.iconId}
                            className="text-[1em] mr-1"
                          />
                          {attribute.name}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-8 text-center font-bold opacity-30 md:mt-10 lg:mt-12">
          Staycations are not currently available.
        </p>
      )}

      <div className="mt-8 flex justify-center md:mt-10 lg:mt-12">
        <div className="inline-flex flex-col items-center gap-1 text-xs md:text-sm lg:text-base">
          <Link
            href="/units"
            className="font-semibold text-secondary-normal hover-animation lg:hover:opacity-[0.5]"
          >
            View All Units
          </Link>
          <span className="h-[1px] w-full bg-secondary-normal/70" />
        </div>
      </div>
    </section>
  );
}
