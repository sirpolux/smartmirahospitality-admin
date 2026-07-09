import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import DashboardLayout from "../DashboardLayout";
import Breadcrumbs from "@/Components/Breadcrumb";
import toast from "react-hot-toast";

export default function Show({ breadcrumbs }) {
    const { saving } = usePage().props;
    const data = saving.data;

    /* =============================
     * Transaction Status Form
     * ============================= */
    const transactionForm = useForm({
        transaction_id: null,
        action: null,
    });

    const updateTransactionStatus = (transactionId, action) => {
        transactionForm
            .transform(() => ({
                transaction_id: transactionId,
                action,
            }))
            transactionForm.post(route("savings.transaction.update", transactionId), {
                preserveScroll: true,
                onSuccess: () => {  
                    toast.success('Savings transaction sucessfully confirmed');
                }
            });
    };

    /* =============================
     * Complete Saving Form
     * ============================= */
    const completeSavingForm = useForm({
        saving_id: data.id,
    });

    const markSavingCompleted = () => {
        completeSavingForm
            .transform(() => ({
                saving_id: data.id,
            }))
            .post(route("savings.completed"), {
                preserveScroll: true,
            });
    };

    const transactionStatusStyle = {
        PENDING: "bg-yellow-100 text-yellow-800",
        ACCEPTED: "bg-green-100 text-green-800",
        REJECTED: "bg-red-100 text-red-800",
    };

    return (
        <DashboardLayout>
            <Head title={`Saving • ${data.saving_reference}`} />
            <Breadcrumbs breadcrumbs={breadcrumbs} />

            <div className="max-w-7xl mx-auto p-6 space-y-8">

                {/* ================= SAVING SUMMARY ================= */}
                <div className="bg-white rounded-xl shadow p-6 grid md:grid-cols-4 gap-6">
                    <div>
                        <p className="text-xs text-gray-500">Saving Reference</p>
                        <p className="font-mono text-xs font-semibold overflow-hidden">{data.saving_reference}</p>
                    </div>

                    <div>
                        <p className="text-xs text-gray-500">Customer</p>
                        <p className="font-medium text-sm">{data.user.name}</p>
                        <p className="text-xs text-gray-500">{data.user.email}</p>
                    </div>

                    <div>
                        <p className="text-xs text-gray-500">Target</p>
                        <p className="font-semibold text-sm">
                            ₦{Number(data.total).toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500 ">
                            Saved: ₦{Number(data.amount_saved).toLocaleString()}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs text-gray-500">Balance</p>
                        <p className="font-semibold text-sm">
                            ₦{Number(data.balance).toLocaleString()}
                        </p>

                        <div className="flex items-center gap-2 mt-2">
                            <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                                {data.status}
                            </span>

                            {data.status !== "completed" && (
                                <button
                                    onClick={markSavingCompleted}
                                    disabled={completeSavingForm.processing}
                                    className="text-xs px-3 py-1 rounded bg-black text-white hover:bg-gray-800"
                                >
                                    Mark Completed
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* ================= ORDER INFO ================= */}
                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="font-semibold text-lg mb-4">Order Information</h2>

                    <div className="grid md:grid-cols-3 gap-6 text-sm">
                        <div>
                            <p className="text-gray-500 text-xs">Order ID</p>
                            <p className="font-medium">#{data.order.id}</p>
                        </div>

                        <div>
                            <p className="text-gray-500 text-xs">Delivery Channel</p>
                            <p className="font-medium">{data.order.delivery_channel}</p>
                        </div>

                        <div>
                            <p className="text-gray-500 text-xs">Delivery By</p>
                            <p className="font-medium">{data.order.delivered_by ?? "—"}</p>
                        </div>

                        <div>
                            <p className="text-gray-500 text-xs">Contact</p>
                            <p className="font-medium">{data.order.contact_number}</p>
                        </div>

                        <div className="md:col-span-2">
                            <p className="text-gray-500 text-xs">Delivery Address</p>
                            <p className="font-medium">{data.order.delivery_address}</p>
                        </div>
                    </div>
                </div>

                {/* ================= CART ITEMS ================= */}
                <div className="bg-white rounded-xl shadow p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-semibold text-lg">Cart Items</h2>
                        <span className="text-sm text-gray-500">
                            {data.order.cart.item_count} items • ₦
                            {Number(data.order.cart.total_cost).toLocaleString()}
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-50 text-gray-600">
                                <tr>
                                    <th className="px-4 py-2 text-left">Item</th>
                                    <th className="px-4 py-2 text-left">Qty</th>
                                    <th className="px-4 py-2 text-left">Unit Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.order.cart.cart_items.map((ci) => (
                                    <tr key={ci.id} className="border-t">
                                        <td className="px-4 py-2 font-medium">
                                            {ci.item.item_name}
                                        </td>
                                        <td className="px-4 py-2">{ci.quantity}</td>
                                        <td className="px-4 py-2">
                                            ₦{Number(ci.item.price).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ================= TRANSACTIONS ================= */}
                <div className="bg-white rounded-xl shadow">
                    <div className="p-5 border-b">
                        <h2 className="font-semibold text-lg">Transactions</h2>
                        <p className="text-sm text-gray-500">
                            Verify incoming payments
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-[1100px] w-full text-sm">
                            <thead className="bg-gray-50 text-gray-600">
                                <tr>
                                    <th className="px-4 py-3">ID</th>
                                    <th className="px-4 py-3">Amount</th>
                                    <th className="px-4 py-3">Channel</th>
                                    <th className="px-4 py-3">Sender</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Evidence</th>
                                    <th className="px-4 py-3">Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {data.transactions.map((t) => (
                                    <tr key={t.id} className="border-t">
                                        <td className="px-4 py-3 font-mono text-xs">
                                            #{t.id}
                                        </td>

                                        <td className="px-4 py-3 font-semibold">
                                            ₦{Number(t.amount).toLocaleString()}
                                        </td>

                                        <td className="px-4 py-3 capitalize">
                                            {t.transaction_channel}
                                        </td>

                                        <td className="px-4 py-3">
                                            <div>{t.sender_account_name}</div>
                                            <div className="text-xs text-gray-500">
                                                {t.sender_bank}
                                            </div>
                                        </td>

                                        <td className="px-4 py-3">
                                            <span
                                                className={`px-2 py-1 rounded text-xs ${
                                                    transactionStatusStyle[t.transaction_status]
                                                }`}
                                            >
                                                {t.transaction_status}
                                            </span>
                                        </td>

                                        <td className="px-4 py-3">
                                            <a
                                                href={t.evidence_of_payment}
                                                target="_blank"
                                                className="text-blue-600 text-xs hover:underline"
                                            >
                                                View
                                            </a>
                                        </td>

                                        <td className="px-4 py-3">
                                            {t.transaction_status === "PENDING" ? (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() =>
                                                            updateTransactionStatus(t.id, "accept")
                                                        }
                                                        className="px-3 py-1 text-xs rounded bg-green-600 text-white"
                                                    >
                                                        Accept
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            updateTransactionStatus(t.id, "reject")
                                                        }
                                                        className="px-3 py-1 text-xs rounded bg-red-600 text-white"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-gray-400">—</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
