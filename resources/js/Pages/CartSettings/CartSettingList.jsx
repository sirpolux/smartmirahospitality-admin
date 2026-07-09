import React from "react";
import { router, Link } from "@inertiajs/react";
import { Star, Settings, Plus } from "lucide-react";
import toast from "react-hot-toast";
import DashboardLayout from "../DashboardLayout";
import Breadcrumbs from "@/Components/Breadcrumb";

export default function CartSettingList({ cartSettingList, breadcrumbs }) {

    const handleSetPrimary = (cart_settings_id) => {
        router.post(
            route("setup.primary.cart"),
            { cart_settings_id },
            {
                onSuccess: () => toast.success("Primary Cart Profile updated successfully."),
                onError: () => toast.error("Failed to update primary Cart Profile. Please try again."),
            }
        );
    };

    return (
        <DashboardLayout>
            <Breadcrumbs breadcrumbs={breadcrumbs} />

            <div className="p-6 relative">

                {/* Header */}
                <div className="flex items-center justify-between mb-6 sticky top-0 bg-white z-10 py-2">
                    <h1 className="text-xl font-semibold text-gray-800">
                        Cart Settings
                    </h1>

                    {/* Always visible create button */}
                    <Link
                        href={route("settings.cart.add")}
                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-full shadow-md transition-all active:scale-95"
                    >
                        <Plus className="w-5 h-5" />
                        Create
                    </Link>
                </div>

                {/* Empty State */}
                {cartSettingList.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 border rounded-xl bg-gray-50 shadow-inner">
                        <Settings className="w-14 h-14 text-gray-400 mb-3" />
                        <h2 className="text-lg font-semibold text-gray-700">
                            No Cart Settings Found
                        </h2>
                        <p className="text-gray-500 mt-1 mb-5 text-sm text-center">
                            Create a cart configuration to get started.
                        </p>

                        <Link
                            href={route("settings.cart.add")}
                            className="px-5 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                        >
                            Create Cart Setting
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4 max-h-[80vh] overflow-y-auto pb-16">
                        {cartSettingList.map((setting, index) => (
                            <div
                                key={index}
                                className={`relative p-5 border rounded-xl shadow-sm transition-all hover:shadow-lg 
                                ${setting.active ? "bg-emerald-50 border-emerald-500" : "bg-white"}`}
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-gray-800">
                                            <span className="font-semibold">Settings Name:</span> {setting.name}
                                        </p>
                                        <p className="text-gray-800">
                                            <span className="font-semibold">Max Item:</span> {setting.max}
                                        </p>
                                        <p className="text-gray-800">
                                            <span className="font-semibold">Min Item:</span> {setting.min}
                                        </p>
                                        <p className="text-gray-800">
                                            <span className="font-semibold">Min Cost:</span> ₦{setting.min_cost}
                                        </p>
                                        <p className="text-gray-800">
                                            <span className="font-semibold">Max Cost:</span> ₦{setting.max_cost}
                                        </p>

                                        {setting.active ? (
                                            <span className="inline-flex items-center mt-3 text-emerald-700 font-medium text-sm bg-emerald-100 px-3 py-1 rounded-full">
                                                <Star className="w-4 h-4 mr-1 fill-emerald-600" />
                                                Active Profile
                                            </span>
                                        ) : (
                                            <button
                                                onClick={() => handleSetPrimary(setting.id)}
                                                className="mt-4 text-sm px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
                                            >
                                                Set as Active
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Floating Create Button */}
                <Link
                    href={route("settings.cart.add")}
                    className="fixed bottom-6 right-6 bg-emerald-600 hover:bg-emerald-700 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all active:scale-95"
                >
                    <Plus className="w-7 h-7" />
                </Link>
            </div>
        </DashboardLayout>
    );
}
