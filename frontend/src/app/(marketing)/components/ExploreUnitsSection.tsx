import Link from "next/link";
import { IProductItemProps } from "@/app/shared/components/ProductItem";
import RenderIcon from "@/app/shared/ui/RenderIcon";
import { HOST } from "@/app/shared/constants/config";
import { formatMoney } from "@/app/shared/lib/formatMoney";
import UnitImage from "@/app/shared/components/UnitImage";

const PREVIEW_LIMIT = 2;

export default async function ExploreUnitsSection() {
  let products: IProductItemProps[] = [];

  try {
    const result = await fetch(`${HOST}/api/products`, { cache: "no-cache" });
    if (result.ok) {
      const data: { products: IProductItemProps[] } = await result.json();
      products = (data.products ?? []).slice(0, PREVIEW_LIMIT);
    }
  } catch {
    // silently fall through — show empty state
  }

  return (
    <section className="py-[2rem]">
      <h2 className="text-center font-bold text-2xl mb-[0.25rem]">
        Explore Our Stays
      </h2>
      <p className="text-center text-sm text-gray-500 mb-[1.5rem]">
        Browse a selection of our available units and find your perfect stay.
      </p>

      {products.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="w-full max-w-[21rem] justify-self-center rounded-xl border border-[#0B5173]/20 bg-white shadow-[0_10px_30px_-20px_rgba(11,81,115,0.8)] overflow-hidden"
            >
              <Link href={`/units/${product.id}`} className="block group">
                <div className="relative bg-[#f5f8fa] p-2">
                  {product.photos?.[0] ? (
                    <UnitImage
                      src={product.photos[0].image_url}
                      alt={product.photos[0].alt || product.name}
                      style="w-full h-[10.5rem]"
                    />
                  ) : (
                    <div className="h-[10.5rem] w-full rounded-lg flex items-center justify-center text-xs text-gray-400 bg-gray-100">
                      No photo available
                    </div>
                  )}
                  <div className="absolute right-4 bottom-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-secondary-normal shadow-sm">
                    {formatMoney(product.price, { decimals: 2, symbol: "₱" })}
                    /night
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-[0.95rem] leading-tight text-secondary-normal line-clamp-1 group-hover:underline underline-offset-4 decoration-[#0B5173]/50">
                      {product.name}
                    </h3>
                    <span className="text-[11px] text-gray-500 whitespace-nowrap">
                      {product.maxPersons} guest
                      {product.maxPersons === 1 ? "" : "s"}
                    </span>
                  </div>

                  {product.attributes?.length ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {product.attributes.slice(0, 2).map((attribute) => (
                        <span
                          key={attribute.iconId}
                          className="text-[11px] rounded-full border border-[#0B5173]/20 bg-[#0B5173]/5 px-2.5 py-1 text-[#0B5173] flex items-center gap-1"
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
        <p className="text-center opacity-30 font-bold mt-[2rem]">
          Staycations are not currently available.
        </p>
      )}

      <div className="flex justify-center mt-[2rem]">
        <div className="text-xs inline-flex flex-col items-center gap-1">
          <Link href="/units" className="text-secondary-normal font-semibold">
            View All Units
          </Link>
          <span className="h-[1px] w-full bg-secondary-normal/70" />
        </div>
      </div>
    </section>
  );
}
