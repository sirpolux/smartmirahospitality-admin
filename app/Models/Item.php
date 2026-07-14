<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    /** @use HasFactory<\Database\Factories\ItemFactory> */
    use HasFactory;

    protected $fillable = [
        'item_name',
        'item_description',
        'price',
        'category_id',
        'manufacturer',
        'status',
        'deleted',
        'created_by',
        'updated_by',
    ];  

    public function uploads()
    {
        return $this->hasMany(Upload::class, 'item_id');
    }

    public function itemDetails()
    {
        return $this->hasMany(ItemDetail::class, 'item_id');
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }   

    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function stocks()
    {
        return $this->hasMany(Stock::class, 'item_id');
    }

    public function category()
    {
        return $this->belongsTo(ItemCategory::class, 'category_id');
    }
}
