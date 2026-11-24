<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class quotation extends Model
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
        return $this->belongsTo(company::class, 'supplier_company_id');
    }

    public function importer()
    {
        return $this->belongsTo(company::class, 'importer_company_id');
    }

    public function items()
    {
        return $this->hasMany(quotation_item::class);
    }

    protected function statusLabel(): Attribute
    {
        $labels = [
            'draft' => 'Draft',
            'sent' => 'Sent',
            'accepted' => 'Accepted',
            'rejected' => 'Rejected',
            'expired' => 'Expired',
        ];

        return Attribute::get(fn () => $labels[$this->attributes['status']] ?? ucfirst($this->attributes['status']));
    }
}
