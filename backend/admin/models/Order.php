<?php

namespace App\Admin\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'transaction_no', 'buyer_company_id', 'seller_company_id', 'total_value', 'currency', 'order_date', 'status', 'expected_delivery',
    ];

    protected $casts = [
        'total_value' => 'decimal:2',
        'order_date' => 'date',
        'expected_delivery' => 'date',
    ];

    public function buyer()
    {
        return $this->belongsTo(Company::class, 'buyer_company_id');
    }

    public function seller()
    {
        return $this->belongsTo(Company::class, 'seller_company_id');
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function getStatusLabelAttribute()
    {
        $labels = [
            'pending' => 'Pending',
            'confirmed' => 'Confirmed',
            'shipped' => 'Shipped',
            'delivered' => 'Delivered',
            'cancelled' => 'Cancelled',
        ];

        return $labels[$this->attributes['status']] ?? ucfirst($this->attributes['status']);
    }
}
