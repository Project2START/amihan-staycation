import HeaderAdmin from "@/app/(admin)/components/HeaderAdmin";
import NavigationBottomAdmin from "@/app/(admin)/spaces/components/NavigationBottomSpaces";
import ProductList from "./components/ProductList";

export default function SpacesPage() {
  return (
    <div className="flex flex-col">
      <HeaderAdmin />
      <ProductList />
      <NavigationBottomAdmin />
    </div>
  );
}
