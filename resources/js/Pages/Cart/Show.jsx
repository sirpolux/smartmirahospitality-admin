import { Head, Link } from "@inertiajs/react";
import {
  ArrowLeftIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/outline";
import DashboardLayout from "../DashboardLayout";
import Breadcrumbs from "@/Components/Breadcrumb";

const statusStyles = {
  active: "bg-green-100 text-green-700",
  completed: "bg-blue-100 text-blue-700",
  cancelled: "bg-red-100 text-red-700",
};

const statusLabels = {
  active: "Active",
  completed: "Completed",
  cancelled: "Cancelled",
};

export default function Show({ cart, breadcrumbs }) {
  const data = cart?.data;

  if (!data) return null;

  const statusClass =
    statusStyles[data.status] || "bg-gray-100 text-gray-700";
  const customer = data.user || {};

  const formatCurrency = (value) =>
    "₦" + Number(value || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const location = [customer.details?.city, customer.details?.state]
    .filter(Boolean)
    .join(", ");

  return (
    <DashboardLayout>
      <Head title={`Cart #${data.id}`} />

      <div className="p-6 space-y-6">
        <Breadcrumbs breadcrumbs={breadcrumbs} />

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Cart #{data.id}
            </h1>
            <p className="text-sm text-gray-500">
              Created {formatDate(data.created_at)}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${statusClass}`}
            >
              {statusLabels[data.status] || data.status}
            </span>

            <Link
              href={route("cart.index")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Back to Carts
            </Link>
          </div>
        </div>

        {/* Customer & Contact */}
        <div className="bg-white rounded-xl border overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50">
            <h2 className="font-semibold text-gray-700">Customer & Contact</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-gray-100 rounded-full p-2">
                  <BuildingOfficeIcon className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium text-gray-800">
                    {customer.name || "Guest"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-gray-100 rounded-full p-2">
                  <EnvelopeIcon className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-800">
                    {customer.email || "—"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-gray-100 rounded-full p-2">
                  <PhoneIcon className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium text-gray-800">
                    {customer.details?.phone || "—"}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-gray-100 rounded-full p-2">
                  <BuildingOfficeIcon className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Company</p>
                  <p className="font-medium text-gray-800">
                    {customer.details?.company_name || "—"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-gray-100 rounded-full p-2">
                  <MapPinIcon className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium text-gray-800">
                    {customer.details?.address || "—"}
                  </p>
                  {location && (
                    <p className="text-sm text-gray-500">{location}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="bg-white rounded-xl border overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50">
            <h2 className="font-semibold text-gray-700">Items</h2>
          </div>

          {data.items && data.items.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-left text-gray-600 uppercase text-xs tracking-wider">
                    <th className="px-6 py-4">Item</th>
                    <th className="px-6 py-4 text-right">Quantity</th>
                    <th className="px-6 py-4 text-right">Unit Price</th>
                    <th className="px-6 py-4 text-right">Total</th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {data.items.map((line) => (
                    <tr key={line.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 font-medium text-gray-800">
                        {line.item?.item_name || "Unavailable"}
                      </td>
                      <td className="px-6 py-4 text-right text-gray-700">
                        {line.quantity}
                      </td>
                      <td className="px-6 py-4 text-right text-gray-700">
                        {formatCurrency(line.unit_price)}
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-gray-800">
                        {formatCurrency(line.total_price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">
              This cart has no items.
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg">
          <div className="bg-gray-50 rounded-xl border p-5">
            <p className="text-sm text-gray-500">Total Quantity</p>
            <p className="text-2xl font-semibold text-gray-800">
              {data.total_quantity}
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl border p-5">
            <p className="text-sm text-gray-500">Total Price</p>
            <p className="text-2xl font-semibold text-gray-800">
              {formatCurrency(data.total_price)}
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
