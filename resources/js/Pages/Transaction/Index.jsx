import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import DashboardLayout from "../DashboardLayout";
import Breadcrumbs from "@/Components/Breadcrumb";
import Pagination from "@/Components/Pagination";
import { Eye, Search } from "lucide-react";

const statusStyles = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  failed: "bg-gray-100 text-gray-700",
  refunded: "bg-blue-100 text-blue-800",
};

export default function Index({
  transactions,
  filters = {},
  queryParams = {},
  breadcrumbs,
}) {
  const [search, setSearch] = useState(filters.keyword ?? "");
  const [status, setStatus] = useState(filters.status ?? "");

  const applyFilters = (nextStatus = status) => {
    router.get(
      route("transactions.index"),
      {
        keyword: search,
        status: nextStatus,
      },
      {
        preserveState: true,
        preserveScroll: true,
        replace: true,
      }
    );
  };

  const formatCurrency = (value) =>
    "₦" + Number(value || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <DashboardLayout>
      <Head title="Transactions" />
      <Breadcrumbs breadcrumbs={breadcrumbs} />

      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-gray-800">Transactions</h1>
          <p className="text-gray-500">
            Review payments, verify evidence, and confirm transactions.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl border flex flex-wrap gap-3 items-end">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search customer or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applyFilters()}
              className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm w-72 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              applyFilters(e.target.value);
            }}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="rejected">Rejected</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>

          <button
            onClick={() => applyFilters()}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition"
          >
            Apply
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left text-gray-600 uppercase text-xs tracking-wider">
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Order</th>
                  <th className="px-6 py-4">Purpose</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {transactions.data.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-10 text-center text-gray-500"
                    >
                      No transactions found.
                    </td>
                  </tr>
                ) : (
                  transactions.data.map((txn) => (
                    <tr key={txn.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-800">
                          {txn.user?.name || "Guest"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {txn.user?.email}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        {txn.order ? (
                          <>
                            <div className="font-medium text-gray-800">
                              #{txn.order.id}
                            </div>
                            <div className="text-xs capitalize text-gray-500">
                              {txn.order.status}
                            </div>
                          </>
                        ) : (
                          <span className="text-xs italic text-gray-400">
                            No order
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 capitalize text-gray-700">
                        {txn.purpose || "payment"}
                      </td>

                      <td className="px-6 py-4 text-right font-medium text-gray-800">
                        {formatCurrency(txn.amount)}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                            statusStyles[txn.status] || "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {txn.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-gray-500">
                        {new Date(txn.created_at).toLocaleDateString()}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <Link
                          href={route("transactions.show", txn.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition font-medium"
                        >
                          <Eye size={14} />
                          Review
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t bg-gray-50">
            <Pagination links={transactions.meta?.links} queryParams={queryParams} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
