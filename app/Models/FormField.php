<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class FormField extends Model
{
    use HasFactory;

    protected $fillable = [
        'step_id',
        'label',
        'field_key',
        'type',
        'placeholder',
        'default_value',
        'description',
        'custom_error_message',
        'is_required',
        'validation_rules',
        'field_order',
        'column_index',
        'column_span',
        'is_palette_component',
    ];

    protected $casts = [
        'validation_rules' => 'array',
        'is_required' => 'boolean',
        'is_palette_component' => 'boolean',
    ];

    public static function validationRules(): array
    {
        return [
            'step_id' => ['nullable', 'exists:form_steps,id'],
            'label' => ['required', 'string', 'max:255'],
            'field_key' => ['required', 'string', 'max:255'],
            'type' => ['required', 'string', 'in:text,textarea,number,email,password,select,radio,checkbox,date,file,submit,signature,phone,divider,rating,url,location,voice,payment,spacer,grouped'],
            'placeholder' => ['nullable', 'string', 'max:255'],
            'default_value' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'custom_error_message' => ['nullable', 'string', 'max:255'],
            'is_required' => ['sometimes', 'boolean'],
            'validation_rules' => ['nullable', 'array'],
            'field_order' => ['nullable', 'integer', 'min:1'],
            'column_index' => ['nullable', 'integer', 'min:1'],
            'column_span' => ['nullable', 'integer', 'min:1'],
            'is_palette_component' => ['sometimes', 'boolean'],
        ];
    }

    public function step(): BelongsTo
    {
        return $this->belongsTo(FormStep::class, 'step_id');
    }

    public function options(): HasMany
    {
        return $this->hasMany(FieldOption::class, 'field_id')->orderBy('option_order');
    }

    public function answers(): HasMany
    {
        return $this->hasMany(FormAnswer::class, 'field_id');
    }

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(FormCategory::class, 'form_field_category', 'form_field_id', 'form_category_id');
    }

    public function packs(): BelongsToMany
    {
        return $this->belongsToMany(Pack::class, 'form_field_pack', 'form_field_id', 'pack_id');
    }
}
