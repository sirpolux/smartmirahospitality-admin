import React from "react";
import { router } from "@inertiajs/react";
import { ArrowLeft, Star } from "lucide-react";
import toast from "react-hot-toast";
import DashboardLayout from "../DashboardLayout";

export default function CartSettingList({ cartSettingList }) {
    

    const handleSetPrimary = (cart_settings_id) => {
        router.post(
            route("setup.primary.cart"),
            { cart_settings_id },
            {
                onSuccess: () => {
                    toast.success("Primary Cart Profile updated successfully.");
                },
                onError: () => {
                    toast.error("Failed to update primary Cart Profile. Please try again.");
                },
            }
        );
    };

    return (
        <DashboardLayout>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl font-semibold"> Cart settings profile</h1>
                <button
                    onClick={() => window.history.back()}
                    className="flex items-center text-sm text-gray-600 hover:underline"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back
                </button>
            </div>

            {cartSettingList.length === 0 ? (
                <p>No cart settings profile found.</p>
            ) : (
                <div className="space-y-4 max-h-[80vh] overflow-auto">
                    {cartSettingList.map((setting, index) => (
                        <div
                            key={index}
                            className={`p-4 border rounded-md shadow-sm ${
                                setting.active
                                    ? "bg-green-50 border-green-500"
                                    : "bg-white"
                            }`}
                        >
                            <p>
                                <strong>Settings Name: </strong> {setting.name}
                            </p>
                            <p>
                                <strong>Max item: </strong> {setting.max}
                            </p>
                            <p>
                                <strong>Min item: </strong> {setting.min}
                            </p>

                            <p>
                                <strong>Min Cost: </strong> {setting.min_cost}
                            </p>
                            <p>
                                <strong>Max Cost: </strong> {setting.max_cost}
                            </p>

                            {setting.active ? (
                                <span className="inline-flex items-center mt-2 text-green-600 font-medium text-sm">
                                    <Star className="w-4 h-4 mr-1" /> Active
                                </span>
                            ) : (
                                <button
                                    onClick={() => handleSetPrimary(setting.id)}
                                    className="mt-4 text-sm px-3 py-1 border border-gray-300 rounded hover:bg-gray-100"
                                >
                                    Set as Active Profile
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </DashboardLayout>
    );
}
