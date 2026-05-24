import GreetUser from "../components/GreetUser";
import ProductList from "./components/ProductList";
import SearchUnit from "@/app/shared/components/search-unit/SearchUnit";

export default function UnitsPage() {
  return (
    <div className="px-[1.5rem] py-[2rem] ">
      <GreetUser />
      <div className="mt-[1.5rem] mb-[2.5rem]">
        <SearchUnit />
      </div>
      <div className="md:flex md:justify-center">
        <ProductList />
      </div>
    </div>
  );
}
