<?php

namespace App\Admin\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Quotation extends Model
{
    use HasFactory;

    protected $fillable = [
        'supplier_company_id', 'importer_company_id', 'currency', 'validity_date', 'status', 'expires_at', 'notes',
    ];

    protected $casts = [
        'validity_date' => 'date',
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
        return $this->hasMany(QuotationItem::class);
    }

    public function getStatusLabelAttribute()
    {
        $labels = [
            'draft' => 'Draft',
            'sent' => 'Sent',
            'accepted' => 'Accepted',
            'rejected' => 'Rejected',
            'expired' => 'Expired',
        ];

        return $labels[$this->attributes['status']] ?? ucfirst($this->attributes['status']);
    }
}
