<?php

namespace App\Admin\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RFQItem extends Model
{
    use HasFactory;

    protected $table = 'rfq_items';

    protected $fillable = [
        'rfq_id', 'product_id', 'product_name', 'quantity', 'unit_price', 'currency', 'notes',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'unit_price' => 'decimal:2',
    ];

    public function rfq()
    {
        return $this->belongsTo(RFQRequest::class, 'rfq_id');
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
