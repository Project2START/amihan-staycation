import NavigationBottomSpaces from "@/app/(admin)/spaces/components/NavigationBottomSpaces";
import ProductList from "./components/ProductList";
import { Suspense } from "react";
import { Skeleton } from "@mui/material";
import SpacesDesktopToolbar from "./components/SpacesDesktopToolbar";

export default function SpacesPage() {
  return (
    <div className="flex flex-col lg:my-[2rem]">
      <SpacesDesktopToolbar />
      <Suspense
        fallback={
          <div className="my-[1rem] grid gap-y-8 lg:mx-auto lg:mt-0 lg:w-full lg:max-w-[1280px] lg:gap-y-6">
            <div className="hidden lg:grid lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-6 lg:items-start">
              <div className="grid gap-4">
                <div className="rounded-xl border border-secondary-normal/10 bg-white p-5 shadow-sm">
                  <Skeleton
                    variant="text"
                    animation="wave"
                    height={18}
                    width="50%"
                  />
                  <Skeleton
                    variant="text"
                    animation="wave"
                    height={40}
                    width="35%"
                  />
                </div>
                <div className="rounded-xl border border-secondary-normal/10 bg-white p-4 shadow-sm">
                  <Skeleton
                    variant="text"
                    animation="wave"
                    height={16}
                    width="55%"
                  />
                  <Skeleton
                    variant="text"
                    animation="wave"
                    height={18}
                    width="90%"
                  />
                </div>
                <div className="rounded-xl border border-secondary-normal/10 bg-white p-4 shadow-sm">
                  <Skeleton
                    variant="text"
                    animation="wave"
                    height={16}
                    width="55%"
                  />
                  <Skeleton
                    variant="text"
                    animation="wave"
                    height={18}
                    width="90%"
                  />
                </div>
              </div>

              <div className="grid gap-y-6">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div
                    className="grid gap-y-4 rounded-2xl border border-secondary-normal/10 bg-white px-6 py-6 shadow-sm"
                    key={i}
                  >
                    <Skeleton variant="rounded" animation="wave" height={260} />
                    <Skeleton variant="rounded" animation="wave" height={30} />
                    <Skeleton variant="rounded" animation="wave" height={60} />
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:hidden">
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
          </div>
        }
      >
        <ProductList />
      </Suspense>
      <NavigationBottomSpaces />
    </div>
  );
}
