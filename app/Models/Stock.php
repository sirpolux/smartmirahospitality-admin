<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Stock extends Model
{
    /** @use HasFactory<\Database\Factories\StockFactory> */
    use HasFactory;
    protected $fillable = [
        'item_id',
        'quantity',
        'buying_price',
        'supplied_by',
        'added_by',
        'updated_by',
    ];


    public function item()
    {
        return $this->belongsTo(Item::class, 'item_id');
    }

    public function addedBy()
    {
        return $this->belongsTo(User::class, 'added_by');
    }
}
