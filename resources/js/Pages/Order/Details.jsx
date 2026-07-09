import { useState } from "react";
import { Head, router, useForm } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import DashboardLayout from "../DashboardLayout";

export default function Details({ order, stock = [], breadcrumbs }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [currentAction, setCurrentAction] = useState(null);

    const { data, setData, post, processing } = useForm({
        action: "",
        message: "",
        order_id: order.data.id,
    });

    const { cart, status } = order.data;

    const statusColors = {
        APPROVED: "bg-green-100 text-green-700",
        PENDING_PAYMENT: "bg-yellow-100 text-yellow-700",
        PROCESSING: "bg-blue-100 text-blue-700",
        CANCELED: "bg-red-100 text-red-700",
        default: "bg-gray-100 text-gray-700",
    };

    
    const openActionModal = (label, action) => {
        setCurrentAction(label);
        setData("action", action);
        setModalOpen(true);
    };

    const submitAction = (e) => {
        e.preventDefault();
        post(route("order.perform.operation"), {
            onSuccess: () => {
                toast.success("Order updated successfully");
                setModalOpen(false);
            },
            onError: () => toast.error("Something went wrong"),
        });
    };

    return (
        <DashboardLayout>
            <Head title="Order Details" />

            {/* Back */}
            <button
                onClick={() => router.visit("/order")}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
            >
                <ArrowLeft size={18} /> Back to Orders
            </button>

            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Order #{order.data.id}</h2>
                    <span className={`px-3 py-1 rounded-full text-sm ${statusColors[status] || statusColors.default}`}>
                        {status.replaceAll("_", " ")}
                    </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                        <p className="text-gray-500">Customer</p>
                        <p className="font-medium">{cart.user.name}</p>
                    </div>
                    <div>
                        <p className="text-gray-500">Email</p>
                        <p className="font-medium">{cart.user.email}</p>
                    </div>
                    <div>
                        <p className="text-gray-500">Items</p>
                        <p className="font-medium">{cart.item_count}</p>
                    </div>
                    <div>
                        <p className="text-gray-500">Total</p>
                        <p className="font-semibold">
                            ₦{cart.total_cost.toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>

            {/* Cart Items */}
            <div className="bg-white rounded-xl shadow p-6 mb-6">
                <h3 className="font-semibold text-lg mb-4">Items Purchased</h3>

                <div className="space-y-4">
                    {cart.cart_items.map((ci) => {
                        const image =
                            ci.item.uploads?.[0]?.file_path ?? "/placeholder.png";

                        return (
                            <div
                                key={ci.id}
                                className="flex gap-4 items-center border rounded-lg p-4"
                            >
                                <img
                                    src={image}
                                    alt={ci.item.item_name}
                                    className="w-20 h-20 rounded object-cover border"
                                />

                                <div className="flex-1">
                                    <p className="font-medium">
                                        {ci.item.item_name}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Qty: {ci.item.quantity} × ₦
                                        {ci.item.price.toLocaleString()}
                                    </p>
                                </div>

                                <p className="font-semibold">
                                    ₦{ci.item.price.toLocaleString()}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Transaction */}
            {order.data.transaction && (
                <div className="bg-white rounded-xl shadow p-6 mb-6">
                    <h3 className="font-semibold text-lg mb-4">
                        Transaction Details
                    </h3>

                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div><strong>Amount:</strong> ₦{order.data.transaction.amount}</div>
                        <div><strong>Channel:</strong> {order.data.transaction.transaction_channel}</div>
                        <div><strong>Sender:</strong> {order.data.transaction.sender_account_name}</div>
                        <div><strong>Bank:</strong> {order.data.transaction.sender_bank}</div>
                    </div>

                    {order.data.transaction.evidence_of_payment && (
                        <img
                            src={order.data.transaction.evidence_of_payment}
                            className="mt-4 w-40 rounded border"
                        />
                    )}
                </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
                {status === "PENDING_PAYMENT" && (
                    <>
                        <button
                            onClick={() => openActionModal("Confirm Payment", "action-4")}
                            className="btn-primary"
                        >
                            Confirm Payment
                        </button>
                        <button
                            onClick={() => openActionModal("Cancel Order", "action-3")}
                            className="btn-danger"
                        >
                            Cancel Order
                        </button>
                    </>
                )}
            </div>

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <h3 className="font-semibold mb-3">{currentAction}</h3>

                        <form onSubmit={submitAction}>
                            <textarea
                                rows="4"
                                value={data.message}
                                onChange={(e) =>
                                    setData("message", e.target.value)
                                }
                                className="w-full border rounded p-2 mb-4"
                                placeholder="Optional message..."
                            />

                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="px-4 py-2 bg-gray-200 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-blue-600 text-white rounded"
                                >
                                    {processing ? "Processing..." : "Confirm"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
