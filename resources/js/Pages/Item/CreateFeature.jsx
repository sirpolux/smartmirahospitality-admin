import { Head, useForm } from "@inertiajs/react";
import { PlusIcon, ListBulletIcon } from "@heroicons/react/24/outline";
import { useMemo } from "react";
import Breadcrumbs from "@/Components/Breadcrumb";
import DashboardLayout from "../DashboardLayout";

export default function CreateFeature({ item, breadcrumbs }) {
  const existingFeatures = useMemo(() => {
    if (!item?.data?.features?.length) return "";

    return item.data.features
      .map(
        (f) =>
          `${f.feature_name}${
            f.feature_value ? `: ${f.feature_value}` : ""
          }`
      )
      .join("\n");
  }, [item]);

  const { data, setData, post, processing, errors } = useForm({
    features: existingFeatures,
    item_id: item.data.id,
  });

  const submit = (e) => {
    e.preventDefault();

    post(route("item.feature.store", item.data.id));
  };

  return (
    <DashboardLayout>
      <Head title={`Features · ${item.data.item_name}`} />

      <div className="p-6 space-y-6 ">
        <Breadcrumbs breadcrumbs={breadcrumbs} />

        {/* Header */}
        <div>
          <h1 className="text-xl font-bold text-gray-800">
            Item Features
          </h1>
          <p className="text-sm text-gray-500">
            Add or update features for{" "}
            <span className="font-medium">{item.data.item_name}</span>. Each
            line will be saved as a feature.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl border p-6">
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <ListBulletIcon className="w-4 h-4" />
                Features (one per line)
              </label>

              <textarea
                rows={8}
                value={data.features}
                onChange={(e) => setData("features", e.target.value)}
                placeholder={`• 6.8-inch AMOLED Display
• 128GB Storage
• Dual SIM Support
• Fast Charging`}
                className={`w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500
                  ${
                    errors.features
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
              />

              {errors.features && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.features}
                </p>
              )}

              <p className="mt-2 text-xs text-gray-500">
                Tip: Each line becomes a feature. Existing features are editable.
              </p>
            </div>

            {/* Actions */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={processing}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <PlusIcon className="w-4 h-4" />
                {processing ? "Saving..." : "Save Features"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
