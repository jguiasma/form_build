<?php

namespace App\Services;

use App\Models\FormField;
use Illuminate\Support\Str;

class ValidationRuleGenerator
{
    /**
     * Generate Laravel validation rules from a FormField's stored validation_rules JSON.
     *
     * @param  FormField  $field
     * @return array<string>
     */
    public function generateRules(FormField $field): array
    {
        $rules = [];
        $vr    = $field->validation_rules ?? []; // already cast to array by the model

        // Required / optional
        if ($field->is_required) {
            $rules[] = 'required';
        } else {
            $rules[] = 'nullable';
        }

        switch ($field->type) {

            // ── EMAIL ──────────────────────────────────────────────
            case 'email':
                $rules[] = 'string';
                $rules[] = 'email:rfc,dns';
                break;

            // ── TEXT ───────────────────────────────────────────────
            case 'text':
                $rules[] = 'string';
                if (!empty($vr['min_length'])) $rules[] = 'min:' . $vr['min_length'];
                if (!empty($vr['max_length'])) $rules[] = 'max:' . $vr['max_length'];
                if (!empty($vr['pattern']))    $rules[] = 'regex:/' . $vr['pattern'] . '/';
                break;

            // ── TEXTAREA ───────────────────────────────────────────
            case 'textarea':
                $rules[] = 'string';
                if (!empty($vr['min_length'])) $rules[] = 'min:' . $vr['min_length'];
                if (!empty($vr['max_length'])) $rules[] = 'max:' . $vr['max_length'];
                break;

            // ── NUMBER ─────────────────────────────────────────────
            case 'number':
                $rules[] = 'numeric';
                if (isset($vr['min']) && $vr['min'] !== null) $rules[] = 'min:' . $vr['min'];
                if (isset($vr['max']) && $vr['max'] !== null) $rules[] = 'max:' . $vr['max'];
                if (!empty($vr['step']) && $vr['step'] !== 'any') {
                    $rules[] = 'multiple_of:' . $vr['step'];
                }
                break;

            // ── DATE ───────────────────────────────────────────────
            case 'date':
                $rules[] = 'date_format:Y-m-d';
                if (!empty($vr['min_date'])) $rules[] = 'after_or_equal:' . $vr['min_date'];
                if (!empty($vr['max_date'])) $rules[] = 'before_or_equal:' . $vr['max_date'];
                break;

            // ── SELECT / RADIO ─────────────────────────────────────
            case 'select':
            case 'radio':
                $options = $field->options->pluck('value')->toArray();
                if (!empty($options)) {
                    if ($field->type === 'select' && !empty($vr['multiple'])) {
                        $rules[] = 'array';
                        // Nested validation is handled by adding a .* rule in generateForStep
                    } else {
                        $rules[] = 'string';
                        $rules[] = 'in:' . implode(',', $options);
                    }
                }
                break;

            // ── CHECKBOX ───────────────────────────────────────────
            case 'checkbox':
                $rules[] = 'array';
                $options = $field->options->pluck('value')->toArray();
                if (!empty($options)) {
                    $rules[] = 'in:' . implode(',', $options);
                }
                if (!empty($vr['min_selections'])) {
                    $rules[] = 'min:' . $vr['min_selections'];
                }
                break;

            // ── FILE ───────────────────────────────────────────────
            case 'file':
                $fileRules = ['file'];
                // Allowed mime types
                if (!empty($vr['allowed_types'])) {
                    $types = $vr['allowed_types'];
                    $mimes = array_filter($types, fn($t) => $t !== '*');
                    if (!empty($mimes)) {
                        $expanded = [];
                        foreach ($mimes as $m) {
                            if ($m === 'image/*')                         $expanded = array_merge($expanded, ['jpg','jpeg','png','gif','webp','svg']);
                            elseif ($m === 'application/pdf')             $expanded[] = 'pdf';
                            elseif (str_contains($m, 'doc'))              $expanded = array_merge($expanded, ['doc','docx','odt']);
                            elseif (str_contains($m, 'xls'))              $expanded = array_merge($expanded, ['xls','xlsx','csv']);
                            else                                          $expanded[] = ltrim($m, '.');
                        }
                        $fileRules[] = 'mimes:' . implode(',', array_unique($expanded));
                    }
                }
                // Max size in kilobytes (Laravel uses KB)
                $maxMb   = $vr['max_size_mb'] ?? 10;
                $fileRules[] = 'max:' . ($maxMb * 1024);

                if (!empty($vr['multiple'])) {
                    $rules[] = 'array';
                    $rules[] = 'max:10'; // soft limit for multiple files
                    // We will need to apply $fileRules to each element in the array
                } else {
                    $rules = array_merge($rules, $fileRules);
                }
                break;

            case 'submit':
                $rules = [];
                break;
            case 'phone':
            case 'url':
                $rules[] = 'string';
                break;

            case 'signature':
            case 'payment':
            case 'divider':
            case 'rating':
            case 'location':
            case 'voice':
            case 'spacer':
                // Mostly aesthetic or special handling types, basic validation is fine
                $rules[] = 'nullable';
                break;
            case 'slider':
                $rules[] = 'numeric';
                $vr = $field->validation_rules ?? [];
                $sliderConfig = $vr['slider_config'] ?? [];
                if (isset($sliderConfig['min'])) $rules[] = 'min:' . $sliderConfig['min'];
                if (isset($sliderConfig['max'])) $rules[] = 'max:' . $sliderConfig['max'];
                if (($sliderConfig['mode'] ?? 'single') === 'range') {
                    // range returns array [min, max]
                    $rules = array_filter($rules, fn($r) => $r !== 'numeric');
                    $rules[] = 'array';
                    $rules[] = 'size:2';
                }
                break;

    case 'matrix':
        $rules[] = 'array';
        // Each row key must be answered
        $vr = $field->validation_rules ?? [];
        $rows = $vr['matrix_config']['rows'] ?? [];
        foreach ($rows as $row) {
            $rowKey = Str::slug($row, '_');
            $validationRules[$field->field_key . '.' . $rowKey] = [
                $field->is_required ? 'required' : 'nullable',
                'string'
            ];
        }
        break;

    case 'conditional':
        $rules[] = 'nullable';
        break;

            default:
                $rules[] = 'string';
        }

        return $rules;
    }

