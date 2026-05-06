<?php

namespace App\Http\Requests\Web\Registration;

use Illuminate\Foundation\Http\FormRequest;

class VerifyMagicCodeRequest extends FormRequest
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
            'email' => ['required', 'string', 'email', 'max:254'],
            'code'  => ['required', 'string', 'size:6'],
        ];
    }
}
