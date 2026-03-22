import BookingsForm from "./components/BookingsForm";
import BookingsGuard from "./guard/BookingsGuard";

export default function Bookings() {
  return (
    <div>
      <BookingsGuard>
        <div className="lg:flex lg:justify-center">
          <BookingsForm />
        </div>
      </BookingsGuard>
    </div>
  );
}
