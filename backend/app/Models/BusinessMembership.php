<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BusinessMembership extends Model
{
    protected $fillable = ['business_id', 'user_id', 'membership_role', 'status'];
    public function business() { return $this->belongsTo(Business::class); }
    public function user() { return $this->belongsTo(User::class); }
}
