import NavigationBottom from "../components/NavigationBottom";
import AddPaymentMethod from "./components/AddPaymentMethod";
import PaymentMethods from "./components/PaymentMethods";

export default function PaymentMethodsPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-72px)]">
      <div className="flex-1 overflow-y-auto">
        <PaymentMethods />
        <AddPaymentMethod />
      </div>
      <NavigationBottom />
    </div>
  );
}
