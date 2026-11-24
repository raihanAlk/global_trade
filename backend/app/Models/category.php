<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class category extends Model
{
    use HasFactory;

    protected $fillable = ['slug', 'parent_id', 'status', 'description', 'product_count'];

    protected $casts = ['product_count' => 'integer'];

    public function parent()
    {
        return $this->belongsTo(category::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(category::class, 'parent_id');
    }

    public function products()
    {
        return $this->hasMany(product::class);
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
