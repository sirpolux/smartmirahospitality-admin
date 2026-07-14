import { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import {
  MagnifyingGlassIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import Pagination from "@/Components/Pagination";
import DashboardLayout from "../DashboardLayout";
import Breadcrumbs from "@/Components/Breadcrumb";

export default function Index({ categories, queryParams = {}, breadcrumbs }) {
  const [keyword, setKeyword] = useState(queryParams.keyword || "");

  const handleSearch = () => {
    const params = { ...queryParams };
    keyword ? (params.keyword = keyword) : delete params.keyword;
    router.get(route("item-category.index"), params, { preserveState: true });
  };

  const handleDelete = (id, name) => {
    if (!confirm(`Delete category "${name}"? This cannot be undone.`)) return;
    router.delete(route("item-category.destroy", id), {
      onSuccess: () => {
        // Controller redirects with flash message — handled by toast or page reload
      },
    });
  };

  return (
    <DashboardLayout>
      <Head title="Item Categories" />
      <Breadcrumbs breadcrumbs={breadcrumbs} />

      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Item Categories</h1>
            <p className="text-sm text-gray-500">
              Manage all inventory categories here. You can add, edit, or delete each category.
            </p>
          </div>

          <Link
            href={route("item-category.create")}
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded-lg shadow hover:bg-indigo-700 transition"
          >
            <PlusIcon className="w-5 h-5" />
            Add Category
          </Link>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 max-w-md">
          <div className="relative w-full">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by category name..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
        </div>

        {/* TABLE */}
        {categories.data && categories.data.length > 0 ? (
          <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr className="text-left text-gray-600 uppercase text-xs tracking-wider">
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {categories.data.map((category) => (
                    <tr
                      key={category.id}
                      className="hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4 text-gray-700 font-medium">
                        {category.name}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center gap-3">
                          <Link
                            href={route("item-category.edit", category.id)}
                            className="text-amber-500 hover:text-amber-700"
                            title="Edit"
                          >
                            <PencilSquareIcon className="w-5 h-5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(category.id, category.name)}
                            className="text-red-500 hover:text-red-700"
                            title="Delete"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
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
                links={categories.meta?.links}
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
              No item categories found
            </h2>
            <p className="mt-2 max-w-sm">
              Your category list is empty or your search returned no results.
            </p>
            <Link
              href={route("item-category.create")}
              className="mt-6 inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-lg shadow hover:bg-indigo-700 transition"
            >
              <PlusIcon className="w-5 h-5" />
              Add First Category
            </Link>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
