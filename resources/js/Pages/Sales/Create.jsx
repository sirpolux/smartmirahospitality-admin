import { Head, router, useForm, usePage } from "@inertiajs/react";
import DashboardLayout from "../DashboardLayout";
import Breadcrumbs from "@/Components/Breadcrumb";
import { useEffect, useState } from "react";

export default function Create({ breadcrumbs }) {
    const { items, auth, errors } = usePage().props;

    /* =========================
     * Draft Item Form
     * ========================= */
    const [selectedItem, setSelectedItem] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [price, setPrice] = useState(0);

    /* =========================
     * Sale Items State
     * ========================= */
    const [saleItems, setSaleItems] = useState([]);

    /* =========================
     * Main Sale Form
     * ========================= */
    const saleForm = useForm({
        captured_by: auth.user.name,
        items: [],
        total_amount: 0,
    });

    /* =========================
     * Auto-fill price on item select
     * ========================= */
    useEffect(() => {
        if (selectedItem) {
            setPrice(selectedItem.price);
        }
    }, [selectedItem]);

    /* =========================
     * Add Item to Sale
     * ========================= */
    const addItem = () => {
        if (!selectedItem || quantity < 1) return;

        const total = price * quantity;

        const newItem = {
            item_id: selectedItem.id,
            item_name: selectedItem.item_name,
            quantity,
            price,
            total,
        };

        const updatedItems = [...saleItems, newItem];
        setSaleItems(updatedItems);
        syncForm(updatedItems);

        // reset inputs
        setSelectedItem(null);
        setQuantity(1);
        setPrice(0);
    };

    /* =========================
     * Remove Item
     * ========================= */
    const removeItem = (index) => {
        const updated = saleItems.filter((_, i) => i !== index);
        setSaleItems(updated);
        syncForm(updated);
    };

    /* =========================
     * Sync Sale Form
     * ========================= */
    const syncForm = (items) => {
        const total = items.reduce((sum, i) => sum + i.total, 0);

        saleForm.setData({
            captured_by: auth.user.name,
            items,
            total_amount: total,
        });
    };

    /* =========================
     * Submit Sale
     * ========================= */
    const submitSale = (e) => {
        e.preventDefault();

        saleForm.post(route("sales.store"), {
            onSuccess: () => {
                router.visit(route("sales.index"));
            },
        });
    };

    return (
        <DashboardLayout>
            <Head title="Create Sale" />
            <Breadcrumbs breadcrumbs={breadcrumbs} />

            <div className="max-w-7xl mx-auto p-6 space-y-8">

                {/* ================= HEADER ================= */}
                <div>
                    <h1 className="text-2xl font-semibold">Create Sale</h1>
                    <p className="text-sm text-gray-500">
                        Add items and record a completed sale
                    </p>
                </div>

                {/* ================= ADD ITEM FORM ================= */}
                <div className="bg-white p-6 rounded-xl shadow grid md:grid-cols-5 gap-4 items-end">

                    {/* Item */}
                    <div>
                        <label className="text-xs text-gray-500">Item</label>
                        <select
                            className="w-full border rounded px-3 py-2 text-sm"
                            value={selectedItem?.id || ""}
                            onChange={(e) =>
                                setSelectedItem(
                                    items.find(i => i.id === Number(e.target.value))
                                )
                            }
                        >
                            <option value="">Select item</option>
                            {items.map(item => (
                                <option key={item.id} value={item.id}>
                                    {item.item_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Quantity */}
                    <div>
                        <label className="text-xs text-gray-500">Quantity</label>
                        <input
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            className="w-full border rounded px-3 py-2 text-sm"
                        />
                    </div>

                    {/* Price */}
                    <div>
                        <label className="text-xs text-gray-500">Price (₦)</label>
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(Number(e.target.value))}
                            className="w-full border rounded px-3 py-2 text-sm"
                        />
                    </div>

                    {/* Total */}
                    <div>
                        <label className="text-xs text-gray-500">Total (₦)</label>
                        <input
                            type="number"
                            readOnly
                            value={price * quantity}
                            className="w-full bg-gray-100 border rounded px-3 py-2 text-sm"
                        />
                    </div>

                    <button
                        onClick={addItem}
                        className="bg-black text-white rounded px-4 py-2 text-sm hover:bg-gray-800"
                    >
                        Add Item
                    </button>
                </div>

                {/* ================= SALE ITEMS TABLE ================= */}
                {saleItems.length > 0 && (
                    <div className="bg-white rounded-xl shadow overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-50 text-gray-600">
                                <tr>
                                    <th className="px-4 py-3 text-left">Item</th>
                                    <th className="px-4 py-3 text-left">Qty</th>
                                    <th className="px-4 py-3 text-left">Price</th>
                                    <th className="px-4 py-3 text-left">Total</th>
                                    <th className="px-4 py-3"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {saleItems.map((item, index) => (
                                    <tr key={index} className="border-t">
                                        <td className="px-4 py-3 font-medium">
                                            {item.item_name}
                                        </td>
                                        <td className="px-4 py-3">{item.quantity}</td>
                                        <td className="px-4 py-3">
                                            ₦{item.price.toLocaleString()}
                                        </td>
                                        <td className="px-4 py-3 font-semibold">
                                            ₦{item.total.toLocaleString()}
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => removeItem(index)}
                                                className="text-xs text-red-600 hover:underline"
                                            >
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* ================= SUMMARY + SUBMIT ================= */}
                <form
                    onSubmit={submitSale}
                    className="bg-white p-6 rounded-xl shadow flex flex-col md:flex-row md:items-center md:justify-between gap-6"
                >
                    <div>
                        <p className="text-xs text-gray-500">Captured By</p>
                        <p className="font-medium">{auth.user.name}</p>
                    </div>

                    <div>
                        <p className="text-xs text-gray-500">Grand Total</p>
                        <p className="text-2xl font-bold">
                            ₦{saleForm.data.total_amount.toLocaleString()}
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={saleForm.processing || saleItems.length === 0}
                        className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 disabled:opacity-50"
                    >
                        Create Sale
                    </button>
                </form>
            </div>
        </DashboardLayout>
    );
}
