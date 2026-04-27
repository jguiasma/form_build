<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Role extends Model
{
    use HasFactory;

    protected $fillable = ['type'];

    public function accounts(): HasMany
    {
        return $this->hasMany(Account::class);
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }
}
