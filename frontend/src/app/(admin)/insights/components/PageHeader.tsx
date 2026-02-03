export default function PageHeader() {
  return (
    <div style={{ backgroundColor: "#0B5173" }} className="text-white px-6 py-10 shadow-lg">
      <div className="w-full flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-2 text-center">Your Staycation Insights</h1>
        <p className="text-blue-50 text-lg text-center">
          Track bookings, revenue, and guest trends to optimize every stay.
        </p>
      </div>
    </div>
  );
}
