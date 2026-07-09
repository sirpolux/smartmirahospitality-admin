import { Head, Link } from "@inertiajs/react";
import { EyeIcon, ShoppingCartIcon, UserIcon } from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/Components/ui/card";
import DashboardLayout from "../DashboardLayout";
import Breadcrumbs from "@/Components/Breadcrumb";

export default function Index({ cart, breadcrumbs }) {
    return (
        <DashboardLayout>
            <Head title="Customer Carts" />
            <Breadcrumbs breadcrumbs={breadcrumbs} />

            <div className="w-full min-h-screen  py-8 px-4 md:px-8">
                {/* Back Button */}
                <div className="">
                    {/* Page Title */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            <ShoppingCartIcon className="w-6 h-6 text-emerald-600" />
                            Customer Carts
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            View all active and historical customer carts
                        </p>
                    </div>

                    {/* Empty state */}
                    {(!cart.data || cart.data.length === 0) && (
                        <div className="flex items-center justify-center py-20">
                            <p className="text-gray-500 text-lg italic">
                                No customer carts found.
                            </p>
                        </div>
                    )}

                    {/* Cart list */}
                    <div className="grid gap-6 max-h-[75vh] overflow-auto pr-1">
                        {cart.data?.map((entry) => (
                            <Card
                                key={entry.id}
                                className="shadow-md hover:shadow-lg transition"
                            >
                                {/* Header */}
                                <CardHeader className="flex flex-row items-center justify-between pb-3">
                                    <div className="flex items-center gap-2">
                                        <UserIcon className="w-5 h-5 text-gray-500" />
                                        <CardTitle className="text-base">
                                            Customer name: {entry.user.name}
                                        </CardTitle>
                                    </div>

                                    <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-600">
                                        {entry.status}
                                    </span>
                                </CardHeader>

                                <CardContent>
                                    {/* Cart items */}
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                        {entry.cart_items.map((ci) => {
                                            const item = ci.item;
                                            const image =
                                                item?.uploads?.[0]?.file_path ??
                                                "https://via.placeholder.com/300";

                                            return (
                                                <div
                                                    key={ci.id}
                                                    className="border rounded-lg overflow-hidden hover:shadow transition"
                                                >
                                                    <img
                                                        src={image}
                                                        alt={item.item_name}
                                                        className="h-32 w-full object-cover"
                                                    />

                                                    <div className="p-3">
                                                        <h3 className="font-medium text-sm truncate">
                                                            {item.item_name}
                                                        </h3>

                                                        <p className="text-xs text-gray-500 mt-1">
                                                            Price: ₦{Number(item.price).toLocaleString()}
                                                        </p>

                                                        <p className="text-xs text-gray-400 mt-1">
                                                            Stock: {item.quantity}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </CardContent>

                                {/* Footer */}
                                <CardFooter className="flex justify-between items-center border-t pt-3 text-sm">
                                    <div className="text-gray-500">
                                        Created:{" "}
                                        <span className="font-medium">
                                            {new Date(entry.created_at).toLocaleString()}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <span className="font-semibold">
                                            Total: ₦
                                            {Number(entry.total_cost).toLocaleString()}
                                        </span>

                                        <Link
                                            href={route("cart.show", entry.id)}
                                            className="inline-flex items-center gap-1 rounded-md bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-gray-800 transition"
                                        >
                                            <EyeIcon className="w-4 h-4" />
                                            View
                                        </Link>
                                    </div>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>

                    {/* Pagination */}
                    {cart.meta?.links && (
                        <div className="flex justify-center mt-6 gap-2 flex-wrap">
                            {cart.meta.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url ?? "#"}
                                    className={`px-3 py-1 text-sm rounded-md border transition ${link.active
                                            ? "bg-gray-900 text-white"
                                            : "bg-white text-gray-700 hover:bg-gray-100"
                                        } ${!link.url ? "opacity-50 cursor-not-allowed" : ""}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

        </DashboardLayout>
    );
}
