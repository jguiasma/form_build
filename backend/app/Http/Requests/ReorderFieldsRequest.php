<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ReorderFieldsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Use policy for auth
    }

    public function rules(): array
    {
        return [
            'fields' => 'required|array',
            'fields.*.id' => 'required|exists:form_fields,id',
            'fields.*.field_order' => 'required|integer|min:1',
            'fields.*.column_index' => 'nullable|integer|min:1',
        ];
    }
}
