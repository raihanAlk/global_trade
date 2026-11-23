<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VerificationDocument extends Model
{
    protected $fillable = ['verification_submission_id', 'document_type', 'original_name', 'file_path', 'mime_type', 'review_status', 'review_note'];
}
