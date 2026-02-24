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
            <div className="grid gap-y-5 p-4 mt-[1.5rem]">
              <Skeleton variant="rounded" height={70} />
              <Skeleton variant="rounded" height={70} />
              <Skeleton variant="rounded" height={70} />
              <Skeleton variant="rounded" height={70} />
              <Skeleton variant="rounded" height={70} />
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
