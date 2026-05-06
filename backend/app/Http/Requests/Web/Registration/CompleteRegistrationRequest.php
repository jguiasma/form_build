<?php

namespace App\Http\Requests\Web\Registration;

use Illuminate\Foundation\Http\FormRequest;

class CompleteRegistrationRequest extends FormRequest
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
            'email'          => ['required', 'string', 'email', 'max:254'],
            'verification_token' => ['required', 'string'],
            'name'           => ['required', 'string', 'max:255'],
            'specialty'      => ['required', 'string', 'max:255'],
            'phone_number'   => ['required', 'string', 'max:20'],
            'avatar'         => ['nullable', 'string'], // Could be a preset URL
            'photo'          => ['nullable', 'image', 'max:2048'], // Allowed upload
        ];
    }
}
