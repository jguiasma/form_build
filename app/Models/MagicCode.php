<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MagicCode extends Model
{
  use HasFactory;

    protected $fillable = [
        'email',
        'code',
        'expiration_date',
        'is_valid',
        'verified_at',
    ];

    protected $casts = [
        'expiration_date' => 'datetime',
        'verified_at' => 'datetime',
        'is_valid' => 'boolean',
    ];

    public function isExpired(): bool
    {
        return $this->expiration_date->isPast();
    }
}
