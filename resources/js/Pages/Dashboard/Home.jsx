import Breadcrumbs from "@/Components/Breadcrumb";
import DashboardLayout from "@/Pages/DashboardLayout";
import { Head } from "@inertiajs/react";

function StatCard({ label, value, accent = "blue", subText = null }) {
    const colors = {
        blue: "border-blue-500 text-blue-600",
        green: "border-green-500 text-green-600",
        yellow: "border-yellow-500 text-yellow-600",
        red: "border-red-500 text-red-600",
        purple: "border-purple-500 text-purple-600",
        emerald: "border-emerald-500 text-emerald-600",
    };

    return (
        <div className={`bg-white rounded-xl shadow-sm border-l-4 ${colors[accent]} p-5`}>
            <p className="text-sm text-gray-500">{label}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
            {subText && (
                <p className="text-xs text-gray-400 mt-1">{subText}</p>
            )}
        </div>
    );
}

export default function Home({
    breadcrumbs,
    allOrders,
    completedOrders,
    pendingOrders,
    allTransactions,
    pendingTransaction,
    completedTransaction,
    inventoryItems,
    totalApprovedTransactions,
    totalSales,
    saleCount,
}) {
    const orderCompletionRate = allOrders
        ? Math.round((completedOrders / allOrders) * 100)
        : 0;

    return (
        <DashboardLayout>
            <Head title="Dashboard" />
            <Breadcrumbs breadcrumbs={breadcrumbs} />

            {/* HEADER */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    Welcome back 👋
                </h1>
                <p className="text-gray-500">
                    Here’s a quick overview of today’s activity
                </p>
            </div>

            {/* KPI GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {/* Orders */}
                <StatCard label="Total Orders" value={allOrders} accent="blue" />
                <StatCard label="Completed Orders" value={completedOrders} accent="green" />
                <StatCard label="Pending Orders" value={pendingOrders} accent="yellow" />
                <StatCard label="Inventory Items" value={inventoryItems} accent="purple" />

                {/* Transactions */}
                <StatCard label="All Transactions" value={allTransactions} accent="blue" />
                <StatCard label="Pending Transactions" value={pendingTransaction} accent="red" />
                <StatCard label="Completed Transactions" value={completedTransaction} accent="green" />
                <StatCard
                    label="Approved Transaction Amount"
                    value={`₦${Number(totalApprovedTransactions).toLocaleString()}`}
                    accent="emerald"
                />

                {/* Sales */}
                <StatCard
                    label="Total Sales"
                    value={`₦${Number(totalSales).toLocaleString()}`}
                    accent="emerald"
                    subText={`${saleCount} sale${saleCount !== 1 ? "s" : ""}`}
                />
                <StatCard
                    label="Number of Sales"
                    value={saleCount}
                    accent="green"
                />
            </div>

            {/* INSIGHTS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Order Health */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="font-semibold text-gray-700 mb-4">
                        Order Health
                    </h3>

                    <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span>Completion Rate</span>
                            <span className="font-semibold">
                                {orderCompletionRate}%
                            </span>
                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-green-500 h-2 rounded-full transition-all"
                                style={{ width: `${orderCompletionRate}%` }}
                            />
                        </div>

                        {pendingOrders > 0 ? (
                            <p className="text-sm text-yellow-600 mt-3">
                                ⚠️ {pendingOrders} order(s) pending action
                            </p>
                        ) : (
                            <p className="text-sm text-green-600 mt-3">
                                ✅ All orders are completed
                            </p>
                        )}
                    </div>
                </div>

                {/* Transaction Overview */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="font-semibold text-gray-700 mb-4">
                        Transaction Overview
                    </h3>

                    <ul className="space-y-3 text-sm">
                        <li className="flex justify-between">
                            <span>Completed</span>
                            <span className="font-semibold text-green-600">
                                {completedTransaction}
                            </span>
                        </li>
                        <li className="flex justify-between">
                            <span>Pending</span>
                            <span className="font-semibold text-red-600">
                                {pendingTransaction}
                            </span>
                        </li>
                        <li className="flex justify-between">
                            <span>Total</span>
                            <span className="font-semibold">
                                {allTransactions}
                            </span>
                        </li>
                    </ul>
                </div>

                {/* Sales Summary */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="font-semibold text-gray-700 mb-4">
                        Sales Summary
                    </h3>

                    <p className="text-sm text-gray-500 mb-1">
                        Revenue from recorded sales
                    </p>

                    <h2 className="text-3xl font-bold text-emerald-600">
                        ₦{Number(totalSales).toLocaleString()}
                    </h2>

                    <p className="text-sm text-gray-600 mt-2">
                        {saleCount} sale{saleCount !== 1 ? "s" : ""} recorded
                    </p>
                </div>
            </div>
        </DashboardLayout>
    );
}
