<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreItemRequest;
use App\Http\Requests\UpdateItemRequest;
use App\Http\Resources\ItemResource;
use App\Models\Item;
use App\Models\Log;
use App\Services\LogService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;


class ItemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $sortField = request('sort_field', 'id');  
        $sortDirection = request('sort_direction', 'desc');
        $keyword = request('keyword');
    
        $query = Item::query()
            ->where('is_deleted', false);
    
        // Search filters safely grouped
        if (!empty($keyword)) {
            $query->where(function ($q) use ($keyword) {
                $q->where('item_name', 'like', "%{$keyword}%")
                  ->orWhere('item_description', 'like', "%{$keyword}%")
                  ->orWhere('manufacturer', 'like', "%{$keyword}%");
            });
        }

        $query->with('uploads');    
        
    
        $items = $query->orderBy($sortField, $sortDirection)
            ->paginate(20)
            ->withQueryString(); // keeps filters on pagination
    
            
        return inertia('Item/Index', [
            'items'      => ItemResource::collection($items),
            'filters'    => [
                'keyword'        => $keyword,
                'sort_field'     => $sortField,
                'sort_direction' => $sortDirection,
            ],
            'pagination' => [
                'total'      => $items->total(),
                'per_page'   => $items->perPage(),
                'current'    => $items->currentPage(),
                'last_page'  => $items->lastPage(),
            ],
            'breadcrumbs' => [
                ['label' => 'Items', 'url' => route('item.index')],
            ],
        ]);
    }
    


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
        $response = [
            "message"=>session('message'),
            "status"=>session('status'),
        ];

        return inertia('Item/Create', [
            'response'=>$response,
            'breadcrumbs' => [
                ['label' => 'Items', 'url' => route('item.index')],
                ['label' => 'Create Item', 'url' => route('item.create')],
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreItemRequest $request)
    {
        //
        $user = Auth::user();
        $data  = [
            "item_name"=>$request->item_name,
            "item_description"=>$request->item_description,
            "manufacturer"=>$request->manufacturer,
            "price"=>$request->price,
            "created_by"=>$user->id,
            "updated_by"=>$user->id,
        ];
        $item = Item::create($data);
        
        // $log = app(LogService::class)->inventory(
        //     'Item Created',
        //     'Created item '.$request->item_name,
        //     ['name'=>$request->item_name, 'price'=>$request->pricer, 'quantity'=>$request->quantity]
        // );
        
        return to_route('item.show', $item->id)->with([
            "message"=>"Item created successfully",
            "status"=>"success",
            "breadcrumbs" => [
                ['label' => 'Items', 'url' => route('item.index')],
                ['label' => 'Create Item', 'url' => route('item.create')],
            ],
        ]);

    }

    /**
     * Display the specified resource.
     */
    public function show(Item $item)
    {
        //
        $item->load(['featureSpecifications']);
        $item->load(['uploads']);
        return inertia('Item/Show', [
            'item'=>new ItemResource($item->load(['createdBy', 'updatedBy'])),
            "breadcrumbs" => [
                ['label' => 'Items', 'url' => route('item.index')],
                ['label' => 'View Item', 'url' => route('item.show', $item->id)],
            ],
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Item $item)
    {
        //
        return inertia('Item/Edit', [
            'item'=>new ItemResource($item),
            'breadcrumbs' => [
                ['label' => 'Items', 'url' => route('item.index')],
                ['label' => 'View Item', 'url' => route('item.show', $item->id)],
                ['label' => 'Edit Item', 'url' => route('item.edit', $item->id)],
            ],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateItemRequest $request, Item $item)
    {
        //

       // dd($request->all());
        $user = Auth::user();
        $data  = [
            "item_name"=>$request->item_name,
            "item_description"=>$request->item_description,
            "manufacturer"=>$request->manufacturer,
            "price"=>$request->price,
            "updated_by"=>$user->id,
        ];
        $item->update($data);
        // $log = app(LogService::class)->inventory(
        //     'Item Created',
        //     'Created item '.$request->item_name,
        //     ['name'=>$request->item_name, 'price'=>$request->pricer, 'quantity'=>$request->quantity, 'description'=>$request->item_description, 'manufacturer'=>$request->manufacturer], 
        // );

        return to_route('item.edit', $item->id)->with([
            "message"=>"Item updated successfully",
            "status"=>"success"
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Item $item)
    {
        //
        $item->is_deleted = true;
        $item->save();
        return to_route('item.index')->with([
            "message"=>"Item deleted successfully",
            "status"=>"success"
        ]);

    }

    public function createFeature($id){
        $item = Item::findOrFail($id);
        $item->load(['featureSpecifications']);
        return inertia('Item/CreateFeature', [
            "item"=>new ItemResource($item),
            'breadcrumbs' => [
                ['label' => 'Items', 'url' => route('item.index')],
                ['label' => 'View Item', 'url' => route('item.show', $item->id)],
                ['label' => 'Create Feature', 'url' => route('item.feature.create', $item->id)],
            ],
        ]);       
    }

    public function storeFeature(Request $request){
        //dd($request->all());
        $request->validate([
            "item_id"=>"required|exists:items,id",
            "features"=>"required|string",
        ]);

        $item = Item::findOrFail($request->item_id);
        //delete all current features
        $item->featureSpecifications()->delete();
       // dd($item);
        $features = explode("\n", $request->features);
        foreach($features as $feature){
            $feature = trim($feature);
            if(!empty($feature)){
                $item->featureSpecifications()->create([
                    "feature_name"=>$feature,
                ]);
            }
        }

        return to_route('item.show', $item->id)->with([
            "message"=>"Features added successfully",
            "status"=>"success"
        ]);
    }

    public function addImage($id){
        $item = Item::findOrFail($id);
        $item->load(['uploads']);
        return inertia('Item/AddImage', [
            "item"=>new ItemResource($item),
            'breadcrumbs' => [
                ['label' => 'Items', 'url' => route('item.index')],
                ['label' => 'View Item', 'url' => route('item.show', $item->id)],
                ['label' => 'Add Image', 'url' => route('item.image.add', $item->id)],
            ],
        ]);       
    }

    public function storeImage(Request $request){
        dd($request->all());
        $request->validate([
            "item_id"=>"required|exists:items,id",
            "images.*"=>"required|image|max:2048", // max 2MB per image
        ]);

        $item = Item::findOrFail($request->item_id);
       
        if($request->hasFile('images')){
            foreach($request->file('images') as $image){
                $path = $image->store('uploads/items', 'public');
                $item->uploads()->create([
                    "file_name"=>$image->getClientOriginalName(),
                    "file_path"=>$path,
                    "file_type"=>$image->getClientMimeType(),
                    "uploaded_by"=>Auth::id(),
                ]);
            }
        }

        return to_route('item.show', $item->id)->with([
            "message"=>"Images uploaded successfully",
            "status"=>"success"
        ]);
    }   
}
