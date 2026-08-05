<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
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
            'delivery_channel' => $this->delivery_channel,
            'delivery_confirmed_by' => $this->delivery_confirmed_by,
            'delivered_by' => $this->delivered_by,
            'contact_number' => $this->contact_number,
            'delivery_address' => $this->delivery_address,
            'delivery_state' => $this->delivery_state,
            'receipt_ref' => $this->receipt_ref,
            'generated_at' => $this->generated_at,
            'created_at' => $this->created_at,
            'user' => $this->whenLoaded('user', fn () => new UserBaseResource($this->user)),
            'items' => OrderItemResource::collection($this->whenLoaded('items')),
            'transactions' => TransactionResource::collection($this->whenLoaded('transactions')),
        ];
    }
}
