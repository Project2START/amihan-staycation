// import { Suspense } from "react";
import { Suspense } from "react";
import NavigationBottom from "../components/NavigationBottom";
import AddPaymentMethod from "./components/AddPaymentMethod";
import PaymentMethods from "./components/PaymentMethods";
import { Skeleton } from "@mui/material";

export default function PaymentMethodsPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-72px)]">
      <div className="flex-1 overflow-y-auto">
        <Suspense
          fallback={
            <div className="p-4 md:p-7 lg:p-8 mt-[1.5rem] md:mt-6 lg:mt-7">
              <div className="hidden md:flex items-center justify-between rounded-xl border border-secondary-normal/10 bg-white px-6 py-5 lg:px-7 lg:py-6 mb-6 lg:mb-8 shadow-sm">
                <div className="space-y-2">
                  <Skeleton variant="rounded" width={220} height={32} />
                  <Skeleton variant="rounded" width={360} height={16} />
                </div>
                <Skeleton variant="rounded" width={180} height={42} />
              </div>

              <div className="grid gap-y-5 md:gap-4 lg:gap-5 md:rounded-xl md:border md:border-secondary-normal/10 md:bg-white md:p-5 lg:p-6 md:shadow-sm">
                <Skeleton variant="rounded" height={70} />
                <Skeleton
                  variant="rounded"
                  height={80}
                  className="md:!h-22 lg:!h-24"
                />
                <Skeleton
                  variant="rounded"
                  height={80}
                  className="md:!h-22 lg:!h-24"
                />
                <Skeleton
                  variant="rounded"
                  height={80}
                  className="md:!h-22 lg:!h-24"
                />
                <Skeleton
                  variant="rounded"
                  height={80}
                  className="md:!h-22 lg:!h-24"
                />
              </div>
            </div>
          }
        >
          <PaymentMethods />
        </Suspense>
        <AddPaymentMethod />
      </div>
      <NavigationBottom />
    </div>
  );
}
