import ApplicationLogo from '@/Components/ApplicationLogo';
import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth, canRegister }) {
    return (
        <>
            <Head title="Welcome" />

            <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-6">
                <div className="w-full max-w-md">
                    {/* Brand */}
                    <div className="flex flex-col items-center">
                        <ApplicationLogo className="h-20 w-auto" />
                        <h1 className="mt-6 text-center text-2xl font-bold text-gray-800">
                            Admin Panel
                        </h1>
                        <p className="mt-2 text-center text-sm text-gray-500">
                            SmartMirah Hospitality Limited management portal
                        </p>
                    </div>

                    {/* Auth action */}
                    <div className="mt-8 flex flex-col items-center gap-4">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                            >
                                Go to Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                                >
                                    Log in
                                </Link>
                                {canRegister && (
                                    <Link
                                        href={route('register')}
                                        className="inline-flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-primary hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                                    >
                                        Register
                                    </Link>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
