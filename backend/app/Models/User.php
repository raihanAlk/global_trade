<?php

namespace App\Models;

use Database\Factories\user_factory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class user extends Authenticatable
{
    use HasApiTokens;
    use HasFactory;
    use Notifiable;

    protected $fillable = ['name', 'email', 'password'];

    protected $hidden = ['password', 'remember_token'];

    protected static function newFactory()
    {
        return user_factory::new();
    }

    public function reviews()
    {
        return $this->hasMany(product_review::class);
    }

    public function reports()
    {
        return $this->hasMany(chat_report::class, 'moderator_id');
    }
}
