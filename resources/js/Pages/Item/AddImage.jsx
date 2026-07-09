import Breadcrumbs from "@/Components/Breadcrumb";
import DashboardLayout from "../DashboardLayout";
import { Head, useForm } from "@inertiajs/react";
import { useMemo, useState } from "react";
import {
  UploadCloud,
  ImagePlus,
  Trash2,
  X,
} from "lucide-react";

export default function AddImage({ item, breadcrumbs }) {
  const MAX_IMAGES = 5;
  const existingUploads = item.data.uploads || [];
  const remainingSlots = MAX_IMAGES - existingUploads.length;

  const { data, setData, post, processing, errors } = useForm({
    images: [],
  });

  const [previews, setPreviews] = useState([]);

  const handleSelectImages = (e) => {
    const files = Array.from(e.target.files);

    if (!files.length) return;

    const allowedCount = remainingSlots - data.images.length;
    const selectedFiles = files.slice(0, allowedCount);

    const newPreviews = selectedFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setPreviews((prev) => [...prev, ...newPreviews]);
    setData("images", [...data.images, ...selectedFiles]);

    e.target.value = "";
  };

  const removeImage = (index) => {
    const updatedImages = [...data.images];
    const updatedPreviews = [...previews];

    updatedImages.splice(index, 1);
    updatedPreviews.splice(index, 1);

    setData("images", updatedImages);
    setPreviews(updatedPreviews);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    post(route("item.image.store", item.data.id), {
      forceFormData: true,
      preserveScroll: true,
      onError: () => {
        toast.errors(errors);
      }
    });
  };

  return (
    <DashboardLayout>
      <Head title={`Add Images · ${item.data.item_name}`} />

      <div className="p-6 space-y-6 max-w-5xl">
        <Breadcrumbs breadcrumbs={breadcrumbs} />

        {/* Header */}
        <div>
          <h1 className="text-xl font-bold text-gray-800">
            Upload Item Images
          </h1>
          <p className="text-sm text-gray-500">
            You can upload up to {MAX_IMAGES} images per item.
            <br />
            <span className="font-medium">
              {remainingSlots} slots remaining
            </span>
          </p>
        </div>

        {/* Existing Images */}
        {existingUploads.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Existing Images
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {existingUploads.map((img, idx) => (
                <div
                  key={idx}
                  className="relative border rounded-lg overflow-hidden"
                >
                  <img
                    src={img.file_path}
                    alt=""
                    className="h-32 w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Form */}
        {remainingSlots > 0 && (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl border p-6 space-y-4"
          >
            {/* Upload Box */}
            <label className="flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-lg p-6 cursor-pointer hover:border-indigo-400 transition">
              <ImagePlus className="w-8 h-8 text-indigo-600" />
              <span className="text-sm text-gray-600">
                Select up to {remainingSlots} image(s)
              </span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleSelectImages}
                className="hidden"
              />
            </label>

            {/* Preview */}
            {previews.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Selected Images
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {previews.map((preview, index) => (
                    <div
                      key={index}
                      className="relative border rounded-lg overflow-hidden"
                    >
                      <img
                        src={preview.url}
                        alt=""
                        className="h-32 w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-white/90 rounded-full p-1 hover:bg-red-50"
                      >
                        <X className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={processing || data.images.length === 0}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition"
              >
                <UploadCloud className="w-4 h-4" />
                Upload Images
              </button>
            </div>
          </form>
        )}

        {/* Limit Reached */}
        {remainingSlots === 0 && (
          <div className="p-4 border rounded-lg bg-gray-50 text-sm text-gray-600">
            Maximum image limit reached for this item.
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
