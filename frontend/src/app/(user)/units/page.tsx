import { Suspense } from "react";
import GreetUser from "../components/GreetUser";
import ProductList from "./components/ProductList";
import { Skeleton } from "@mui/material";
import BookingStatus from "./components/BookingStatus";

export default function UnitsPage() {
  return (
    <div className="px-[1.5rem] py-[2rem]">
      <BookingStatus />
      <GreetUser />
      <Suspense
        fallback={
          <div className="my-[1rem] grid gap-y-8">
            {Array.from({ length: 2 }).map((_, i) => (
              <div className="grid gap-y-5" key={i}>
                <Skeleton variant="rounded" animation="wave" height={200} />
                <Skeleton variant="rounded" animation="wave" height={30} />
                <Skeleton variant="rounded" animation="wave" height={60} />
              </div>
            ))}
          </div>
        }
      >
        <ProductList />
      </Suspense>
    </div>
  );
}
