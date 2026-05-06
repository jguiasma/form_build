<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ReorderStepsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // We'll handle authorization in the policy/controller
    }

    public function rules(): array
    {
        return [
            'steps' => 'required|array',
            'steps.*.id' => 'required|exists:form_steps,id',
            'steps.*.step_order' => 'required|integer|min:1',
        ];
    }
}
