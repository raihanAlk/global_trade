<?php

namespace App\Admin\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Shipment extends Model
{
    use HasFactory;

    protected $fillable = [
        'tracking_number', 'origin_city', 'origin_country', 'destination_city', 'destination_country', 'estimated_arrival', 'status', 'current_location', 'notes',
    ];

    protected $casts = [
        'estimated_arrival' => 'date',
    ];

    public function events()
    {
        return $this->hasMany(ShipmentEvent::class);
    }

    public function getStatusLabelAttribute()
    {
        $labels = [
            'pending' => 'Pending',
            'in_transit' => 'In Transit',
            'delivered' => 'Delivered',
            'exception' => 'Exception',
            'cancelled' => 'Cancelled',
        ];

        return $labels[$this->attributes['status']] ?? ucfirst($this->attributes['status']);
    }
}
