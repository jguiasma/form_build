<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Pack extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'amount',
        'duration_days',
    ];

    public static function validationRules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'amount' => ['required', 'numeric', 'min:0'],
            'duration_days' => ['required', 'integer', 'min:1'],
        ];
    }

    public function subscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class);
    }
    public function formFields(): BelongsToMany
    {
        return $this->belongsToMany(FormField::class, 'form_field_pack', 'pack_id', 'form_field_id');
    }
}
