import React, { useEffect, useState } from "react";
import { Eye, Filter, Search } from "lucide-react";
import { Link, router } from "@inertiajs/react";
import DashboardLayout from "../DashboardLayout";
import Breadcrumbs from "@/Components/Breadcrumb";

export default function Index({ orders, filters = {} , breadcrumbs }) {
    const [status, setStatus] = useState(
        filters.status ?? "ALL"
    );
    const [search, setSearch] = useState(filters.search ?? "");

    /**
     * Debounced search & status filter
     */
    useEffect(() => {
        const timeout = setTimeout(() => {
            router.get(
                route("order.index"),
                {
                    status,
                    search,
                },
                {
                    preserveState: true,
                    replace: true,
                }
            );
        }, 400);

        return () => clearTimeout(timeout);
    }, [status, search]);

    const getStatusStyle = (status) => {
        switch (status) {
            case "PAID":
                return "bg-green-100 text-green-800 border border-green-300";
            case "PENDING_PAYMENT":
                return "bg-yellow-100 text-yellow-800 border border-yellow-300";
            case "PROCESSING":
                return "bg-blue-100 text-blue-800 border border-blue-300";
            case "CANCELED":
                return "bg-red-100 text-red-800 border border-red-300";
            default:
                return "bg-gray-100 text-gray-800 border border-gray-300";
        }
    };

    return (
        <DashboardLayout>
            <Breadcrumbs breadcrumbs={breadcrumbs} /> 

            <div className="p-6 space-y-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold">Orders</h1>
                        <p className="text-sm text-gray-500">
                            Manage and track customer orders
                        </p>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search customer name"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm w-full sm:w-64 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            />
                        </div>

                        {/* Status Filter */}
                        <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4 text-gray-500" />
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            >
                                <option value="ALL">All</option>
                                <option value="PENDING_CONFIRMATION">
                                    Pending Confirmation
                                </option>
                                <option value="PENDING_PAYMENT">
                                    Pending Payment
                                </option>
                                <option value="PROCESSING">Processing</option>
                                <option value="PAID">Paid</option>
                                <option value="SAVED">Saved</option>
                                <option value="COMPLETED">Completed</option>
                                <option value="CANCELED">Canceled</option>
                            </select>
                        </div>
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
                                        colSpan={7}
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
                                            ORD-{order.id}
                                        </td>
                                        <td className="px-4 py-3">
                                            {order.cart?.user?.name}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusStyle(
                                                    order.status
                                                )}`}
                                            >
                                                {order.status.replace("_", " ")}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            {order.cart?.item_count}
                                        </td>
                                        <td className="px-4 py-3">
                                            ₦
                                            {order.total_cost.toLocaleString(
                                                undefined,
                                                { minimumFractionDigits: 2 }
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-500">
                                            {new Date(
                                                order.created_at
                                            ).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <Link
                                                href={`/order/${order.cart?.id}`}
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
                {orders.meta?.links?.length > 3 && (
                    <div className="flex justify-center mt-6 gap-2">
                        {orders.meta.links.map((link, index) => (
                            <Link
                                href={link.url ?? "#"}
                                preserveScroll
                                preserveState
                                className={`px-3 py-1 text-sm rounded-lg ${link.active
                                    ? "bg-indigo-600 text-white"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                    } ${!link.url && "pointer-events-none opacity-50"}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />

                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
