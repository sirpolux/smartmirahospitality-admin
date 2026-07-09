import { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import {
  MagnifyingGlassIcon,
  EyeIcon,
  PencilSquareIcon,
  PlusIcon,
  CubeIcon,
} from "@heroicons/react/24/solid";
import Pagination from "@/Components/Pagination";
import DashboardLayout from "../DashboardLayout";
import Breadcrumbs from "@/Components/Breadcrumb";

export default function Index({ items, queryParams = {}, breadcrumbs }) {
  const [keyword, setKeyword] = useState(queryParams.keyword || "");

  const handleSearch = () => {
    const params = { ...queryParams };
    keyword ? (params.keyword = keyword) : delete params.keyword;
    router.get(route("item.index"), params, { preserveState: true });
  };

  const statusBadge = (status) => {
    switch (status) {
      case "IN_STOCK":
        return "bg-green-100 text-green-700";
      case "OUT_OF_STOCK":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const quantityColor = (qty) => {
    if (qty <= 0) return "text-red-600";
    if (qty < 5) return "text-amber-500";
    return "text-green-600";
  };

  return (
    <DashboardLayout>
      <Head title="Inventory Items" />
      <Breadcrumbs breadcrumbs={breadcrumbs} />


      <div className="p-6 space-y-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Inventory</h1>
            <p className="text-sm text-gray-500">
              Manage all store items and stock levels
            </p>
          </div>

          <Link
            href={route("item.create")}
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded-lg shadow hover:bg-indigo-700 transition"
          >
            <PlusIcon className="w-5 h-5" />
            Add Item
          </Link>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 max-w-md">
          <div className="relative w-full">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by item name or manufacturer..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
        </div>

        {/* TABLE */}
        {items.data.length > 0 ? (
          <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr className="text-left text-gray-600 uppercase text-xs tracking-wider">
                    <th className="px-6 py-4">Item</th>
                    <th className="px-6 py-4">Manufacturer</th>
                    <th className="px-6 py-4">Quantity</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {items.data.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50 transition"
                    >
                      {/* Item */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-indigo-50">
                            {item.uploads.length > 0 ? (
                              <img
                                src={item.uploads[0].file_path}
                                alt={item.item_name}
                                className="w-10 h-10 object-contain rounded"
                              />
                            ) : (
                              <CubeIcon className="w-5 h-5 text-indigo-600" />
                            )
                            }

                          </div>
                          <div>
                            <p className="font-medium text-gray-800">
                              {item.item_name}
                            </p>
                            <div className="h-4 overflow-clip">
                              <p className="text-xs text-gray-500">
                                {item.item_description}
                              </p>
                            </div>

                          </div>
                        </div>
                      </td>

                      {/* Manufacturer */}
                      <td className="px-6 py-4 text-gray-700">
                        {item.manufacturer}
                      </td>

                      {/* Quantity */}
                      <td
                        className={`px-6 py-4 font-semibold ${quantityColor(
                          item.quantity
                        )}`}
                      >
                        {item.quantity}
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4 text-gray-700">
                        ₦{Number(item.price).toLocaleString()}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge(
                            item.status
                          )}`}
                        >
                          {item.status.replace("_", " ")}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center gap-3">
                          <Link
                            href={route("item.show", item.id)}
                            className="text-indigo-600 hover:text-indigo-800"
                          >
                            <EyeIcon className="w-5 h-5" />
                          </Link>
                          <Link
                            href={route("item.edit", item.id)}
                            className="text-amber-500 hover:text-amber-700"
                          >
                            <PencilSquareIcon className="w-5 h-5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t bg-gray-50">
              <Pagination
                links={items.meta.links}
                queryParams={queryParams}
              />
            </div>
          </div>
        ) : (
          /* EMPTY STATE */
          <div className="flex flex-col items-center justify-center py-24 text-center text-gray-500">
            <div className="bg-gray-100 p-6 rounded-full mb-4">
              <MagnifyingGlassIcon className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-700">
              No inventory items found
            </h2>
            <p className="mt-2 max-w-sm">
              Your inventory is empty or your search returned no results.
            </p>
            <Link
              href={route("item.create")}
              className="mt-6 inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-lg shadow hover:bg-indigo-700 transition"
            >
              <PlusIcon className="w-5 h-5" />
              Add First Item
            </Link>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
