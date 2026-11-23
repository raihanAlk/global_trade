<?php

namespace App\Admin\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RFQRequest extends Model
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
        return $this->belongsTo(Company::class, 'supplier_company_id');
    }

    public function importer()
    {
        return $this->belongsTo(Company::class, 'importer_company_id');
    }

    public function items()
    {
        return $this->hasMany(RFQItem::class, 'rfq_id');
    }

    public function getStatusLabelAttribute()
    {
        $labels = [
            'draft' => 'Draft',
            'pending' => 'Pending',
            'approved' => 'Approved',
            'negotiating' => 'Negotiating',
            'closed' => 'Closed',
        ];

        return $labels[$this->attributes['status']] ?? ucfirst($this->attributes['status']);
    }
}
