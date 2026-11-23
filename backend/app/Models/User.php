<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use App\Admin\Models\ProductReview;
use App\Admin\Models\ChatReport;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use Notifiable;

    protected $fillable = ['name', 'email', 'password'];

    protected $hidden = ['password', 'remember_token'];

    public function reviews()
    {
        return $this->hasMany(ProductReview::class);
    }

    public function reports()
    {
        return $this->hasMany(ChatReport::class, 'moderator_id');
    }
}
