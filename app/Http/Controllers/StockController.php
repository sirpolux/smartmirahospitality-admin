<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreStockRequest;
use App\Http\Requests\UpdateStockRequest;
use App\Http\Resources\ItemBaseResource;
use App\Http\Resources\ItemResource;
use App\Models\Item;
use App\Models\Stock;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\StreamedResponse;

class StockController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $keyword       = request('keyword');
        $startDate     = request('start_date');
        $endDate       = request('end_date');
        $perPage       = request('per_page', 20);
        $sortField     = request('sort_field', 'created_at');
        $sortDirection = request('sort_direction', 'desc');

        $query = Stock::query()
            ->with(['item', 'addedBy']) // assuming addedBy() relationship exists
            ->when($keyword, function ($q) use ($keyword) {
                $q->whereHas('item', function ($itemQuery) use ($keyword) {
                    $itemQuery->where('item_name', 'like', "%{$keyword}%")
                        ->orWhere('manufacturer', 'like', "%{$keyword}%");
                })
                    ->orWhereHas('addedBy', function ($userQuery) use ($keyword) {
                        $userQuery->where('name', 'like', "%{$keyword}%");
                    });
            })
            ->when($startDate, function ($q) use ($startDate) {
                $q->whereDate('created_at', '>=', $startDate);
            })
            ->when($endDate, function ($q) use ($endDate) {
                $q->whereDate('created_at', '<=', $endDate);
            });

        $stocks = $query
            ->orderBy($sortField, $sortDirection)
            ->paginate($perPage)
            ->withQueryString();

        return inertia('Stock/Index', [
            'stocks' => $stocks->through(fn($stock) => [
                'id'         => $stock->id,
                'item_name'  => $stock->item?->item_name,
                'quantity'   => $stock->quantity,
                'price'      => $stock->price,
                'added_by'   => $stock->addedBy?->name,
                'created_at' => $stock->created_at->format('Y-m-d'),
            ]),

            'queryParams' => [
                'keyword'        => $keyword,
                'start_date'     => $startDate,
                'end_date'       => $endDate,
                'per_page'       => $perPage,
                'sort_field'     => $sortField,
                'sort_direction' => $sortDirection,
            ],

            'pagination' => [
                'total'      => $stocks->total(),
                'per_page'   => $stocks->perPage(),
                'current'    => $stocks->currentPage(),
                'last_page'  => $stocks->lastPage(),
            ],

            'breadcrumbs' => [
                ['label' => 'Stocks', 'url' => route('stock.index')],
            ],
        ]);
    }



    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
        $items = Item::select('id', 'item_name')->where('deleted', false)->get();
        return inertia('Stock/Create', [
            'items' =>  ItemBaseResource::collection($items),
            "breadcrumbs" => [
                ['label' => 'Stocks', 'url' => route('stock.index')],
                ['label' => 'Add Stock', 'url' => route('stock.create')],
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreStockRequest $request)
    {
        //
        //dd($request->all());
        $user = Auth::user();
        $data = [
            'item_id' => $request->item_id,
            'quantity' => $request->quantity,
            'price' => $request->price, 
            'status' => $request->status ?? 'IN_STOCK',
           'supplier' => $request->supplied_by ?? 'Self Purchase',
            'added_by' => $user->id,
        ];
        $stock = Stock::create($data);
        //update item quantity
        $item = $stock->item;
        $item->quantity += $stock->quantity;
        $item->status = "IN_STOCK";
        $item->save();
        return redirect()->route('stock.index')->with('message', 'Stock added successfully')->with('status', 'success');
    }

    /**
     * Display the specified resource.
     */
    public function show(Stock $stock)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Stock $stock)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateStockRequest $request, Stock $stock)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Stock $stock)
    {
        //
    }

    public function export()
    {
      
        $keyword       = request('keyword');
        $startDate     = request('start_date');
        $endDate       = request('end_date');
        $sortField     = request('sort_field', 'created_at');
        $sortDirection = request('sort_direction', 'desc');

        $query = Stock::query()
            ->with(['item', 'addedBy'])
            ->when($keyword, function ($q) use ($keyword) {
                $q->whereHas('item', function ($itemQuery) use ($keyword) {
                    $itemQuery->where('item_name', 'like', "%{$keyword}%")
                        ->orWhere('manufacturer', 'like', "%{$keyword}%");
                })
                    ->orWhereHas('addedBy', function ($userQuery) use ($keyword) {
                        $userQuery->where('name', 'like', "%{$keyword}%");
                    });
            })
            ->when(
                $startDate,
                fn($q) => 
                $q->whereDate('created_at', '>=', $startDate)
            )
            ->when(
                $endDate,
                fn($q) =>
                $q->whereDate('created_at', '<=', $endDate)
            )
            ->orderBy($sortField, $sortDirection);

        return new StreamedResponse(function () use ($query) {
            $handle = fopen('php://output', 'w');

            // CSV Header
            fputcsv($handle, [
                'Item Name',
                'Quantity',
                'Price',
                'Added By',
                'Date Added',
            ]);

            $query->chunk(500, function ($stocks) use ($handle) {
                foreach ($stocks as $stock) {
                    fputcsv($handle, [
                        $stock->item?->item_name,
                        $stock->quantity,
                        $stock->price,
                        $stock->addedBy?->name,
                        $stock->created_at->format('Y-m-d'),
                    ]);
                }
            });

            fclose($handle);
        }, 200, [
            'Content-Type'        => 'text/csv',
            'Content-Disposition' => 'attachment; filename=stocks_export.csv',
        ]);
    }
}
