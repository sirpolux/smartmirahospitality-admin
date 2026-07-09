import React from "react";
import { router, Link } from "@inertiajs/react";
import { ArrowLeft, Star, Banknote, Plus } from "lucide-react";
import toast from "react-hot-toast";
import DashboardLayout from "../DashboardLayout";
import Breadcrumbs from "@/Components/Breadcrumb";

export default function BankList({ bankList, breadcrumbs }) {
    const banks = bankList;

    const handleSetPrimary = (bank_id) => {
        router.post(
            route("bank.setup.primary"),
            { bank_id },
            {
                onSuccess: () => toast.success("Primary bank account updated successfully."),
                onError: () => toast.error("Failed to update primary account. Please try again."),
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
                        Bank Accounts
                    </h1>

                    {/* Add Bank Button — always visible */}
                    <Link
                        href={route("bank.create")}
                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-full shadow-md transition-all active:scale-95"
                    >
                        <Plus className="w-5 h-5" />
                        Add Bank
                    </Link>
                </div>

                {/* If Empty */}
                {banks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 border rounded-xl bg-gray-50 shadow-inner">
                        <Banknote className="w-14 h-14 text-gray-400 mb-3" />
                        <h2 className="text-lg font-semibold text-gray-700">
                            No Bank Accounts Found
                        </h2>
                        <p className="text-gray-500 mt-1 mb-5 text-sm text-center">
                            You haven’t added any bank accounts yet.
                            Add one to get started with transactions.
                        </p>

                        <Link
                            href={route("bank.create")}
                            className="px-5 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                        >
                            Add Bank Account
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4 max-h-[80vh] overflow-y-auto pb-16">
                        {banks.map((bank, index) => (
                            <div
                                key={index}
                                className={`relative p-5 border rounded-xl shadow-sm transition-all hover:shadow-lg hover:-translate-y-[1px] 
                                ${bank.primary_account ? "bg-emerald-50 border-emerald-500" : "bg-white"}`}
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-gray-700">
                                            <span className="font-semibold">Bank Name:</span> {bank.bank_name}
                                        </p>
                                        <p className="text-gray-700">
                                            <span className="font-semibold">Account Name:</span> {bank.account_name}
                                        </p>
                                        <p className="text-gray-700">
                                            <span className="font-semibold">Account Number:</span> {bank.account_number}
                                        </p>

                                        {bank.primary_account ? (
                                            <span className="inline-flex items-center mt-3 text-emerald-700 font-medium text-sm bg-emerald-100 px-3 py-1 rounded-full">
                                                <Star className="w-4 h-4 mr-1 fill-emerald-600" /> Primary Account
                                            </span>
                                        ) : (
                                            <button
                                                onClick={() => handleSetPrimary(bank.id)}
                                                className="mt-4 text-sm px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
                                            >
                                                Set as Primary
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Floating Add Button (Mobile + Desktop) */}
                <Link
                    href={route("bank.create")}
                    className="fixed bottom-6 right-6 bg-emerald-600 hover:bg-emerald-700 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-xl animate-bounceOnce transition-all active:scale-95"
                >
                    <Plus className="w-7 h-7" />
                </Link>
            </div>
        </DashboardLayout>
    );
}
