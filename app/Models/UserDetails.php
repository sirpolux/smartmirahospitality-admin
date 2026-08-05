<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserDetails extends Model
{
    /** @use HasFactory<\Database\Factories\UserDetailsFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'phone',
        'company_name',
        'company_role',
        'address',
        'city',
        'state',
        'business_type',
        'is_profile_complete',
    ];

    protected $casts = [
        'is_profile_complete' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
