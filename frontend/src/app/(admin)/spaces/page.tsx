import NavigationBottomSpaces from "@/app/(admin)/spaces/components/NavigationBottomSpaces";
import ProductList from "./components/ProductList";
import { Suspense } from "react";
import { Skeleton } from "@mui/material";

export default function SpacesPage() {
  return (
    <div className="flex flex-col">
      <Suspense
        fallback={
          <div className="my-[1rem] grid gap-y-8">
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                className="grid gap-y-5 px-[1.5rem] pt-[1rem] pb-[0.5rem]"
                key={i}
              >
                <Skeleton variant="rounded" animation="wave" height={200} />
                <Skeleton variant="rounded" animation="wave" height={30} />
                <Skeleton variant="rounded" animation="wave" height={60} />
              </div>
            ))}
          </div>
        }
      >
        <ProductList />
      </Suspense>
      <NavigationBottomSpaces />
    </div>
  );
}
