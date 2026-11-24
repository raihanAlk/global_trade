<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class rfq_item extends Model
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
        return $this->belongsTo(rfq_request::class, 'rfq_id');
    }

    public function product()
    {
        return $this->belongsTo(product::class);
    }
}
