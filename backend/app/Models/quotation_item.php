<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class quotation_item extends Model
{
    use HasFactory;

    protected $fillable = [
        'quotation_id', 'product_id', 'product_name', 'quantity', 'unit_price', 'currency', 'total', 'notes',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'unit_price' => 'decimal:2',
        'total' => 'decimal:2',
    ];

    public function quotation()
    {
        return $this->belongsTo(quotation::class, 'quotation_id');
    }

    public function product()
    {
        return $this->belongsTo(product::class);
    }
}
