<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateTransactionRequest;
use App\Http\Resources\TransactionResource;
use App\Models\Transaction;
use Illuminate\Support\Facades\Auth;

class TransactionController extends Controller
{
    /**
     * Display a paginated listing of transactions for admin review.
     */
    public function index()
    {
        $sortField = request('sort_field', 'id');
        $sortDirection = request('sort_direction', 'desc');
        $keyword = request('keyword');
        $status = request('status');

        $query = Transaction::query()->with(['user', 'order']);

        if (!empty($keyword)) {
            $query->where(function ($q) use ($keyword) {
                $q->whereHas('user', function ($userQuery) use ($keyword) {
                    $userQuery->where('name', 'like', "%{$keyword}%")
                        ->orWhere('email', 'like', "%{$keyword}%");
                })->orWhere('description', 'like', "%{$keyword}%");
            });
        }

        if (!empty($status) && in_array($status, Transaction::STATUSES, true)) {
            $query->where('status', $status);
        }

        $transactions = $query->orderBy($sortField, $sortDirection)
            ->paginate(20)
            ->withQueryString();

        return inertia('Transaction/Index', [
            'transactions' => TransactionResource::collection($transactions),
            'queryParams' => request()->query(),
            'filters' => [
                'keyword' => $keyword,
                'status' => $status,
                'sort_field' => $sortField,
                'sort_direction' => $sortDirection,
            ],
            'pagination' => [
                'total' => $transactions->total(),
                'per_page' => $transactions->perPage(),
                'current' => $transactions->currentPage(),
                'last_page' => $transactions->lastPage(),
            ],
            'breadcrumbs' => [
                ['label' => 'Transactions', 'url' => route('transactions.index')],
            ],
        ]);
    }

    /**
     * Display the specified transaction with order and evidence.
     */
    public function show(Transaction $transaction)
    {
        $transaction->load(['user', 'order.user', 'uploads', 'confirmedBy']);

        return inertia('Transaction/Show', [
            'transaction' => new TransactionResource($transaction),
            'breadcrumbs' => [
                ['label' => 'Transactions', 'url' => route('transactions.index')],
                ['label' => "Transaction #{$transaction->id}", 'url' => route('transactions.show', $transaction->id)],
            ],
        ]);
    }

    /**
     * Update the transaction status.
     */
    public function updateStatus(UpdateTransactionRequest $request, Transaction $transaction)
    {
        $data = ['status' => $request->status];

        if ($request->status !== 'pending') {
            $data['confirmed_by'] = Auth::id();
            $data['confirmed_at'] = now();
        }

        $transaction->update($data);

        return back()->with([
            'message' => "Transaction #{$transaction->id} status updated to {$request->status}",
            'status' => 'success',
        ]);
    }
}
