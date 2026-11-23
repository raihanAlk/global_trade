<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VerificationStatusHistory extends Model
{
    protected $fillable = ['verification_submission_id', 'from_status', 'to_status', 'notes', 'changed_by'];
}
