<?php

namespace App\Admin\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TradeCenterPost extends Model
{
    use HasFactory;

    protected $fillable = [
        'type', 'title', 'slug', 'content', 'excerpt', 'cover_image', 'featured', 'author_id', 'status', 'published_at', 'scheduled_at',
    ];

    protected $casts = [
        'featured' => 'boolean',
        'published_at' => 'datetime',
        'scheduled_at' => 'datetime',
    ];

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function getStatusLabelAttribute()
    {
        $labels = [
            'draft' => 'Draft',
            'pending' => 'Pending',
            'published' => 'Published',
            'scheduled' => 'Scheduled',
        ];

        return $labels[$this->attributes['status']] ?? ucfirst($this->attributes['status']);
    }
}
