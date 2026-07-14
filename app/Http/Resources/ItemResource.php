<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ItemResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'item_name' => $this->item_name,
            'item_description' => $this->item_description,
            'price' => $this->price,
            'quantity' => $this->quantity,
            'manufacturer' => $this->manufacturer,
            'status' => $this->status,
            'category' => $this->category ? new ItemCategoryResource($this->category) : null,
            'uploads' => UploadResource::collection($this->whenLoaded('uploads')),
            'item_details' => ItemDetailResource::collection($this->whenLoaded('itemDetails')),
            "created_by" => $this->createdBy ? new UserBaseResource($this->createdBy) : null,
            "updated_by" => $this->updatedBy ? new UserBaseResource($this->updated):null
        ];
    }
}
