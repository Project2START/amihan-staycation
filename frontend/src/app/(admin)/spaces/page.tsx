import HeaderAdmin from "@/app/(admin)/components/HeaderAdmin";
import NavigationBottomAdmin from "@/app/(admin)/components/NavigationBottomSpaces";

export default function SpacesPage() {
  return (
    <div className="flex flex-col">
      <HeaderAdmin />
      <ProductList />
      <NavigationBottomAdmin />
    </div>
  );
}
