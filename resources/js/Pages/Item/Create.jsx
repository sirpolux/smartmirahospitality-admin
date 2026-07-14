import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import SelectInput from "@/Components/SelectInput";
import TextAreaInput from "@/Components/TextAreaInput";
import TextInput from "@/Components/TextInput";
import { Head, useForm, usePage } from "@inertiajs/react";
import { UploadCloud, Boxes } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import DashboardLayout from "../DashboardLayout";
import Breadcrumbs from "@/Components/Breadcrumb";

export default function Create({ response = null, breadcrumbs, categories }) {
    const { cloudinary } = usePage().props;

    const [imagePreview, setImagePreview] = useState(null);
    const { data, setData, post, errors, reset } = useForm({
        item_name: "",
        price: "",
        item_description: "",
        manufacturer: "",
        category_id: "",
        status: "",
    });

    const onSubmit = (e) => {
        e.preventDefault();
        post(route("item.store"), {
            onSuccess: () => {
                toast.success("Item successfully added to inventory");
                reset();
                window.scrollTo({ top: 0, behavior: "smooth" });
            },
            onError: () => toast.error("Failed to add item. Check input."),
        });
    };

    return (
        <DashboardLayout>
            <Head title="New Inventory Item" />
            <Breadcrumbs breadcrumbs={breadcrumbs} />

            <div className="p-4 md:p-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white shadow-xl rounded-2xl p-6 md:p-10 border border-gray-200  backdrop-blur-sm"
                >
                    <motion.h2
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl font-bold text-gray-800  mb-8 flex items-center gap-3"
                    >
                        <Boxes className="text-secondary" /> Add New Inventory Item
                    </motion.h2>

                    <form onSubmit={onSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Item name */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4 }}
                            >
                                <InputLabel htmlFor="item_name" value="Item Name *" />
                                <TextInput
                                    name="item_name"
                                    value={data.item_name}
                                    onChange={(e) => setData("item_name", e.target.value)}
                                    className="mt-1 block w-full"
                                />
                                <InputError message={errors.item_name} className="mt-1 text-red-600" />
                            </motion.div>

                            {/* Manufacturer */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4 }}
                            >
                                <InputLabel htmlFor="manufacturer" value="Manufacturer *" />
                                <TextInput
                                    name="manufacturer"
                                    value={data.manufacturer}
                                    onChange={(e) => setData("manufacturer", e.target.value)}
                                    className="mt-1 block w-full"
                                />
                                <InputError message={errors.manufacturer} className="mt-1 text-red-600" />
                            </motion.div>

                            {/* Category */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4 }}
                            >
                                <InputLabel htmlFor="category_id" value="Category *" />
                                <SelectInput
                                    name="category_id"
                                    value={data.category_id}
                                    onChange={(e) => setData("category_id", e.target.value)}
                                    className="mt-1 block w-full"
                                >
                                    <option value="">-- Select Category --</option>
                                    {categories?.data?.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </SelectInput>
                                <InputError message={errors.category_id} className="mt-1 text-red-600" />
                            </motion.div>

                            {/* Price */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4 }}
                            >
                                <InputLabel htmlFor="price" value="Price *" />
                                <TextInput
                                    name="price"
                                    type="number"
                                    value={data.price}
                                    onChange={(e) => setData("price", e.target.value)}
                                    className="mt-1 block w-full"
                                />
                                <InputError message={errors.price} className="mt-1 text-red-600" />
                            </motion.div>

                            {/* Description */}
                            <motion.div
                                className="col-span-2"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <InputLabel htmlFor="item_description" value="Description *" />
                                <TextAreaInput
                                    name="item_description"
                                    value={data.item_description}
                                    onChange={(e) => setData("item_description", e.target.value)}
                                    className="mt-1 block w-full h-32 bg-white"
                                />
                                <InputError message={errors.item_description} className="mt-1 text-red-600" />
                            </motion.div>
                        </div>

                        {/* Submit */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="flex justify-end"
                        >
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="submit"
                                className="bg-primary hover:bg-secondary text-white px-6 py-3 rounded-lg shadow-md font-medium tracking-wide transition-all"
                            >
                                Add Item
                            </motion.button>
                        </motion.div>
                    </form>
                </motion.div>
            </div>
        </DashboardLayout>
    );
}
