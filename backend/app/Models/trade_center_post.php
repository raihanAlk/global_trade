<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class trade_center_post extends Model
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
        return $this->belongsTo(user::class, 'author_id');
    }

    protected function statusLabel(): Attribute
    {
        $labels = [
            'draft' => 'Draft',
            'pending' => 'Pending',
            'published' => 'Published',
            'scheduled' => 'Scheduled',
        ];

        return Attribute::get(fn () => $labels[$this->attributes['status']] ?? ucfirst($this->attributes['status']));
    }
}
