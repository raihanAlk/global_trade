<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class chat_report extends Model
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
        return $this->belongsTo(user::class, 'moderator_id');
    }

    protected function statusLabel(): Attribute
    {
        $labels = [
            'pending' => 'Pending',
            'under_review' => 'Under Review',
            'resolved' => 'Resolved',
        ];

        return Attribute::get(fn () => $labels[$this->attributes['status']] ?? ucfirst($this->attributes['status']));
    }
}
