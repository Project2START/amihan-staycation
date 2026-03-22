import { Suspense } from "react";
import GreetUser from "../components/GreetUser";
import ProductList from "./components/ProductList";
import { Skeleton } from "@mui/material";
import SearchUnit from "@/app/shared/components/search-unit/SearchUnit";

interface UnitsPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function UnitsPage({ searchParams }: UnitsPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;

  return (
    <div className="px-[1.5rem] py-[2rem] ">
      <GreetUser />
      <div className="mt-[1.5rem] mb-[2.5rem]">
        <SearchUnit />
      </div>
      <Suspense
        fallback={
          <>
            {/* Mobile skeletons */}
            <div className="my-[1rem] grid gap-y-8 md:hidden">
              {Array.from({ length: 2 }).map((_, i) => (
                <div className="grid gap-y-5" key={i}>
                  <Skeleton variant="rounded" animation="wave" height={200} />
                  <Skeleton variant="rounded" animation="wave" height={30} />
                  <Skeleton variant="rounded" animation="wave" height={60} />
                </div>
              ))}
            </div>
            {/* Desktop/laptop skeletons */}
            <div className="hidden md:flex md:justify-center">
              <div className="grid gap-y-8 mt-[2rem] w-[55%]">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div className="grid gap-y-5" key={i}>
                    <Skeleton variant="rounded" animation="wave" height={200} />
                    <Skeleton variant="rounded" animation="wave" height={30} />
                    <Skeleton variant="rounded" animation="wave" height={60} />
                  </div>
                ))}
              </div>
            </div>
          </>
        }
      >
        <div className="md:flex md:justify-center">
          <ProductList searchParams={resolvedSearchParams} />
        </div>
      </Suspense>
    </div>
  );
}
