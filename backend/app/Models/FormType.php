<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FormType extends Model
{
    use HasFactory;

    protected $fillable = [
        'form_category_id',
        'name',
        'description',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public static function validationRules(): array
    {
        return [
            'form_category_id' => ['required', 'exists:form_categories,id'],
            'name'             => ['required', 'string', 'max:255'],
            'description'      => ['nullable', 'string'],
            'is_active'        => ['sometimes', 'boolean'],
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(FormCategory::class, 'form_category_id');
    }

    public function forms(): HasMany
    {
        return $this->hasMany(Form::class, 'form_type_id');
    }
}