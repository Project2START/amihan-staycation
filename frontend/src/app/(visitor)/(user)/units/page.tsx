import GreetUser from "./components/GreetUser";
import UserProductList from "./components/UserProductList";

export default function Units() {
  return (
    <div className="px-[1rem] pt-[2.5rem] pb-[5rem] text-secondary-normal">
      <div>
        <GreetUser />
      </div>
      <div>
        <UserProductList />
      </div>
    </div>
  );
}
