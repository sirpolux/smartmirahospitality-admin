import { Head, useForm } from "@inertiajs/react";

import toast from "react-hot-toast";
import {
  Banknote,
  User,
  Hash,
  ArrowLeft,
} from "lucide-react";
import DashboardLayout from "../DashboardLayout";
import Breadcrumbs from "@/Components/Breadcrumb";

export default function NewBank({ breadcrumbs }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    bank_name: "",
    account_name: "",
    account_number: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route("bank.store"), {
      onSuccess: () => {
        toast.success("Account successfully added.");
        reset();
      },
      onError: () => {
        toast.error("Something went wrong. Please check your input.");
      },
    });
  };


  return (
    <DashboardLayout>
      <Head title="Add New Bank Account" />
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <div className="p-8">
        <div className="border border-gray-200 rounded-lg  shadow-sm transition duration-200  p-6 max-w-3xl">
          {/* Header with Back Arrow */}
          {/* <div className="flex items-center gap-3 mb-6">
          <button
            onClick={goBack}
            className="flex  gap-4 text-gray-600 hover:text-green-500 transition"
          >
            <ArrowLeft className="w-6 h-6" />  <span className="text-lg md:text-xl font-semibold text-gray-800">
            Add New Bank Account
          </span>
          </button>
         
        </div> */}

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-6 bg-white p-6 rounded-xl h-auto  "
          >
            {/* Bank Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bank Name
              </label>
              <div className="relative">
                <Banknote className="absolute top-2.5 left-3 w-5 h-5 text-blue-500" />
                <input
                  type="text"
                  value={data.bank_name}
                  onChange={(e) => setData("bank_name", e.target.value)}
                  className="pl-10 w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="e.g., Access Bank"
                  required
                />
              </div>
              {errors.bank_name && (
                <p className="text-red-500 text-sm mt-1">{errors.bank_name}</p>
              )}
            </div>

            {/* Account Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Name
              </label>
              <div className="relative">
                <User className="absolute top-2.5 left-3 w-5 h-5 text-green-600" />
                <input
                  type="text"
                  value={data.account_name}
                  onChange={(e) => setData("account_name", e.target.value)}
                  className="pl-10 w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  placeholder="e.g., John Doe"
                  required
                />
              </div>
              {errors.account_name && (
                <p className="text-red-500 text-sm mt-1">{errors.account_name}</p>
              )}
            </div>

            {/* Account Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Number
              </label>
              <div className="relative">
                <Hash className="absolute top-2.5 left-3 w-5 h-5 text-purple-500" />
                <input
                  type="text"
                  value={data.account_number}
                  onChange={(e) => setData("account_number", e.target.value)}
                  className="pl-10 w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  placeholder="e.g., 1234567890"
                  required
                />
              </div>
              {errors.account_number && (
                <p className="text-red-500 text-sm mt-1">{errors.account_number}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={processing}
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {processing ? "Saving..." : "Save Bank Info"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
 