    /**
     * Build a full validation rules array for all fields in a given step.
     *
     * @param  \Illuminate\Database\Eloquent\Collection  $fields
     * @return array<string, array<string>>
     */
    public function generateForStep($fields): array
    {
        $validationRules = [];
        foreach ($fields as $field) {
        if ($field->type === 'submit') continue;

        //  SPECIAL CASE: grouped
        if ($field->type === 'grouped') {
            $rows = $field->validation_rules['grouped_config']['rows'] ?? [];

            if (!empty($rows)) {
                $validationRules[$field->field_key] = [
                    $field->is_required ? 'required' : 'nullable',
                    'array',
                ];

                foreach ($rows as $rowKey => $row) {
                    foreach (($row['cols'] ?? []) as $colKey => $col) {
                        $nestedKey = $field->field_key . '.' . $rowKey . '_' . $colKey;
                        $rules = [$field->is_required ? 'required' : 'nullable'];

                        switch ($col['type'] ?? 'text') {
                            case 'email':
                                $rules[] = 'email:rfc,dns';
                                break;
                            case 'phone':
                                $rules[] = 'regex:/^\+?[\d\s().-]{7,20}$/';
                                break;
                            case 'url':
                                $rules[] = 'url';
                                break;
                            case 'number':
                                $rules[] = 'numeric';
                                break;
                            case 'date':
                                $rules[] = 'date_format:Y-m-d';
                                break;
                            case 'select':
                                $rules[] = 'string';
                                break;
                            default:
                                $rules[] = 'string';
                        }

                        $validationRules[$nestedKey] = $rules;
                    }
                }

                continue;
            }

            foreach (request()->all() as $key => $value) {

                if (str_starts_with($key, $field->field_key . '_')) {

                    // règle par défaut
                    $validationRules[$key] = ['required', 'string'];

                    // email intelligent
                    if (str_contains(strtolower($key), 'email')) {
                        $validationRules[$key] = ['required', 'email'];
                    }
                    if (str_contains(strtolower($key), 'phone')) {
                        $validationRules[$key] = ['required', 'regex:/^\+?[\d\s().-]{7,20}$/'];
                    }
                }
            }

            continue;
        }
        $fieldRules = $this->generateRules($field);

        if (!empty($fieldRules)) {
            $validationRules[$field->field_key] = $fieldRules;
                    // Checkbox values need nested validation
                    if ($field->type === 'checkbox') {
                        $options = $field->options->pluck('value')->toArray();
                        if (!empty($options)) {
                            $validationRules[$field->field_key . '.*'] = ['string', 'in:' . implode(',', $options)];
                        }
                    }
                    // Multiple files need nested validation
                    if ($field->type === 'file' && !empty($field->validation_rules['multiple'])) {
                        // We re-generate the rules just for the file element itself
                        $vr = $field->validation_rules;
                        $singleFileRules = ['file'];
                        if (!empty($vr['max_size_mb'])) $singleFileRules[] = 'max:' . ($vr['max_size_mb'] * 1024);
                        // Add mimes etc if needed (simplified here for brevity as previously defined)
                        $validationRules[$field->field_key . '.*'] = $singleFileRules;
                    }
                    // Multiple select need nested validation
                    if ($field->type === 'select' && !empty($field->validation_rules['multiple'])) {
                        $options = $field->options->pluck('value')->toArray();
                        if (!empty($options)) {
                            $validationRules[$field->field_key . '.*'] = ['string', 'in:' . implode(',', $options)];
                        }
                    }
                }
            }
            return $validationRules;
        }
}
