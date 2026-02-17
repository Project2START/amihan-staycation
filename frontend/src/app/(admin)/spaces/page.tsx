import NavigationBottomSpaces from "@/app/(admin)/spaces/components/NavigationBottomSpaces";
import ProductList from "./components/ProductList";

export default function SpacesPage() {
  return (
    <div className="flex flex-col">
      <ProductList />
      <NavigationBottomSpaces />
    </div>
  );
}
