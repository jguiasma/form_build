<?php

namespace App\Http\Requests\Web\Profile;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProfileRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'sometimes|required|string|min:2|max:100',
            'phone_number' => ['sometimes', 'required', 'string', 'regex:/^\+?[0-9]{7,15}$/'],
            'specialty' => 'sometimes|required|string|min:2|max:100',
            'avatar' => 'sometimes|required|string',
        ];
    }
}
