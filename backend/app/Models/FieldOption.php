<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FieldOption extends Model
{
    use HasFactory;

    protected $fillable = [
        'field_id',
        'label',
        'value',
        'option_order',
    ];

    public static function validationRules(): array
    {
        return [
            'field_id' => ['required', 'exists:form_fields,id'],
            'label' => ['required', 'string', 'max:255'],
            'value' => ['required', 'string', 'max:255'],
            'option_order' => ['nullable', 'integer', 'min:1'],
        ];
    }

    public function field(): BelongsTo
    {
        return $this->belongsTo(FormField::class, 'field_id');
    }
}
