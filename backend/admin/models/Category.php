<?php

namespace App\Admin\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = ['slug', 'parent_id', 'status', 'description', 'product_count'];

    protected $casts = ['product_count' => 'integer'];

    public function parent()
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(Category::class, 'parent_id');
    }

    public function products()
    {
        return $this->hasMany(Product::class);
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
