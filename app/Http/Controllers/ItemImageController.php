<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\Upload;
use App\Services\CloudinaryService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ItemImageController extends Controller
{
    public function store(
        
        Request $request,
        Item $item,
        CloudinaryService $cloudinary
    ) {

    
        $request->validate([
            'images' => ['required', 'array'],
            'images.*' => ['image', 'max:2048'],
        ]);

        $existingCount = $item->uploads()->count();
        $incomingCount = count($request->images);

        if (($existingCount + $incomingCount) > 5) {
            return back()->withErrors([
                'images' => 'Maximum of 5 images allowed per item.',
            ]);
        }

        DB::transaction(function () use (
            $request,
            $item,
            $cloudinary,
            $existingCount
        ) {
            foreach ($request->file('images') as $index => $file) {
              // // dd($file);
              // dd($cloudinary);
                $uploaded = $cloudinary->upload($file, 'ovey_store');

                Upload::create([
                    'item_id' => $item->id,
                    'file_path' => $uploaded['url'],
                    'public_id' => $uploaded['public_id'],
                    'position' => $existingCount + $index,
                    'is_primary' => $item->uploads()->count() === 0,
                ]);
            }
        });

        return back()->with('success', 'Images uploaded successfully.');
    }

    public function destroy(
        Upload $image,
        CloudinaryService $cloudinary
    ) {
        DB::transaction(function () use ($image, $cloudinary) {
            $cloudinary->delete($image->public_id);
            $image->delete();
        });

        return back()->with('success', 'Image deleted.');
    }

    public function setPrimary(Upload $image)
    {
        DB::transaction(function () use ($image) {
            Upload::where('item_id', $image->item_id)
                ->update(['is_primary' => false]);

            $image->update(['is_primary' => true]);
        });

        return back()->with('success', 'Primary image updated.');
    }

    public function reorder(Request $request, Item $item)
    {
        $request->validate([
            'order' => ['required', 'array'],
        ]);

        DB::transaction(function () use ($request, $item) {
            foreach ($request->order as $index => $id) {
                Upload::where('id', $id)
                    ->where('item_id', $item->id)
                    ->update(['position' => $index]);
            }
        });

        return back()->with('success', 'Images reordered.');
    }
}