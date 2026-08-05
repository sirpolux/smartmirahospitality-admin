import { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import {
  ArrowLeftIcon,
  BuildingOfficeIcon,
  EnvelopeIcon,
  MapPinIcon,
  PhoneIcon,
  TruckIcon,
  CreditCardIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import DashboardLayout from "../DashboardLayout";
import Breadcrumbs from "@/Components/Breadcrumb";

const statusStyles = {
  pending: "bg-yellow-100 text-yellow-800",
  received: "bg-blue-100 text-blue-800",
  packaged: "bg-indigo-100 text-indigo-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const statusLabels = {
  pending: "Pending",
  received: "Received",
  packaged: "Packaged",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const transactionStatusStyles = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  failed: "bg-gray-100 text-gray-700",
  refunded: "bg-blue-100 text-blue-800",
};

export default function Show({ order, breadcrumbs }) {
  const data = order?.data;

  const [selectedStatus, setSelectedStatus] = useState(data?.status || "pending");

  if (!data) return null;

  const customer = data.user || {};
  const location = [customer.details?.city, customer.details?.state]
    .filter(Boolean)
    .join(", ");

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

  const handleStatusSave = (e) => {
    e.preventDefault();
    const isChanged = selectedStatus !== data.status;
    if (!isChanged) return;

    if (
      !confirm(
        `Update order #${data.id} status to "${statusLabels[selectedStatus] || selectedStatus}"?`
      )
    ) {
      return;
    }

    router.patch(route("order.status.update", data.id), {
      status: selectedStatus,
    }, {
      preserveScroll: true,
      onSuccess: () => toast.success("Order status updated"),
      onError: () => toast.error("Could not update order status"),
    });
  };

  return (
    <DashboardLayout>
      <Head title={`Order #${data.id}`} />
      <Breadcrumbs breadcrumbs={breadcrumbs} />

      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Order #{data.id}</h1>
            <p className="text-sm text-gray-500">
              Created {formatDate(data.created_at)}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                statusStyles[data.status] || statusStyles.pending
              }`}
            >
              {statusLabels[data.status] || data.status}
            </span>

            <Link
              href={route("order.index")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Back to Orders
            </Link>
          </div>
        </div>

        {/* Customer & Delivery */}
        <div className="bg-white rounded-xl border overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50">
            <h2 className="font-semibold text-gray-700">Customer & Delivery</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-gray-100 rounded-full p-2">
                  <BuildingOfficeIcon className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Customer</p>
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
                    {data.contact_number || customer.details?.phone || "—"}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-gray-100 rounded-full p-2">
                  <MapPinIcon className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Delivery Address</p>
                  <p className="font-medium text-gray-800">
                    {data.delivery_address || "—"}
                  </p>
                  {data.delivery_state && (
                    <p className="text-sm text-gray-500">{data.delivery_state}</p>
                  )}
                  {!data.delivery_state && location && (
                    <p className="text-sm text-gray-500">{location}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-gray-100 rounded-full p-2">
                  <TruckIcon className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Delivery Channel</p>
                  <p className="font-medium text-gray-800 uppercase">
                    {data.delivery_channel || "—"}
                  </p>
                </div>
              </div>

              {data.receipt_ref && (
                <div className="flex items-start gap-3">
                  <div className="bg-gray-100 rounded-full p-2">
                    <CreditCardIcon className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Receipt Ref</p>
                    <p className="font-medium text-gray-800">{data.receipt_ref}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Order Status Update */}
        <div className="bg-white rounded-xl border overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50">
            <h2 className="font-semibold text-gray-700">Order Status</h2>
          </div>
          <form
            onSubmit={handleStatusSave}
            className="flex flex-col md:flex-row md:items-end gap-4 p-6"
          >
            <div className="flex-1">
              <label className="block text-sm text-gray-500 mb-1">
                Update fulfilment status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                {Object.entries(statusLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={selectedStatus === data.status}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Status
            </button>
          </form>
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
            <div className="p-6 text-center text-gray-500">No items on this order.</div>
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

        {/* Transactions */}
        <div className="bg-white rounded-xl border overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50">
            <h2 className="font-semibold text-gray-700">Transactions</h2>
          </div>

          {data.transactions && data.transactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-left text-gray-600 uppercase text-xs tracking-wider">
                    <th className="px-6 py-4">Transaction</th>
                    <th className="px-6 py-4 text-right">Amount</th>
                    <th className="px-6 py-4">Purpose</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {data.transactions.map((txn) => (
                    <tr key={txn.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 font-medium text-gray-800">
                        #{txn.id}
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-gray-800">
                        {formatCurrency(txn.amount)}
                      </td>
                      <td className="px-6 py-4 capitalize text-gray-700">
                        {txn.purpose || "payment"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                            transactionStatusStyles[txn.status] || "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {txn.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {formatDate(txn.created_at)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={route("transactions.show", txn.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition font-medium"
                        >
                          View Transaction
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">
              No transactions linked to this order.
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
