import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { motion } from "framer-motion";
import {
    FaCheck,
    FaTimes,
    FaArrowLeft,
    FaExternalLinkAlt,
} from "react-icons/fa";
import toast from "react-hot-toast";
import DashboardLayout from "../DashboardLayout";
import Breadcrumbs from "@/Components/Breadcrumb";

export default function Show() {
    const { transaction, cart, breadcrumbs } = usePage().props;

    const txn = transaction.data;
    const order = txn.order;
    const account = txn.account;
    const cartData = cart?.data;

    const form = useForm({
        transaction_id: txn.id,
    });




    const updateStatus = (status) => {
        if(confirm(`Are you sure you want to ${status.toLowerCase()} this transaction?`) === false) return;
        form
            .transform((data) => ({
                ...data,
                status: status,
            }))
        form.post(route("transactions.status.update", txn.id), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(`Transaction ${status.toLowerCase()}ed successfully`);
            },
            onError: () => {
                toast.error("Something went wrong");
            },
        });
    };




    // const form = useForm({
    //     status: "",
    //     transaction_id: txn.id,
    // });

    // const updateStatus = (status) => {
    //     form.setData("status", status);
    //     form.post(route("transactions.status.update", txn.id), {
    //         // data: { status },
    //         preserveScroll: true,
    //         onSuccess: () => {
    //             toast.success(`Transaction ${status.toLowerCase()}ed successfully`);
    //         },
    //         onError: () => {
    //             toast.error("Something went wrong");
    //         },
    //     });
    // };

    const statusColors = {
        PENDING: "bg-yellow-100 text-yellow-800",
        APPROVED: "bg-green-100 text-green-800",
        DECLINED: "bg-red-100 text-red-800",
        PAID: "bg-blue-100 text-blue-800",
    };

    const canTakeAction = txn.transaction_status === "PENDING";

    return (
        <DashboardLayout>
            <Head title={`Transaction #${txn.id}`} />
            <Breadcrumbs breadcrumbs={breadcrumbs} />

            <div className="max-w-6xl mx-auto p-6 space-y-6">

                {/* Back */}
                <Link
                    href={route("transactions.index")}
                    className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black"
                >
                    <FaArrowLeft />
                    Back to Transactions
                </Link>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-between items-start"
                >
                    <div>
                        <h1 className="text-2xl font-semibold">
                            Transaction #{txn.id}
                        </h1>
                        <p className="text-gray-500 text-sm">
                            Submitted by {txn.user?.name} ({txn.user?.email})
                        </p>
                    </div>

                    <span
                        className={`px-3 py-1 rounded text-sm font-semibold ${statusColors[txn.transaction_status]
                            }`}
                    >
                        {txn.transaction_status}
                    </span>
                </motion.div>

                {/* Transaction Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Payment Info */}
                    <div className="bg-white rounded-lg shadow p-5 space-y-3">
                        <h3 className="font-semibold">Payment Details</h3>

                        <div className="text-sm">
                            <div><strong>Amount:</strong> ₦{Number(txn.amount).toLocaleString()}</div>
                            <div><strong>Channel:</strong> {txn.transaction_channel}</div>
                            <div><strong>Sender Bank:</strong> {txn.sender_bank}</div>
                            <div><strong>Account Name:</strong> {txn.sender_account_name}</div>
                            <div><strong>Account Number:</strong> {txn.sender_account_number}</div>
                           
                        </div>

                        {txn.evidence_of_payment && (
                            <a
                                href={txn.evidence_of_payment}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-indigo-600 text-sm hover:underline"
                            >
                                <FaExternalLinkAlt />
                                View Payment Evidence
                            </a>
                        )}
                    </div>

                    {/* Order Info */}
                    {order && (
                        <div className="bg-white rounded-lg shadow p-5 space-y-3">
                            <h3 className="font-semibold">Order Summary</h3>

                            <div className="text-sm">
                                <div><strong>Order ID:</strong> #{order.id}</div>
                                 <div><strong>Receipt Ref:</strong> {txn.order.receipt_ref}</div>
                                <div><strong>Status:</strong> {order.status}</div>
                                <div><strong>Total Cost:</strong> ₦{Number(order.total_cost).toLocaleString()}</div>
                                <div><strong>Created:</strong> {new Date(order.created_at).toLocaleDateString()}</div>
                            </div>
                        </div>
                    )}
                </div>
                {account && (
                    <div className="bg-white rounded-lg shadow p-5 text-sm">
                        <h3 className="font-semibold mb-3 text-base">Recipient Account</h3>
                        <div><strong>Bank:</strong> {account.bank_name}</div>
                        <div><strong>Account Name:</strong> {account.account_name}</div>
                        <div><strong>Account Number:</strong> {account.account_number}</div>

                    </div>
                )}


                {/* Cart Items */}
                {cartData && (
                    <div className="bg-white rounded-lg shadow p-5">
                        <h3 className="font-semibold mb-3">Purchased Items</h3>

                        <div className="divide-y">
                            <div

                                className="flex justify-between py-2 text-sm"
                            >
                                <span className="font-semibold">Item</span>
                                <span className="font-semibold">Quantity</span>
                                <span className="font-semibold">Unit Price</span>
                            </div>
                            {cartData.cart_items.map(ci => (
                                <div
                                    key={ci.id}
                                    className="flex justify-between py-2 text-sm"
                                >
                                    <span>{ci.item.item_name}</span>
                                    <span>{ci.quantity}</span>
                                    <span>₦{Number(ci.item.price).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Actions */}
                {canTakeAction && (
                    <div className="flex gap-3 justify-end">
                        <button
                            onClick={() => updateStatus("DECLINED")}
                            disabled={form.processing}
                            className="inline-flex items-center gap-2 px-4 py-2 border border-red-500 text-red-600 rounded hover:bg-red-50"
                        >
                            <FaTimes />
                            Decline Payment
                        </button>

                        <button
                            onClick={() => updateStatus("APPROVED")}
                            disabled={form.processing}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                            <FaCheck />
                            Confirm Payment
                        </button>
                    </div>
                )}

            </div>
        </DashboardLayout>
    );
}
