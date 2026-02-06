import GuestProductList from "./components/GuestProductList";

export default function Units() {
  return (
    <div className="px-[1rem] pt-[2.5rem] pb-[5rem] text-secondary-normal">
      <div className="text-center">
        <h1>Welcome to Amihan Staycation</h1>
        <p className="text-sm mt-[0.5rem]">
          Pick the Perfect Spot for Your Getaway
        </p>
      </div>
      <div>
        <GuestProductList />
      </div>
    </div>
  );
}
