import { ArrowLeft } from "lucide-react";
import { router } from "@inertiajs/react";
import DashboardLayout from "../DashboardLayout";

export default function Details({ stock }) {
  const s = stock.data;
  const item = s.item_data;

  const handleBack = () => {
    router.visit("/stock");
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto bg-white shadow rounded-lg p-6">
        {/* Back button */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 mb-4 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={20} /> Back
        </button>

        <h1 className="text-xl font-bold mb-4">Stock Details</h1>

        {/* Book Cover + Info */}
        <div className="flex gap-6 mb-6">
          <img
            src={item.image_url}
            alt={item.title}
            className="w-40 h-56 object-cover rounded shadow"
          />
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">{item.title}</h2>
            <p>
              <strong>Author:</strong> {item.author}
            </p>
            <p>
              <strong>Category:</strong> {item.category}
            </p>
            <p>
              <strong>Publisher:</strong> {item.publisher}
            </p>
            <p>
              <strong>Language:</strong> {item.language}
            </p>
            <p>
              <strong>Format:</strong> {item.format}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span className="px-2 py-1 rounded bg-green-100 text-green-800">
                {item.status}
              </span>
            </p>
          </div>
        </div>

        {/* Prices + Quantity */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Item Price:</strong>{" "}
            <span className="text-green-700 font-semibold">
              {new Intl.NumberFormat("en-NG", {
                style: "currency",
                currency: "NGN",
              }).format(s.item_price)}
            </span>
          </div>
          <div>
            <strong>Book Price:</strong>{" "}
            <span className="text-blue-700 font-semibold">
              {new Intl.NumberFormat("en-NG", {
                style: "currency",
                currency: "NGN",
              }).format(item.price)}
            </span>
          </div>
          <div>
            <strong>Quantity in Stock:</strong> {s.quantity}
          </div>
          <div>
            <strong>Total Stock Available:</strong> {item.stock}
          </div>
        </div>

        {/* Extra Info */}
        <div className="mt-6">
          <p>
            <strong>Recorded By:</strong> {s.recorded_by.name} (
            {s.recorded_by.email})
          </p>
          <p>
            <strong>Created At:</strong>{" "}
            {new Date(s.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
