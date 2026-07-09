import { Link } from "@inertiajs/react";
import { ChevronRightIcon, HomeIcon } from "@heroicons/react/24/outline";

export default function Breadcrumbs({ breadcrumbs = [] }) {
  if (!breadcrumbs.length) return null;

  return (
    <nav className="flex items-center text-sm text-gray-500 dark:text-gray-400">
      <ol className="flex items-center space-x-1">
        {/* Home */}
        <li className="flex items-center">
          <Link
            href={route("dashboard")}
            className="flex items-center gap-1 hover:text-indigo-600 transition"
          >
            <HomeIcon className="w-4 h-4" />
            <span className="sr-only">Home</span>
          </Link>
        </li>

        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return (
            <li key={index} className="flex items-center">
              <ChevronRightIcon className="w-4 h-4 mx-2 text-gray-400" />

              {crumb.url && !isLast ? (
                <Link
                  href={crumb.url}
                  className="hover:text-indigo-600 transition font-medium"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="font-semibold text-gray-700 dark:text-gray-200">
                  {crumb.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
