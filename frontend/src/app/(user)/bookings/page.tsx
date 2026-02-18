import BookingsForm from "./components/BookingsForm";
import BookingsGuard from "./guard/BookingsGuard";

export default function Bookings() {
  return (
    <div>
      <BookingsGuard>
        <BookingsForm />
      </BookingsGuard>
    </div>
  );
}
