<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartResource extends JsonResource
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
            'total_quantity' => $this->total_quantity,
            'total_price' => $this->total_price,
            'status' => $this->status,
            'created_at' => $this->created_at,
            'user' => $this->user ? new UserBaseResource($this->user) : null,
            'items' => CartItemResource::collection($this->whenLoaded('items')),
        ];
    }
}
