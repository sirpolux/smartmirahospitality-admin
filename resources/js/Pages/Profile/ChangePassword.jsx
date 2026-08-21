import { motion } from "framer-motion";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import { Head, useForm, usePage } from "@inertiajs/react";
import { LockClosedIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { useEffect } from "react";
import DashboardLayout from "../DashboardLayout";
import Breadcrumbs from "@/Components/Breadcrumb";

export default function ChangePassword({ breadcrumbs }) {
    const { status } = usePage().props;

    const { data, setData, put, errors, processing, reset } = useForm({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    useEffect(() => {
        if (status === "password-updated") {
            toast.success("Password updated successfully");
            reset();
        }
    }, [status]);

    const onSubmit = (e) => {
        e.preventDefault();
        put(route("password.update"), {
            onSuccess: () => reset(),
            onError: () =>
                toast.error("Failed to update password. Check your input."),
        });
    };

    return (
        <DashboardLayout>
            <Head title="Change Password" />
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
                        className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-3"
                    >
                        <LockClosedIcon className="w-6 h-6 text-amber-500" />{" "}
                        Change Password
                    </motion.h2>
                    <p className="text-sm text-gray-500 mb-8">
                        Update your admin account password. You will need your
                        current password to confirm the change.
                    </p>

                    <form onSubmit={onSubmit} className="space-y-6 max-w-md">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            <InputLabel
                                htmlFor="current_password"
                                value="Current Password *"
                            />
                            <TextInput
                                id="current_password"
                                name="current_password"
                                type="password"
                                value={data.current_password}
                                onChange={(e) =>
                                    setData("current_password", e.target.value)
                                }
                                className="mt-1 block w-full"
                                autoComplete="current-password"
                                placeholder="Enter your current password"
                                required
                            />
                            <InputError
                                message={errors.current_password}
                                className="mt-1 text-red-600"
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                        >
                            <InputLabel
                                htmlFor="password"
                                value="New Password *"
                            />
                            <TextInput
                                id="password"
                                name="password"
                                type="password"
                                value={data.password}
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                                className="mt-1 block w-full"
                                autoComplete="new-password"
                                placeholder="Enter a new password"
                                required
                            />
                            <InputError
                                message={errors.password}
                                className="mt-1 text-red-600"
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                        >
                            <InputLabel
                                htmlFor="password_confirmation"
                                value="Confirm New Password *"
                            />
                            <TextInput
                                id="password_confirmation"
                                name="password_confirmation"
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) =>
                                    setData(
                                        "password_confirmation",
                                        e.target.value
                                    )
                                }
                                className="mt-1 block w-full"
                                autoComplete="new-password"
                                placeholder="Re-enter your new password"
                                required
                            />
                            <InputError
                                message={errors.password_confirmation}
                                className="mt-1 text-red-600"
                            />
                        </motion.div>

                        {/* Submit */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="flex justify-end gap-3 pt-2"
                        >
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="submit"
                                disabled={processing}
                                className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg shadow-md font-medium tracking-wide transition-all disabled:opacity-50"
                            >
                                {processing
                                    ? "Updating..."
                                    : "Update Password"}
                            </motion.button>
                        </motion.div>
                    </form>
                </motion.div>
            </div>
        </DashboardLayout>
    );
}
