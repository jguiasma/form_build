<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FormStep extends Model
{
    use HasFactory;

    protected $fillable = [
        'form_id',
        'title',
        'description',
        'step_order',
        'is_required',
    ];

    protected $casts = [
        'is_required' => 'boolean',
    ];

    public static function validationRules($id = null): array
    {
        return [
            'form_id' => $id ? 'sometimes|exists:forms,id' : 'required|exists:forms,id',
            'title' => ['required', 'string', 'min:2', 'max:100'],
            'description' => ['nullable', 'string'],
            'step_order' => ['nullable', 'integer', 'min:1'],
            'is_required' => ['sometimes', 'boolean'],
        ];
    }

    public function form(): BelongsTo
    {
        return $this->belongsTo(Form::class);
    }

    public function fields(): HasMany
    {
        return $this->hasMany(FormField::class, 'step_id')->orderBy('field_order');
    }
}
