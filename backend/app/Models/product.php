<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price',
        'currency',
        'moq',
        'origin_country',
        'category_id',
        'company_id',
        'status',
        'reviewed_by',
        'reviewed_at',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'moq' => 'integer',
    ];

    public function category()
    {
        return $this->belongsTo(category::class);
    }

    public function company()
    {
        return $this->belongsTo(company::class);
    }

    public function images()
    {
        return $this->hasMany(product_image::class);
    }

    public function reviews()
    {
        return $this->hasMany(product_review::class);
    }

    public function rfq_items()
    {
        return $this->hasMany(rfq_item::class, 'rfq_id');
    }

    public function quotation_items()
    {
        return $this->hasMany(quotation_item::class, 'quotation_id');
    }

    public function order_items()
    {
        return $this->hasMany(order_item::class, 'order_id');
    }

    protected function statusLabel(): Attribute
    {
        $labels = [
            'draft' => 'Draft',
            'pending_review' => 'Pending Review',
            'approved' => 'Approved',
            'rejected' => 'Rejected',
            'changes_requested' => 'Changes Requested',
        ];

        return Attribute::get(fn () => $labels[$this->attributes['status']] ?? ucfirst($this->attributes['status']));
    }
}
