import { Head, Link, router } from "@inertiajs/react";
import { FaArrowLeft, FaCheck, FaTimes, FaUndo, FaBan } from "react-icons/fa";
import toast from "react-hot-toast";
import DashboardLayout from "../DashboardLayout";
import Breadcrumbs from "@/Components/Breadcrumb";

const statusStyles = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  failed: "bg-gray-100 text-gray-700",
  refunded: "bg-blue-100 text-blue-800",
};

export default function Show({ transaction, breadcrumbs }) {
  const txn = transaction?.data;

  if (!txn) return null;

  const order = txn.order?.data || txn.order || null;
  const customer = txn.user || {};
  const uploads = txn.uploads || [];

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

  const updateStatus = (status) => {
    if (!confirm(`Update transaction #${txn.id} status to "${status}"?`)) return;

    router.patch(
      route("transactions.status.update", txn.id),
      { status },
      {
        preserveScroll: true,
        onSuccess: () => toast.success(`Transaction marked as ${status}`),
        onError: () => toast.error("Could not update transaction status"),
      }
    );
  };

  return (
    <DashboardLayout>
      <Head title={`Transaction #${txn.id}`} />
      <Breadcrumbs breadcrumbs={breadcrumbs} />

      <div className="p-6 space-y-6">
        {/* Back */}
        <Link
          href={route("transactions.index")}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <FaArrowLeft />
          Back to Transactions
        </Link>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Transaction #{txn.id}
            </h1>
            <p className="text-sm text-gray-500">
              Created {formatDate(txn.created_at)}
            </p>
          </div>

          <span
            className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
              statusStyles[txn.status] || "bg-gray-100 text-gray-700"
            }`}
          >
            {txn.status}
          </span>
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Payment Info */}
          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-semibold text-gray-700 mb-4">Payment Details</h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Amount</span>
                <span className="font-semibold text-gray-800">
                  {formatCurrency(txn.amount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Purpose</span>
                <span className="capitalize text-gray-800">
                  {txn.purpose || "payment"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Description</span>
                <span className="text-right text-gray-800">
                  {txn.description || "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Customer</span>
                <span className="text-right text-gray-800">
                  {customer.name || "Guest"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Email</span>
                <span className="text-right text-gray-800">
                  {customer.email || "—"}
                </span>
              </div>
            </div>
          </div>

          {/* Order Info */}
          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-semibold text-gray-700 mb-4">Order Summary</h3>

            {order ? (
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Order ID</span>
                  <Link
                    href={route("order.show", order.id)}
                    className="font-semibold text-indigo-600 hover:underline"
                  >
                    #{order.id}
                  </Link>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Order Status</span>
                  <span className="capitalize text-gray-800">
                    {order.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Total Price</span>
                  <span className="font-semibold text-gray-800">
                    {formatCurrency(order.total_price)}
                  </span>
                </div>
                {order.receipt_ref && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Receipt Ref</span>
                    <span className="text-gray-800">{order.receipt_ref}</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No order linked.</p>
            )}

            {txn.confirmed_by && (
              <div className="mt-6 pt-4 border-t text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Confirmed By</span>
                  <span className="text-gray-800">
                    {txn.confirmed_by?.name || txn.confirmed_by}
                  </span>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-gray-500">Confirmed At</span>
                  <span className="text-gray-800">
                    {formatDate(txn.confirmed_at)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Evidence */}
        {uploads.length > 0 && (
          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-semibold text-gray-700 mb-4">
              Payment Evidence
            </h3>

            <div className="flex flex-wrap gap-4">
              {uploads.map((upload) => (
                <a
                  key={upload.id}
                  href={upload.file_path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border rounded-lg overflow-hidden hover:shadow-md transition"
                >
                  <img
                    src={upload.file_path}
                    alt={`Payment evidence ${upload.id}`}
                    className="w-40 h-40 object-cover"
                  />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-3 justify-end">
          {txn.status !== "pending" && (
            <button
              onClick={() => updateStatus("pending")}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition"
            >
              <FaUndo />
              Reset to Pending
            </button>
          )}

          <button
            onClick={() => updateStatus("rejected")}
            disabled={txn.status === "rejected"}
            className="inline-flex items-center gap-2 px-4 py-2 border border-red-500 text-red-600 rounded-lg hover:bg-red-50 transition disabled:opacity-50"
          >
            <FaTimes />
            Reject
          </button>

          <button
            onClick={() => updateStatus("failed")}
            disabled={txn.status === "failed"}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-400 text-gray-700 rounded-lg hover:bg-gray-100 transition disabled:opacity-50"
          >
            <FaBan />
            Mark Failed
          </button>

          <button
            onClick={() => updateStatus("refunded")}
            disabled={txn.status === "refunded"}
            className="inline-flex items-center gap-2 px-4 py-2 border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition disabled:opacity-50"
          >
            <FaUndo />
            Refund
          </button>

          <button
            onClick={() => updateStatus("confirmed")}
            disabled={txn.status === "confirmed"}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
          >
            <FaCheck />
            Confirm Payment
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
