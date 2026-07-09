import { Head, Link } from "@inertiajs/react";
import {
  PencilSquareIcon,
  PlusIcon,
  CubeIcon,
  TagIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import DashboardLayout from "../DashboardLayout";
import Breadcrumbs from "@/Components/Breadcrumb";
import { Plus } from "lucide-react";


export default function Show({ item, auth, breadcrumbs }) {
  const data = item?.data;

  if (!data) return null;

  const statusColor =
    data.status === "OUT_OF_STOCK"
      ? "bg-red-100 text-red-700"
      : "bg-green-100 text-green-700";

  return (
    <DashboardLayout>
      <Head title={data.item_name} />

      <div className="p-6 space-y-6">
        <Breadcrumbs breadcrumbs={breadcrumbs} />

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold ">
              {data.item_name}
            </h2>
            <p className="text-sm text-gray-500">
              Manufacturer: {data.manufacturer || "N/A"}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <Link
              href={route("item.edit", data.id)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
            >
              <PencilSquareIcon className="w-4 h-4" />
              Edit Item
            </Link>

            <Link
              href={route("stock.create", data.id)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition"
            >
              <PlusIcon className="w-4 h-4" />
              Add Stock
            </Link>

            <Link
              href={route("item.feature.create", data.id)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
            >
              <TagIcon className="w-4 h-4" />
              Add Feature
            </Link>
          </div>
        </div>

        {/* Item Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white  rounded-xl border p-5">
            <div className="flex items-center gap-2 text-gray-500 mb-2">
              <CubeIcon className="w-5 h-5" />
              Quantity
            </div>
            <p className="text-2xl font-semibold text-gray-800 ">
              {data.quantity}
            </p>
          </div>

          <div className="bg-white rounded-xl border p-5">
            <div className="flex items-center gap-2 text-gray-500 mb-2">
              ₦ Price
            </div>
            <p className="text-2xl font-semibold text-gray-800 ">
              ₦{Number(data.price).toLocaleString()}
            </p>
          </div>

          <div className="bg-white  rounded-xl border p-5">
            <div className="text-gray-500 mb-2">Status</div>
            <span
              className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}
            >
              {data.status.replaceAll("_", " ")}
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white  rounded-xl border p-6">
          <h3 className="font-medium text-gray-700 mb-2">
            Description
          </h3>
          <p className="text-gray-600">
            {data.item_description || "No description provided."}
          </p>
        </div>

        
        {/* Images */}
{/* Images */}
<div className="bg-white rounded-xl border p-6">
  <div className="flex items-center justify-between mb-3">
    <h3 className="font-medium text-gray-700">Images</h3>

    {/* Add Images Button - Always Visible */}
    <Link
      href={route("item.image.add", data.id)}
      className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg shadow-sm transition-all duration-150 border border-emerald-700"
    >
      <Plus className="w-4 h-4" />
      Add Images
    </Link>
  </div>

  <div className="flex flex-wrap gap-4">
    {data?.uploads && data.uploads.length > 0 ? (
      data.uploads.map((img, index) => (
        <img
          key={index}
          src={img.file_path}
          alt={`Item Image ${index + 1}`}
          className="w-32 h-32 object-cover rounded-lg border shadow-sm"
        />
      ))
    ) : (
      <p className="text-gray-600">
        No images available for this item.
      </p>
    )}
  </div>
</div>


        {/* Features */}
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-700 ">
              Item Features
            </h3>

            <Link
              href={route("item.feature.create", data.id)}
              className="text-sm text-indigo-600 hover:underline"
            >
              Add / Edit Features
            </Link>
          </div>

          {data.features.length > 0 ? (
            <div className="divide-y">
              {data.features.map((feature) => (
                <div
                  key={feature.id}
                  className="py-3 flex justify-between items-start"
                >
                  <div>
                    <p className="font-medium text-gray-800">
                      {feature.feature_name}
                    </p>
                    {/* <p className="text-sm text-gray-500">
                      {feature.feature_description || "—"}
                    </p> */}
                  </div>
{/* 
                  <span className="text-sm font-semibold text-gray-700 ">
                    {feature.feature_value || "N/A"}
                  </span> */}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              No features added yet.
            </p>
          )}
        </div>

        {/* Meta */}
        <div className="bg-gray-50 rounded-xl border p-5 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <UserIcon className="w-4 h-4" />
            Created by {data.created_by?.name}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
