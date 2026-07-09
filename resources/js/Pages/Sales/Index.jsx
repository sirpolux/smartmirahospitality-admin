import Breadcrumbs from "@/Components/Breadcrumb";
import DashboardLayout from "../DashboardLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend
);


export default function Index({ sales, breadcrumbs, filters, sales_summary, chart }) {
    const { data, setData } = useForm({
        keyword: filters.keyword || "",
        start_date: filters.start_date || "",
        end_date: filters.end_date || "",
        per_page: filters.per_page || 20,
        sort_field: filters.sort_field || "created_at",
        sort_direction: filters.sort_direction || "desc",
    });

    const submitFilters = () => {
        router.get(route("sales.index"), data, {
            preserveState: true,
            replace: true,
        });
    };

    const toggleSort = (field) => {
        setData({
            ...data,
            sort_field: field,
            sort_direction:
                data.sort_field === field && data.sort_direction === "asc"
                    ? "desc"
                    : "asc",
        });

        router.get(route("sales.index"), {
            ...data,
            sort_field: field,
            sort_direction:
                data.sort_field === field && data.sort_direction === "asc"
                    ? "desc"
                    : "asc",
        }, {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <DashboardLayout>
            <Head title="Sales" />
            <Breadcrumbs breadcrumbs={breadcrumbs} />

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Sales</h1>
                <div className="flex gap-2">
                    <Link
                        href={route("sales.create")}
                        className="bg-green-500 px-4 py-2 rounded text-white"
                    >
                        Add Sale
                    </Link>
                    {/* <a
                        href={route('sales.export', filters)} target="_blank"
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Export CSV
                    </a> */}

                </div>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-white p-4 rounded shadow">
                    <p className="text-sm text-gray-500">Total Sales</p>
                    <p className="text-xl font-bold">{sales_summary.total_sales}</p>
                </div>
                <div className="bg-white p-4 rounded shadow">
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="text-xl font-bold">
                        ₦{Number(sales_summary.total_amount).toLocaleString()}
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded shadow mb-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <input
                        type="text"
                        placeholder="Search item..."
                        value={data.keyword}
                        onChange={(e) => setData("keyword", e.target.value)}
                        className="border rounded px-3 py-2"
                    />

                    <input
                        type="date"
                        value={data.start_date}
                        onChange={(e) => setData("start_date", e.target.value)}
                        className="border rounded px-3 py-2"
                    />

                    <input
                        type="date"
                        value={data.end_date}
                        onChange={(e) => setData("end_date", e.target.value)}
                        className="border rounded px-3 py-2"
                    />

                    <select
                        value={data.per_page}
                        onChange={(e) => setData("per_page", e.target.value)}
                        className="border rounded px-3 py-2"
                    >
                        {[10, 20, 50, 100].map(n => (
                            <option key={n} value={n}>{n} / page</option>
                        ))}
                    </select>

                    <button
                        onClick={submitFilters}
                        className="bg-blue-500 text-white rounded px-4 py-2"
                    >
                        Apply
                    </button>
                </div>
            </div>

            <div className="bg-white p-4 rounded shadow mb-6">
                <h2 className="font-semibold mb-4">Sales Trend</h2>
                <Bar
                    data={{
                        labels: chart.labels,
                        datasets: [
                            {
                                label: "Daily Sales Amount",
                                data: chart.values,
                            },
                        ],
                    }}
                    options={{
                        responsive: true,
                        plugins: {
                            legend: { display: false },
                        },
                    }}
                />
            </div>

            {/* Table */}
            <div className="bg-white rounded shadow overflow-x-auto">
                {sales.data.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                        No sales found for the selected filters.
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th
                                    className="px-4 py-3 cursor-pointer"
                                    onClick={() => toggleSort("created_at")}
                                >
                                    Date
                                </th>
                                <th className="px-4 py-3">Item</th>
                                <th className="px-4 py-3">Quantity</th>
                                <th
                                    className="px-4 py-3 cursor-pointer"
                                    onClick={() => toggleSort("total_price")}
                                >
                                    Total Price
                                </th>
                                <th className="px-4 py-3">Captured By</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sales.data.map((sale) => (
                                <tr key={sale.id} className="border-t">
                                    <td className="px-4 py-3">
                                        {new Date(sale.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-3">{sale.item_name}</td>
                                    <td className="px-4 py-3">{sale.quantity}</td>
                                    <td className="px-4 py-3">
                                        ₦{Number(sale.total_price).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3">
                                        {sale.captured_by.name}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Pagination */}
            {sales.meta.last_page > 1 && (
                <div className="mt-6 flex justify-center gap-2">
                    {sales.meta.links.map((link, index) => (
                        <button
                            key={index}
                            disabled={!link.url}
                            onClick={() => link.url && router.get(link.url)}
                            className={`px-3 py-1 rounded ${link.active
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200"
                                }`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            )}
        </DashboardLayout>
    );
}
