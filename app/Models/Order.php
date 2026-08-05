<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    /** @use HasFactory<\Database\Factories\OrderFactory> */
    use HasFactory;
    protected $fillable = [
        'user_id',
        'total_quantity',
        'total_price',
        'status',
        'delivery_channel',
        'delivery_confirmed_by',
        'delivered_by',
        'contact_number',
        'delivery_address',
        'delivery_state',
        'receipt_ref',
        'generated_at',
    ];

    protected $casts = [
        'total_quantity' => 'integer',
        'total_price' => 'float',
    ];

    public const STATUS_PENDING = 'pending';
    public const STATUS_RECEIVED = 'received';
    public const STATUS_PACKAGED = 'packaged';
    public const STATUS_SHIPPED = 'shipped';
    public const STATUS_DELIVERED = 'delivered';
    public const STATUS_CANCELLED = 'cancelled';

    /**
     * Ordered tracking stages; entries after the current status are "upcoming".
     */
    public const TRACKING_STAGES = [
        self::STATUS_RECEIVED,
        self::STATUS_PACKAGED,
        self::STATUS_SHIPPED,
        self::STATUS_DELIVERED,
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class, 'order_id');
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class, 'order_id');
    }

    /**
     * The order tracking index: 0 when payment is not yet confirmed.
     */
    public function trackingIndex(): int
    {
        if (!in_array($this->status, self::TRACKING_STAGES, true)) {
            return 0;
        }

        return array_search($this->status, self::TRACKING_STAGES, true) + 1;
    }
}
