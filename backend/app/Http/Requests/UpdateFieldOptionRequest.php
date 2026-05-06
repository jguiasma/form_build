<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateFieldOptionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'label'        => 'sometimes|string|max:255',
            'value'        => ['sometimes', 'string', 'max:255', 'regex:/^[a-zA-Z0-9_]+$/'],
            'option_order' => 'sometimes|integer|min:1',
        ];
    }

    public function messages(): array
    {
        return [
            'value.regex' => 'Option value may only contain letters, numbers, and underscores.',
        ];
    }
}
