<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class company extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'type', 'email', 'phone', 'address', 'city', 'country', 'website', 'status',
    ];

    protected $casts = [
        'id' => 'integer',
    ];

    public function products()
    {
        return $this->hasMany(product::class);
    }

    public function rfq_requests()
    {
        return $this->hasMany(rfq_request::class, 'supplier_company_id');
    }

    public function importer_rfqs()
    {
        return $this->hasMany(rfq_request::class, 'importer_company_id');
    }

    public function quotations()
    {
        return $this->hasMany(quotation::class, 'supplier_company_id');
    }

    public function importer_quotations()
    {
        return $this->hasMany(quotation::class, 'importer_company_id');
    }

    public function buyer_orders()
    {
        return $this->hasMany(order::class, 'buyer_company_id');
    }

    public function seller_orders()
    {
        return $this->hasMany(order::class, 'seller_company_id');
    }

    protected function statusLabel(): Attribute
    {
        $labels = [
            'active' => 'Active',
            'inactive' => 'Inactive',
        ];

        return Attribute::get(fn () => $labels[$this->attributes['status']] ?? ucfirst($this->attributes['status']));
    }
}
