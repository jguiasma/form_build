<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreFieldOptionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'label'        => 'required|string|max:255',
            'value'        => ['required', 'string', 'max:255', 'regex:/^[a-zA-Z0-9_]+$/'],
            'option_order' => 'nullable|integer|min:1',
        ];
    }

    public function messages(): array
    {
        return [
            'value.regex' => 'Option value may only contain letters, numbers, and underscores.',
        ];
    }
}
