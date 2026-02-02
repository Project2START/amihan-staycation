import HeaderAdmin from "@/app/(admin)/components/HeaderAdmin";
import NavigationBottomAdmin from "@/app/(admin)/spaces/components/NavigationBottomSpaces";

export default function page() {
  return (
    <div className="flex flex-col">
      <HeaderAdmin />
      {/* Banner Section */}
      <div className="bg-secondary-normal px-6 py-4 md:py-20 lg:py-24">
        <div className="flex flex-col items-center justify-center text-center gap-1">
          <h1 className="text-xl font-bold text-white md:text-4xl lg:text-5xl">
            Your Staycation Spaces
          </h1>
          <p className="text-xs text-white md:text-lg lg:text-xl">
            Manage your perfect getaways in one place.
          </p>
        </div>
      </div>
      <div></div>
      <NavigationBottomAdmin />
    </div>
  );
}
