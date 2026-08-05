import React, { useEffect, useState } from "react";
import { Eye, Search } from "lucide-react";
import { Link, router } from "@inertiajs/react";
import DashboardLayout from "../DashboardLayout";
import Breadcrumbs from "@/Components/Breadcrumb";
import Pagination from "@/Components/Pagination";

const statusStyles = {
    pending: "bg-yellow-100 text-yellow-800 border border-yellow-300",
    received: "bg-blue-100 text-blue-800 border border-blue-300",
    packaged: "bg-indigo-100 text-indigo-800 border border-indigo-300",
    shipped: "bg-purple-100 text-purple-800 border border-purple-300",
    delivered: "bg-green-100 text-green-800 border border-green-300",
    cancelled: "bg-red-100 text-red-800 border border-red-300",
};

const statusLabels = {
    pending: "Pending",
    received: "Received",
    packaged: "Packaged",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled",
};

export default function Index({ orders, filters = {}, queryParams = {}, breadcrumbs }) {
    const [status, setStatus] = useState(filters.status ?? "");
    const [search, setSearch] = useState(filters.keyword ?? "");

    /**
     * Debounced search
     */
    useEffect(() => {
        const timeout = setTimeout(() => {
            router.get(
                route("order.index"),
                {
                    keyword: search,
                    status,
                },
                {
                    preserveState: true,
                    replace: true,
                }
            );
        }, 400);

        return () => clearTimeout(timeout);
    }, [search]);

    const handleStatusChange = (e) => {
        const nextStatus = e.target.value;
        setStatus(nextStatus);
        router.get(
            route("order.index"),
            {
                keyword: search,
                status: nextStatus,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const formatCurrency = (value) =>
        "₦" + Number(value || 0).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

    return (
        <DashboardLayout>
            <Breadcrumbs breadcrumbs={breadcrumbs} />

            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
                        <p className="text-sm text-gray-500">
                            Review customer orders, update fulfilment status, and manage
                            payments.
                        </p>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search customer name / receipt ref"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm w-full sm:w-72 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            />
                        </div>

                        {/* Status Filter */}
                        <select
                            value={status}
                            onChange={handleStatusChange}
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        >
                            <option value="">All Statuses</option>
                            {Object.entries(statusLabels).map(([value, label]) => (
                                <option key={value} value={value}>
                                    {label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="overflow-x-auto rounded-xl shadow-sm border border-gray-200 bg-white">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-sm font-medium text-gray-600">
                                    Order ID
                                </th>
                                <th className="px-4 py-3 text-sm font-medium text-gray-600">
                                    Customer
                                </th>
                                <th className="px-4 py-3 text-sm font-medium text-gray-600">
                                    Status
                                </th>
                                <th className="px-4 py-3 text-sm font-medium text-gray-600">
                                    Items
                                </th>
                                <th className="px-4 py-3 text-sm font-medium text-gray-600">
                                    Total
                                </th>
                                <th className="px-4 py-3 text-sm font-medium text-gray-600">
                                    Receipt Ref
                                </th>
                                <th className="px-4 py-3 text-sm font-medium text-gray-600">
                                    Date
                                </th>
                                <th className="px-4 py-3 text-sm font-medium text-right text-gray-600">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            {orders.data.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="text-center py-8 text-gray-500"
                                    >
                                        No orders found
                                    </td>
                                </tr>
                            ) : (
                                orders.data.map((order) => (
                                    <tr
                                        key={order.id}
                                        className="hover:bg-gray-50 transition"
                                    >
                                        <td className="px-4 py-3 font-medium">
                                            #{order.id}
                                        </td>
                                        <td className="px-4 py-3">
                                            {order.user?.name || "Guest"}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`px-2 py-1 text-xs rounded-full font-medium ${statusStyles[order.status] || statusStyles.pending}`}
                                            >
                                                {statusLabels[order.status] || order.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            {order.total_quantity}
                                        </td>
                                        <td className="px-4 py-3 font-medium">
                                            {formatCurrency(order.total_price)}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-500">
                                            {order.receipt_ref || "—"}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-500">
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <Link
                                                href={route("order.show", order.id)}
                                                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition"
                                            >
                                                <Eye className="w-4 h-4" />
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <Pagination links={orders.meta?.links} queryParams={queryParams} />
            </div>
        </DashboardLayout>
    );
}
