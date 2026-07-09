import { Link } from "@inertiajs/react";
import {
  User,
  Banknote,
  ShoppingCart,
  Package,
  CalendarDays,
} from "lucide-react";

import DashboardLayout from "../DashboardLayout";
import Breadcrumbs from "@/Components/Breadcrumb";

const settingsList = [
//   {
//     key: "profile",
//     title: "Profile Settings",
//     description: "Manage your personal details and login credentials.",
//     icon: <User className="w-5 h-5 text-blue-600" />,
//     link:"settings/bank/create",
//   },
  {
    key: "bank",
    title: "Bank Settings",
    description: "Set up or update your bank account information.",
    icon: <Banknote className="w-5 h-5 text-green-600" />,
    link:"settings.bank.list",
  },
  {
    key: "cart",
    title: "Cart Settings",
    description: "Control how carts and saved items are managed.",
    icon: <ShoppingCart className="w-5 h-5 text-orange-500" />,
    link:"settings.cart.list",

  },
  // {
  //   key: "order",
  //   title: "Order Settings",=
  //   description: "Configure order management and notifications.",
  //   icon: <Package className="w-5 h-5 text-purple-600" />,
  //   link:"settings/type?type=order",
  // },
  // {
  //   key: "event",
  //   title: "Retreat Settings",
  //   description: "Manage event preferences, schedules, and reminders.",
  //   icon: <CalendarDays className="w-5 h-5 text-red-600" />,
  //   link:"settings/type?type=retreat",
  // },
];

export default function Index({ breadcrumbs }) {
  return (
    <DashboardLayout>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Settings Overview</h2>
        <p className="mb-6 text-gray-600">
          Explore and manage different settings that control your experience.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          {settingsList.map((setting) => (
            <Link
              key={setting.key}
              href={route(setting.link)}
              className="block transition-all p-4 rounded-xl border 
                hover:shadow-md hover:bg-gray-50 border-gray-200"
            >
              <div className="flex items-center gap-3 mb-2">
                {setting.icon}
                <h3 className="font-medium text-lg">{setting.title}</h3>
              </div>
              <p className="text-sm text-gray-600">{setting.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
