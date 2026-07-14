import { motion } from "framer-motion";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import { Head, useForm } from "@inertiajs/react";
import { TagIcon } from "lucide-react";
import toast from "react-hot-toast";
import DashboardLayout from "../DashboardLayout";
import Breadcrumbs from "@/Components/Breadcrumb";

export default function Create({ breadcrumbs }) {
    const { data, setData, post, errors, reset, processing } = useForm({
        name: "",
    });

    const onSubmit = (e) => {
        e.preventDefault();
        post(route("item-category.store"), {
            onSuccess: () => {
                toast.success("Category created successfully");
                reset();
                window.scrollTo({ top: 0, behavior: "smooth" });
            },
            onError: () => toast.error("Failed to create category. Check your input."),
        });
    };

    return (
        <DashboardLayout>
            <Head title="New Category" />
            <Breadcrumbs breadcrumbs={breadcrumbs} />

            <div className="p-4 md:p-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white shadow-xl rounded-2xl p-6 md:p-10 border border-gray-200"
                >
                    <motion.h2
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl font-bold text-gray-800 mb-8 flex items-center gap-3"
                    >
                        <TagIcon className="text-indigo-600" /> Create Item Category
                    </motion.h2>

                    <form onSubmit={onSubmit} className="space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4 }}
                            className="max-w-md"
                        >
                            <InputLabel htmlFor="name" value="Category Name *" />
                            <TextInput
                                id="name"
                                name="name"
                                value={data.name}
                                onChange={(e) => setData("name", e.target.value)}
                                className="mt-1 block w-full"
                                placeholder="e.g. Medical Supplies"
                            />
                            <InputError message={errors.name} className="mt-1 text-red-600" />
                        </motion.div>

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
                                disabled={processing}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg shadow-md font-medium tracking-wide transition-all disabled:opacity-50"
                            >
                                {processing ? "Saving..." : "Create Category"}
                            </motion.button>
                        </motion.div>
                    </form>
                </motion.div>
            </div>
        </DashboardLayout>
    );
}
