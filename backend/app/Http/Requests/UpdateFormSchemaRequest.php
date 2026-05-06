<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateFormSchemaRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Allowed as long as authenticated through API routes
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'require_biometrics' => 'nullable|boolean',
            'steps' => 'present|array',
            'steps.*.id' => 'nullable',
            'steps.*.title' => 'required|string|max:255',
            'steps.*.description' => 'nullable|string',
            'steps.*.step_order' => 'required|integer|min:1',
            'steps.*.is_required' => 'nullable|boolean',
            'steps.*.fields' => 'present|array',
            'steps.*.fields.*.id' => 'nullable',
            'steps.*.fields.*.label' => 'required|string|max:255',
            'steps.*.fields.*.field_key' => 'required|string|max:255',
            'steps.*.fields.*.type' => 'required|string|in:text,textarea,number,email,password,select,radio,checkbox,date,file,submit,signature,phone,divider,rating,url,location,voice,payment,spacer,grouped',
            'steps.*.fields.*.placeholder' => 'nullable|string|max:255',
            'steps.*.fields.*.default_value' => 'nullable|string|max:255',
            'steps.*.fields.*.description' => 'nullable|string',
            'steps.*.fields.*.custom_error_message' => 'nullable|string|max:255',
            'steps.*.fields.*.is_required' => 'nullable|boolean',
            'steps.*.fields.*.validation_rules' => 'nullable|array',
            'steps.*.fields.*.field_order' => 'required|integer|min:1',
            'steps.*.fields.*.column_index' => 'nullable|integer|min:1',
            'steps.*.fields.*.column_span' => 'nullable|integer|min:1',
            'steps.*.fields.*.options' => 'nullable|array',
            'steps.*.fields.*.options.*.id' => 'nullable',
            'steps.*.fields.*.options.*.label' => 'required|string|max:255',
            'steps.*.fields.*.options.*.value' => 'required|string|max:255',
            'steps.*.fields.*.options.*.option_order' => 'nullable|integer',
        ];
    }
}
