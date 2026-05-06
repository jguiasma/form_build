<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Subscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'account_id',
        'pack_id',
        'validation_date',
    ];

    protected $casts = [
        'validation_date' => 'date',
    ];

    public static function validationRules(): array
    {
        return [
            'account_id' => ['required', 'exists:accounts,id'],
            'pack_id' => ['required', 'exists:packs,id'],
            'validation_date' => ['required', 'date'],
        ];
    }

    public function account(): BelongsTo
    {
        return $this->belongsTo(Account::class);
    }

    public function pack(): BelongsTo
    {
        return $this->belongsTo(Pack::class);
    }
}
