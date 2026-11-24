<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Business extends Model
{
    protected $fillable = ['legal_name', 'display_name', 'country', 'business_type', 'registration_number', 'email', 'phone', 'website', 'address', 'description', 'verification_status'];

    public function memberships() { return $this->hasMany(BusinessMembership::class); }
    public function verificationSubmissions() { return $this->hasMany(VerificationSubmission::class); }
}
