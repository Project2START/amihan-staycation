import HeaderAdmin from "@/app/(admin)/components/HeaderAdmin";
import NavigationBottomAdmin from "@/app/(admin)/spaces/components/NavigationBottomSpaces";
import ProductUnits from "./components/ProductUnits";

export default function page() {
  return (
    <div className="flex flex-col">
      <HeaderAdmin />
      <ProductUnits />
      <NavigationBottomAdmin />
    </div>
  );
}
