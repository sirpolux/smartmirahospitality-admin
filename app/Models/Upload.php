<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Upload extends Model
{
    /** @use HasFactory<\Database\Factories\UploadFactory> */
    use HasFactory;

    protected $fillable = [
        'item_id',
        'transaction_id',
        'file_path',
        'file_type',
        'public_id',
        'is_primary',
        'position',
        'uploaded_by',
    ];

    protected $casts = [
        'is_primary' => 'boolean',
        'position'   => 'integer',
    ];

    public function item()
    {
        return $this->belongsTo(Item::class, 'item_id');
    }

    public function uploadedBy()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
}
