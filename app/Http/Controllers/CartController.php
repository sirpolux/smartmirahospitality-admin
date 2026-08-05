<?php

namespace App\Http\Controllers;

use App\Http\Resources\CartResource;
use App\Models\Cart;

class CartController extends Controller
{
    /**
     * Display a paginated listing of carts for admin review.
     */
    public function index()
    {
        $sortField = request('sort_field', 'id');
        $sortDirection = request('sort_direction', 'desc');
        $keyword = request('keyword');

        $query = Cart::query()->with('user.userDetails');

        if (!empty($keyword)) {
            $query->whereHas('user', function ($userQuery) use ($keyword) {
                $userQuery->where('name', 'like', "%{$keyword}%")
                    ->orWhere('email', 'like', "%{$keyword}%");
            });
        }

        $carts = $query->orderBy($sortField, $sortDirection)
            ->paginate(20)
            ->withQueryString();

        return inertia('Cart/Index', [
            'carts' => CartResource::collection($carts),
            'queryParams' => request()->query(),
            'filters' => [
                'keyword' => $keyword,
                'sort_field' => $sortField,
                'sort_direction' => $sortDirection,
            ],
            'pagination' => [
                'total' => $carts->total(),
                'per_page' => $carts->perPage(),
                'current' => $carts->currentPage(),
                'last_page' => $carts->lastPage(),
            ],
            'breadcrumbs' => [
                ['label' => 'Carts', 'url' => route('cart.index')],
            ],
        ]);
    }

    /**
     * Display the specified cart with customer contact details.
     */
    public function show(Cart $cart)
    {
        $cart->load(['user.userDetails', 'items.item']);

        return inertia('Cart/Show', [
            'cart' => new CartResource($cart),
            'breadcrumbs' => [
                ['label' => 'Carts', 'url' => route('cart.index')],
                ['label' => "Cart #{$cart->id}", 'url' => route('cart.show', $cart->id)],
            ],
        ]);
    }
}
