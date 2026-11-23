<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VerificationSubmission extends Model
{
    protected $fillable = ['business_id', 'submitted_by', 'status', 'admin_notes', 'request_message', 'reviewed_by', 'reviewed_at'];
    protected $casts = ['reviewed_at' => 'datetime'];
    public function business() { return $this->belongsTo(Business::class); }
    public function documents() { return $this->hasMany(VerificationDocument::class); }
    public function histories() { return $this->hasMany(VerificationStatusHistory::class); }
}
