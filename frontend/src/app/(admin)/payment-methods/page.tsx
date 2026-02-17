// import { Suspense } from "react";
import NavigationBottom from "../components/NavigationBottom";
import AddPaymentMethod from "./components/AddPaymentMethod";
import PaymentMethods from "./components/PaymentMethods";

export default function PaymentMethodsPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-72px)]">
      <div className="flex-1 overflow-y-auto">
        {/* <Suspense fallback={<div>Loading...</div>}> */}
        <PaymentMethods />
        {/* </Suspense> */}
        <AddPaymentMethod />
      </div>
      <NavigationBottom />
    </div>
  );
}
