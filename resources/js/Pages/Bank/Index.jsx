import { Link, router } from '@inertiajs/react';
import { ArrowLeft, Plus, List } from 'lucide-react';
import DashboardLayout from '../DashboardLayout';

export default function Index() {
    return (
        <DashboardLayout>
            <div className="p-6 space-y-6">
                {/* Back Button */}
                <button
                    onClick={() => router.visit('/settings')}
                    className="flex items-center text-sm text-dark hover:underline"
                >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back to Settings
                </button>

                <h2 className="text-xl font-bold">Bank Settings</h2>
                <p className="text-sm text-gray-600">Manage bank-related settings including viewing and adding bank accounts.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Bank List */}
                    <Link
                         href={route('settings.bank.list')}
                        className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow transition duration-200 hover:bg-gray-50"
                    >
                        <List className="w-5 h-5 mt-1 text-blue-500" />
                        <div>
                            <h3 className="text-lg font-semibold">Bank List</h3>
                            <p className="text-sm text-gray-500">View all the banks you've already added.</p>
                        </div>
                    </Link>

                    {/* Add Bank */}
                    <Link
                           href="bank/create"
                        className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow transition duration-200 hover:bg-gray-50"
                    >
                        <Plus className="w-5 h-5 mt-1 text-green-500" />
                        <div>
                            <h3 className="text-lg font-semibold">Add Bank</h3>
                            <p className="text-sm text-gray-500">Create a new bank account record.</p>
                        </div>
                    </Link>
                </div>
            </div>
        </DashboardLayout>
    );
}
