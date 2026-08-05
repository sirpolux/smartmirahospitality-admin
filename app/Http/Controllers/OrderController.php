<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateOrderRequest;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    /**
     * Display a paginated listing of orders for admin review.
     */
    public function index()
    {
        $sortField = request('sort_field', 'id');
        $sortDirection = request('sort_direction', 'desc');
        $keyword = request('keyword');
        $status = request('status');

        $query = Order::query()->with('user.userDetails');

        if (!empty($keyword)) {
            $query->where(function ($q) use ($keyword) {
                $q->whereHas('user', function ($userQuery) use ($keyword) {
                    $userQuery->where('name', 'like', "%{$keyword}%")
                        ->orWhere('email', 'like', "%{$keyword}%");
                })->orWhere('receipt_ref', 'like', "%{$keyword}%");
            });
        }

        if (!empty($status) && in_array($status, Order::STATUSES, true)) {
            $query->where('status', $status);
        }

        $orders = $query->orderBy($sortField, $sortDirection)
            ->paginate(20)
            ->withQueryString();

        return inertia('Order/Index', [
            'orders' => OrderResource::collection($orders),
            'queryParams' => request()->query(),
            'filters' => [
                'keyword' => $keyword,
                'status' => $status,
                'sort_field' => $sortField,
                'sort_direction' => $sortDirection,
            ],
            'pagination' => [
                'total' => $orders->total(),
                'per_page' => $orders->perPage(),
                'current' => $orders->currentPage(),
                'last_page' => $orders->lastPage(),
            ],
            'breadcrumbs' => [
                ['label' => 'Orders', 'url' => route('order.index')],
            ],
        ]);
    }

    /**
     * Display the specified order with customer, items and transactions.
     */
    public function show(Order $order)
    {
        $order->load(['user.userDetails', 'items.item', 'transactions.user']);

        return inertia('Order/Show', [
            'order' => new OrderResource($order),
            'breadcrumbs' => [
                ['label' => 'Orders', 'url' => route('order.index')],
                ['label' => "Order #{$order->id}", 'url' => route('order.show', $order->id)],
            ],
        ]);
    }

    /**
     * Update the order status.
     */
    public function updateStatus(UpdateOrderRequest $request, Order $order)
    {
        $admin = Auth::user();

        $data = ['status' => $request->status];

        if ($request->status === 'received') {
            $data['delivery_confirmed_by'] = $admin->name;
        }

        if ($request->status === 'delivered') {
            $data['delivered_by'] = $admin->name;
        }

        $order->update($data);

        return back()->with([
            'message' => "Order #{$order->id} status updated to {$request->status}",
            'status' => 'success',
        ]);
    }
}
