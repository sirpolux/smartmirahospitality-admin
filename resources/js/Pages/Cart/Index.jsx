import { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import {
  EyeIcon,
  MagnifyingGlassIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/solid";
import Pagination from "@/Components/Pagination";
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

export default function Index({ carts, queryParams = {}, breadcrumbs }) {
  const [keyword, setKeyword] = useState(queryParams.keyword || "");

  const handleSearch = () => {
    const params = { ...queryParams };
    keyword ? (params.keyword = keyword) : delete params.keyword;
    router.get(route("cart.index"), params, { preserveState: true });
  };

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
    });
  };

  return (
    <DashboardLayout>
      <Head title="Carts" />
      <Breadcrumbs breadcrumbs={breadcrumbs} />

      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Carts</h1>
            <p className="text-sm text-gray-500">
              Review customer carts for information and contact purposes. This
              view is read-only.
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 max-w-md">
          <div className="relative w-full">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by customer name or email..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
        </div>

        {/* TABLE */}
        {carts.data && carts.data.length > 0 ? (
          <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr className="text-left text-gray-600 uppercase text-xs tracking-wider">
                    <th className="px-6 py-4">Cart #</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4 text-right">Total Qty</th>
                    <th className="px-6 py-4 text-right">Total</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Created</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {carts.data.map((cart) => {
                    const statusClass =
                      statusStyles[cart.status] || "bg-gray-100 text-gray-700";

                    return (
                      <tr key={cart.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 text-gray-700 font-medium">
                          #{cart.id}
                        </td>

                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-800">
                            {cart.user?.name || "Guest"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {cart.user?.email || "—"}
                          </div>
                        </td>

                        <td className="px-6 py-4 text-right text-gray-700">
                          {cart.total_quantity}
                        </td>

                        <td className="px-6 py-4 text-right font-medium text-gray-800">
                          {formatCurrency(cart.total_price)}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${statusClass}`}
                          >
                            {statusLabels[cart.status] || cart.status}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-gray-500">
                          {formatDate(cart.created_at)}
                        </td>

                        <td className="px-6 py-4 text-right">
                          <Link
                            href={route("cart.show", cart.id)}
                            className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium"
                            title="View cart"
                          >
                            <EyeIcon className="w-5 h-5" />
                            View
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t bg-gray-50">
              <Pagination
                links={carts.meta?.links}
                queryParams={queryParams}
              />
            </div>
          </div>
        ) : (
          /* EMPTY STATE */
          <div className="flex flex-col items-center justify-center py-24 text-center text-gray-500">
            <div className="bg-gray-100 p-6 rounded-full mb-4">
              <ShoppingCartIcon className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-700">
              No carts found
            </h2>
            <p className="mt-2 max-w-sm">
              There are no carts to display, or your search returned no results.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
