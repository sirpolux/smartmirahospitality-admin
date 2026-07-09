import { Head, Link, useForm } from "@inertiajs/react";
import { MagnifyingGlassIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import Breadcrumbs from "@/Components/Breadcrumb";
import Pagination from "@/Components/Pagination";
import DashboardLayout from "../DashboardLayout";
import toast from "react-hot-toast";

export default function Index({ stocks, queryParams = {}, breadcrumbs }) {
  const { data, setData, get, processing } = useForm({
    keyword: queryParams.keyword || "",
    start_date: queryParams.start_date || "",
    end_date: queryParams.end_date || "",
    per_page: queryParams.per_page || 20,
  });

  const applyFilters = () => {
    get(route("stock.index"), {
      preserveState: true,
      replace: true,
    });
  };

  const exportCsv = () => {
    window.location.href = route("stock.export", {
      ...data,
    });
    toast.success("CSV export Completed");
  };

  return (
    <DashboardLayout>
      <Head title="Stock History" />
        <Breadcrumbs breadcrumbs={breadcrumbs} />

      <div className="p-6 space-y-6">
      

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              Stock History
            </h1>
            <p className="text-sm text-gray-500">
              View stock captured within a selected period.
            </p>
          </div>

          {/* Export */}
          <button
            onClick={exportCsv}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition"
          >
            <ArrowDownTrayIcon className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border p-4 grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <label className="text-xs font-medium text-gray-600">
              Search
            </label>
            <div className="relative">
              <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                value={data.keyword}
                onChange={(e) => setData("keyword", e.target.value)}
                placeholder="Item name..."
                className="w-full pl-9 pr-3 py-2 rounded-lg border text-sm focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Start Date */}
          <div>
            <label className="text-xs font-medium text-gray-600">
              Start Date
            </label>
            <input
              type="date"
              value={data.start_date}
              onChange={(e) => setData("start_date", e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="text-xs font-medium text-gray-600">
              End Date
            </label>
            <input
              type="date"
              value={data.end_date}
              onChange={(e) => setData("end_date", e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            />
          </div>

          {/* Per Page */}
          <div>
            <label className="text-xs font-medium text-gray-600">
              Per Page
            </label>
            <select
              value={data.per_page}
              onChange={(e) => setData("per_page", e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            >
              {[10, 20, 50, 100].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          {/* Apply */}
          <div className="md:col-span-5 flex justify-end">
          <Link 
          className="mr-4 px-5 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
            href={route('stock.create')}
            >Add Stock</Link>
            <button
              onClick={applyFilters}
              disabled={processing}
              className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition disabled:opacity-50"
            >
              Apply Filters
            </button>
           
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border overflow-hidden">
          {stocks.data.length > 0 ? (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-4 py-3 text-left">Item</th>
                  <th className="px-4 py-3 text-left">Quantity</th>
                  <th className="px-4 py-3 text-left">Price</th>
                  <th className="px-4 py-3 text-left">Added By</th>
                  <th className="px-4 py-3 text-left">Date Added</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {stocks.data.map((stock) => (
                  <tr key={stock.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {stock.item_name}
                    </td>
                    <td className="px-4 py-3">{stock.quantity}</td>
                    <td className="px-4 py-3">₦{stock.price}</td>
                    <td className="px-4 py-3">
                      {stock.added_by}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {stock.created_at}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-20 text-center text-gray-500">
              No stock records found for the selected criteria.
            </div>
          )}
        </div>

        {/* Pagination */}
        {stocks.links && (
          <div className="flex justify-center">
            <Pagination links={stocks.links} queryParams={data} />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
