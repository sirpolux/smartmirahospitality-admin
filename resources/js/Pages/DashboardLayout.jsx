import { useState } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import {
    MdDashboard,
    MdOutlineShoppingCart,
    MdOutlineInventory,
    MdSettings,
    MdOutlineSavings
} from "react-icons/md";
import { FaUsers } from "react-icons/fa6";
import { GrTransaction } from "react-icons/gr";
    import { AiOutlineStock } from "react-icons/ai";
import { RiLuggageCartLine } from "react-icons/ri";
import { FcSalesPerformance } from "react-icons/fc";

import { LogOut, MenuIcon } from "lucide-react";
import { Toaster } from "react-hot-toast";
import AuthenticatedLayoutPlain from "@/Layouts/AuthenticatedLayoutPlain";

export default function DashboardLayout({ children}) {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
    const { auth, ziggy } = usePage().props;

    const logout = () => router.post(route("logout"));

    const currentRoute =  "";

    const menuItems = [
        { label: "Dashboard", link: "dashboard", icon: <MdDashboard className="text-xl" /> },
        { label: "Inventory", link: "item.index", icon: <MdOutlineInventory className="text-xl" /> },
        { label: "Stock", link: "stock.index", icon: <AiOutlineStock className="text-xl" /> },
        { label: "Cart", link: "cart.index", icon: <MdOutlineShoppingCart className="text-xl" /> },
        { label: "Order", link: "order.index", icon: <RiLuggageCartLine className="text-xl" /> },
        { label: "Transactions", link: "transactions.index", icon: <GrTransaction className="text-xl" /> },
        // { label: "Savings", link: "savings.index", icon: <MdOutlineSavings className="text-xl" /> },
        // {label: "Sales", link: "sales.index", icon: <FcSalesPerformance className="text-xl" />},
        // { label: "Users", link: "user.index", icon: <FaUsers className="text-xl" /> },
       // { label: "Settings", link: "settings.index", icon: <MdSettings className="text-xl" /> },
    ];

    return (
        <AuthenticatedLayoutPlain>
            <Toaster position="top-right" toastOptions={{ className: "text-sm" }} />
            <Head title="Admin Dashboard" />

            {/* Overlay for mobile sidebar */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-30 md:hidden"
                    onClick={toggleSidebar}
                />
            )}

            <div className="flex min-h-screen bg-gray-100 text-gray-900">

                {/* Sidebar */}
                <aside
                    className={`fixed z-40 md:static top-0 left-0 h-screen w-64 bg-white border-r shadow-md 
                    transform transition-transform duration-300 ease-in-out 
                    ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
                    md:translate-x-0`}
                >
                    <div className="flex flex-col h-full p-4">

                        {/* Brand */}
                        <div className="text-center mb-6 mt-8">
                            <img
                                src="/img/logo.png"
                                alt="Logo"
                                className="mx-auto w-20 rounded-lg "
                            />
                            <div className="mt-3 font-bold text-lg tracking-wide">
                                <p className="text-gray-700 font-bold">SmartMirah</p>
                                <p className="text-gray-700">Hospitality Limited</p>
                            </div>
                            <p className="text-xs font-bold text-gray-800">Admin Panel</p>
                        </div>

                        {/* Navigation */}
                        <nav className="flex-1 space-y-1 mt-4">
                            {menuItems.map(({ label, link, icon }) => {
                                const isActive = currentRoute.includes(route(link));

                                return (
                                    <Link
                                        key={label}
                                        href={route(link)}
                                        className={`flex items-center gap-3 px-4 py-2 rounded-lg transition font-medium
                                        ${
                                            isActive
                                                ? "bg-[#714C30] text-white shadow-sm"
                                                : "text-gray-700 hover:bg-gray-200/70"
                                        }`}
                                    >
                                        {icon}
                                        <span>{label}</span>
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Logout */}
                        <button
                            onClick={logout}
                            className="flex items-center gap-2 mt-auto px-4 py-2 rounded-lg text-red-600 hover:bg-red-100 transition"
                        >
                            <LogOut size={18} />
                            <span>Logout</span>
                        </button>
                    </div>
                </aside>

                {/* Main content */}
                <main className="flex-1 flex flex-col overflow-hidden">

                    {/* Top Navbar (Mobile only) */}
                    <header className="w-full bg-white p-4 border-b shadow-sm flex items-center justify-between md:hidden">
                        <button onClick={toggleSidebar}>
                            <MenuIcon className="w-6 h-6 text-gray-700" />
                        </button>
                        <div className="text-sm font-semibold">{auth?.user?.name}</div>
                    </header>

                    {/* Page Container */}
                    <section className="p-4 md:p-1 overflow-y-auto flex-1">
                        <div className="bg-white shadow-lg rounded-lg p-6 h-[95vh] overflow-y-auto border border-gray-100">
                            {children}
                        </div>
                    </section>
                </main>
            </div>
        </AuthenticatedLayoutPlain>
    );
}
