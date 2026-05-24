import NavigationBottomSpaces from "@/app/(admin)/spaces/components/NavigationBottomSpaces";
import ProductList from "./components/ProductList";
import SpacesDesktopToolbar from "./components/SpacesDesktopToolbar";

export default function SpacesPage() {
  return (
    <div className="flex flex-col lg:my-[2rem]">
      <SpacesDesktopToolbar />
      <ProductList />
      <NavigationBottomSpaces />
    </div>
  );
}
