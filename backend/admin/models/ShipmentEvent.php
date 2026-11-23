<?php

namespace App\Admin\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShipmentEvent extends Model
{
    use HasFactory;

    protected $fillable = ['shipment_id', 'event', 'occurred_at', 'note'];

    protected $casts = [
        'occurred_at' => 'datetime',
    ];

    public function shipment()
    {
        return $this->belongsTo(Shipment::class);
    }
}
