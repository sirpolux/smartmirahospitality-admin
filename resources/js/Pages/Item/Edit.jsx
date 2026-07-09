import { Head, useForm } from "@inertiajs/react";
import Breadcrumbs from "@/Components/Breadcrumb";
import DashboardLayout from "../DashboardLayout";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

export default function Edit({ item, breadcrumbs }) {
  const { data, setData, put, processing, errors } = useForm({
    item_name: item.data.item_name || "",
    item_description: item.data.item_description || "",
    price: item.data.price || "",
    manufacturer: item.data.manufacturer || "",
  });

  const submit = (e) => {
    e.preventDefault();

    put(route("item.update", item.data.id), {
        onSuccess:()=>{
            toast.success("Item updated successfully");
        }
    });
  };

  return (
    <DashboardLayout>
      <Head title={`Edit · ${item.data.item_name}`} />

      <div className="p-6 space-y-6 ">
        <Breadcrumbs breadcrumbs={breadcrumbs} />

        {/* Header */}
        <div>
          <h1 className="text-xl font-bold text-gray-800">
            Edit Item
          </h1>
          <p className="text-sm text-gray-500">
            Update editable details for{" "}
            <span className="font-medium">{item.data.item_name}</span>.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl border p-6">
          <form onSubmit={submit} className="space-y-5">
            {/* Item Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Item Name
              </label>
              <input
                type="text"
                value={data.item_name}
                onChange={(e) => setData("item_name", e.target.value)}
                className={`w-full rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500
                  ${
                    errors.item_name
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
              />
              {errors.item_name && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.item_name}
                </p>
              )}
            </div>

                        {/* Item Manufacturer */}
                        <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Item manufacturer
              </label>
              <input
                type="text"
                value={data.manufacturer}
                onChange={(e) => setData("manufacturer", e.target.value)}
                className={`w-full rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500
                  ${
                    errors.manufacturer
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
              />
              {errors.item_name && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.manufacturer}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                rows={4}
                value={data.item_description}
                onChange={(e) =>
                  setData("item_description", e.target.value)
                }
                className={`w-full rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500
                  ${
                    errors.item_description
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
              />
              {errors.item_description && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.item_description}
                </p>
              )}
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (₦)
              </label>
              <input
                type="number"
                value={data.price}
                onChange={(e) => setData("price", e.target.value)}
                className={`w-full rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500
                  ${
                    errors.price
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
              />
              {errors.price && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.price}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={processing}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <PencilSquareIcon className="w-4 h-4" />
                {processing ? "Updating..." : "Update Item"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
