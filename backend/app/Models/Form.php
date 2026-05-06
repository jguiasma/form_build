<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Form extends Model
{
    use HasFactory;

    protected $fillable = [
        'form_category_id',
        'form_type_id',
        'created_by',
        'title',
        'description',
        'status',
        'published_at',
    ];

    protected $casts = [
        'published_at' => 'datetime',
    ];

    public static function validationRules(): array
    {
        return [
            'form_category_id' => ['required', 'exists:form_categories,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'status' => ['sometimes', 'in:draft,published,archived'],
            'created_by' => ['nullable', 'exists:accounts,id'],
            'published_at' => ['nullable', 'date'],
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(FormCategory::class, 'form_category_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(Account::class, 'created_by');
    }

    public function steps(): HasMany
    {
        return $this->hasMany(FormStep::class)->orderBy('step_order');
    }

    public function responses(): HasMany
    {
        return $this->hasMany(FormResponse::class);
    }

    public function versions(): HasMany
    {
        return $this->hasMany(FormVersion::class);
    }
    public function type(): BelongsTo
    {
        return $this->belongsTo(FormType::class, 'form_type_id');
    }
}