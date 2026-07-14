<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreItemCategoryRequest;
use App\Http\Requests\UpdateItemCategoryRequest;
use App\Http\Resources\ItemCategoryResource;
use App\Models\ItemCategory;

class ItemCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $sortField = request('sort_field', 'id');
        $sortDirection = request('sort_direction', 'desc');
        $keyword = request('keyword');

        $query = ItemCategory::query();

        if (!empty($keyword)) {
            $query->where('name', 'like', "%{$keyword}%");
        }

        $categories = $query->orderBy($sortField, $sortDirection)
            ->paginate(20)
            ->withQueryString();

        return inertia('ItemCategory/Index', [
            'categories'  => ItemCategoryResource::collection($categories),
            'filters'     => [
                'keyword'        => $keyword,
                'sort_field'     => $sortField,
                'sort_direction' => $sortDirection,
            ],
            'pagination' => [
                'total'      => $categories->total(),
                'per_page'   => $categories->perPage(),
                'current'    => $categories->currentPage(),
                'last_page'  => $categories->lastPage(),
            ],
            'breadcrumbs' => [
                ['label' => 'Item Categories', 'url' => route('item-category.index')],
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia('ItemCategory/Create', [
            'breadcrumbs' => [
                ['label' => 'Item Categories', 'url' => route('item-category.index')],
                ['label' => 'Create Category', 'url' => route('item-category.create')],
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreItemCategoryRequest $request)
    {
        ItemCategory::create($request->validated());

        return to_route('item-category.index')->with([
            'message' => 'Category created successfully',
            'status'  => 'success',
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(ItemCategory $itemCategory)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ItemCategory $itemCategory)
    {
        return inertia('ItemCategory/Edit', [
            'category' => new ItemCategoryResource($itemCategory),
            'breadcrumbs' => [
                ['label' => 'Item Categories', 'url' => route('item-category.index')],
                ['label' => 'Edit Category', 'url' => route('item-category.edit', $itemCategory->id)],
            ],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateItemCategoryRequest $request, ItemCategory $itemCategory)
    {
        $itemCategory->update($request->validated());

        return to_route('item-category.index')->with([
            'message' => 'Category updated successfully',
            'status'  => 'success',
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ItemCategory $itemCategory)
    {
        $itemCategory->delete();

        return to_route('item-category.index')->with([
            'message' => 'Category deleted successfully',
            'status'  => 'success',
        ]);
    }
}
