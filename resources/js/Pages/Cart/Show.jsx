import React, { useState } from "react";
import { ArrowLeft, ShoppingCart, UserRound, Package } from "lucide-react";
import { Link, usePage, Head } from "@inertiajs/react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";

import DashboardLayout from "../DashboardLayout";
import Breadcrumbs from "@/Components/Breadcrumb";

export default function Show({ breadcrumbs }) {
  const { cart } = usePage().props;
  const data = cart.data;

  const [total_cart_cost, setTotalCost] = useState();

  const cart_items_list = data.cart_items; 

  let mtotal=0;
  cart_items_list.forEach(element  => {
     mtotal+= element.item.price * element.quantity;
  });
 // setTotalCost(mtotal);

 console.log("Total Cart Cost:", mtotal);
  const { id, user, total_cost, cart_items, status, created_at } = data;

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount ?? 0);

  const getImage = (item) =>
    item?.uploads?.[0]?.file_path ??
    "https://via.placeholder.com/300";

  return (
    <DashboardLayout>
      <Head title={`Cart #${id}`} />
      <Breadcrumbs breadcrumbs={breadcrumbs} />

      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        {/* Back */}
        <Link
          href={route("cart.index")}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-emerald-600 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to carts
        </Link>

        {/* Cart summary */}
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <ShoppingCart className="w-5 h-5 text-emerald-600" />
              Cart Details
            </CardTitle>

            <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-600">
              {status}
            </span>
          </CardHeader>

          <CardContent className="grid sm:grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <p className="flex items-center gap-2">
                <UserRound className="w-4 h-4 text-gray-500" />
                <span className="font-medium">{user.name}</span>
              </p>
              <p className="text-gray-500">{user.email}</p>
              <p className="text-gray-400">
                Created: {new Date(created_at).toLocaleString()}
              </p>
            </div>

            <div className="text-right space-y-1">
              <p className="text-gray-500">Cart ID</p>
              <p className="font-semibold">#{id}</p>
              <p className="font-bold text-lg text-emerald-600">
                {formatCurrency(mtotal)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Cart items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {cart_items.map((entry) => {
            const item = entry.item;

            return (
              <Card
                key={entry.id}
                className="hover:shadow-lg transition"
              >
                <CardContent className="p-4">
                  <img
                    src={getImage(item)}
                    alt={item.item_name}
                    className="w-full h-44 object-cover rounded-md mb-3"
                  />

                  <div className="space-y-1">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {item.item_name}
                    </h3>

                    <p className="text-sm text-gray-500">
                      Price: {formatCurrency(item.price)}
                    </p>

                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <Package className="w-3 h-3" />
                      Stock: {item.quantity}
                    </p>

                    <span className="inline-block mt-2 text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                      {item.status}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
