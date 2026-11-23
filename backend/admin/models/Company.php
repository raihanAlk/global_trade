<?php

namespace App\Admin\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Company extends Model
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
        return $this->hasMany(Product::class);
    }

    public function rfqRequests()
    {
        return $this->hasMany(RFQRequest::class, 'supplier_company_id');
    }

    public function importerRFQs()
    {
        return $this->hasMany(RFQRequest::class, 'importer_company_id');
    }

    public function quotations()
    {
        return $this->hasMany(Quotation::class, 'supplier_company_id');
    }

    public function importerQuotations()
    {
        return $this->hasMany(Quotation::class, 'importer_company_id');
    }

    public function buyerOrders()
    {
        return $this->hasMany(Order::class, 'buyer_company_id');
    }

    public function sellerOrders()
    {
        return $this->hasMany(Order::class, 'seller_company_id');
    }

    public function getStatusLabelAttribute()
    {
        $labels = [
            'active' => 'Active',
            'inactive' => 'Inactive',
        ];

        return $labels[$this->attributes['status']] ?? ucfirst($this->attributes['status']);
    }
}
