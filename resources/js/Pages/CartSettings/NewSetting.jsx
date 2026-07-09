import { useForm } from "@inertiajs/react";
import toast from "react-hot-toast";
import {
  Banknote,
  User,
  Hash,
  ArrowLeft,
} from "lucide-react";
import Dashboard from "../Dashboard";
import DashboardLayout from "../DashboardLayout";

export default function NewSetting() {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: "",
    max: "",
    min: "",
    min_cost: "",
    max_cost: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route("settings.cart.save"), {
      onSuccess: () => {
        toast.success("Profile successfully added.");
        reset();
      },
      onError: () => {
        toast.error("Something went wrong. Please check your input.");
      },
    });
  };

  const goBack = () => window.history.back();

  return (
    <DashboardLayout>
      <div className="border border-gray-200 rounded-lg  shadow-sm transition duration-200  p-6 max-w-3xl">
        {/* Header with Back Arrow */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={goBack}
            className="flex  gap-4 text-gray-600 hover:text-green-500 transition"
          >
            <ArrowLeft className="w-6 h-6" />  <span className="text-lg md:text-xl font-semibold text-gray-800">
              Add New Cart Settings Profile
            </span>
          </button>

        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white p-6 rounded-xl h-auto  "
        >
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Settings Name <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <Banknote className="absolute top-2.5 left-3 w-5 h-5 text-blue-500" />
              <input
                type="text"
                value={data.name}
                onChange={(e) => setData("name", e.target.value)}
                className="pl-10 w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="e.g., Cart Limited"
                required
              />
            </div>
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Maximum Cart Item */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Maximum Cart Item
            </label>
            <div className="relative">
              <User className="absolute top-2.5 left-3 w-5 h-5 text-green-600" />
              <input
                type="number"
                value={data.max}
                onChange={(e) => setData("max", e.target.value)}
                className="pl-10 w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                // placeholder="e.g., John Doe"
                // required
              />
            </div>
            {errors.max && (
              <p className="text-red-500 text-sm mt-1">{errors.max}</p>
            )}
          </div>

          {/* Minimum Cart Item */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Cart Item <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <User className="absolute top-2.5 left-3 w-5 h-5 text-green-600" />
              <input
                type="number"
                value={data.min}
                onChange={(e) => setData("min", e.target.value)}
                className="pl-10 w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                // placeholder="e.g., John Doe"
                required
              />
            </div>
            {errors.min && (
              <p className="text-red-500 text-sm mt-1">{errors.min}</p>
            )}
          </div>
             {/* Minimun Total cost */}
             <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mininum Total cost 
            </label>
            <div className="relative">
              <User className="absolute top-2.5 left-3 w-5 h-5 text-green-600" />
              <input
                type="number"
                value={data.min_cost}
                onChange={(e) => setData("min_cost", e.target.value)}
                className="pl-10 w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                // required
              />
            </div>
            {errors.min_cost && (
              <p className="text-red-500 text-sm mt-1">{errors.min_cost}</p>
            )}
          </div>


          {/* Maximum Total Cost */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Maximum Total Cost <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <User className="absolute top-2.5 left-3 w-5 h-5 text-green-600" />
              <input
                type="number"
                value={data.max_cost}
                onChange={(e) => setData("max_cost", e.target.value)}
                className="pl-10 w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                // placeholder="e.g., John Doe"
                required
              />
            </div>
            {errors.max_cost && (
              <p className="text-red-500 text-sm mt-1">{errors.max_cost}</p>
            )}
          </div>

       
          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={processing}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {processing ? "Saving..." : "Save Settings Profile"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
