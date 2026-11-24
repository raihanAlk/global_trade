<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class rfq_request extends Model
{
    use HasFactory;

    protected $table = 'rfq_requests';

    protected $fillable = [
        'supplier_company_id',
        'importer_company_id',
        'destination_country',
        'quantity',
        'status',
        'expires_at',
        'notes',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'expires_at' => 'date',
    ];

    public function supplier()
    {
        return $this->belongsTo(company::class, 'supplier_company_id');
    }

    public function importer()
    {
        return $this->belongsTo(company::class, 'importer_company_id');
    }

    public function items()
    {
        return $this->hasMany(rfq_item::class, 'rfq_id');
    }

    protected function statusLabel(): Attribute
    {
        $labels = [
            'draft' => 'Draft',
            'pending' => 'Pending',
            'approved' => 'Approved',
            'negotiating' => 'Negotiating',
            'closed' => 'Closed',
        ];

        return Attribute::get(fn () => $labels[$this->attributes['status']] ?? ucfirst($this->attributes['status']));
    }
}
