<?php

namespace App\Admin\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChatReport extends Model
{
    use HasFactory;

    protected $fillable = [
        'conversation_id', 'reported_user_name', 'reporter_name', 'reason', 'status', 'notes', 'moderator_id',
    ];

    protected $casts = [
        'moderator_id' => 'integer',
    ];

    public function moderator()
    {
        return $this->belongsTo(User::class, 'moderator_id');
    }

    public function getStatusLabelAttribute()
    {
        $labels = [
            'pending' => 'Pending',
            'under_review' => 'Under Review',
            'resolved' => 'Resolved',
        ];

        return $labels[$this->attributes['status']] ?? ucfirst($this->attributes['status']);
    }
}
