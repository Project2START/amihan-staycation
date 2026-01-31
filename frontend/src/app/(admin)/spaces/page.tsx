import HeaderAdmin from "@/app/(admin)/components/HeaderAdmin";
import NavigationBottomAdmin from "@/app/(admin)/components/NavigationBottomSpaces";

export default function page() {
  return (
    <div className="flex flex-col">
      <HeaderAdmin />
      <div></div>
      <NavigationBottomAdmin />
    </div>
  );
}
