<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TransactionResource extends JsonResource
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
            'amount' => $this->amount,
            'description' => $this->description,
            'status' => $this->status,
            'purpose' => $this->purpose,
            'confirmed_by' => $this->whenLoaded('confirmedBy', fn () => new UserBaseResource($this->confirmedBy)),
            'confirmed_at' => $this->confirmed_at,
            'created_at' => $this->created_at,
            'user' => $this->whenLoaded('user', fn () => new UserBaseResource($this->user)),
            'order' => $this->whenLoaded('order', fn () => new OrderResource($this->order)),
            'uploads' => UploadResource::collection($this->whenLoaded('uploads')),
        ];
    }
}
