<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FormField;
use App\Models\Pack;
use Illuminate\Http\Request;

class FormFieldController extends Controller
{
    public function index()
    {
        return response()->json(
            FormField::with(['options', 'categories', 'packs'])->paginate(15)
        );
    }

    public function paletteComponents(Request $request)
    {
        $account = $request->user();
        $maxPackAmount = (float) ($account?->subscriptions()
            ->join('packs', 'subscriptions.pack_id', '=', 'packs.id')
            ->max('packs.amount') ?? 0);

        $allowedPackIds = Pack::where('amount', '<=', $maxPackAmount)
            ->pluck('id');

        $query = FormField::where('is_palette_component', true)
            ->with(['options', 'categories', 'packs']);

        if ($request->filled('category_id')) {
            $query->whereHas('categories', function ($categoryQuery) use ($request) {
                $categoryQuery->where('form_categories.id', $request->category_id);
            });
        }

        $query->whereHas('packs', function ($packQuery) use ($allowedPackIds) {
            $packQuery->whereIn('packs.id', $allowedPackIds);
        });

        return response()->json(
            $query->get()
                ->groupBy(fn($field) => $field->categories->pluck('name')->join(', ') ?: 'Uncategorized')
        );
    }

    public function store(Request $request)
    {
        $rules = FormField::validationRules();
        $rules['step_id'] = 'nullable';

        $this->mergeTypeConfig($request, $request->input('type'));

        $data = $request->validate($rules);
        $field = FormField::create($data);

        if ($request->has('category_ids')) {
            $field->categories()->sync($request->category_ids);
        }
        if ($request->has('pack_ids')) {
            $field->packs()->sync($request->pack_ids);
        }

        return response()->json(
            $field->load(['options', 'categories', 'packs']),
            201
        );
    }

    public function show(FormField $formField)
    {
        return response()->json($formField->load(['options', 'categories', 'packs']));
    }

    public function update(Request $request, FormField $formField)
    {
        $rules = FormField::validationRules();
        $rules['step_id'] = 'nullable';

        $this->mergeTypeConfig($request, $request->input('type'));

        $data = $request->validate($rules);
        $formField->update($data);

        $formField->categories()->sync($request->category_ids ?? []);
        $formField->packs()->sync($request->pack_ids ?? []);

        return response()->json($formField->load(['options', 'categories', 'packs']));
    }

    public function destroy(FormField $formField)
    {
        $formField->delete();
        return response()->json(['message' => __('form_fields.deleted')]);
    }

    private function mergeTypeConfig(Request $request, ?string $type): void
    {
        $configKey = match ($type) { //exp type slider
            'grouped' => 'grouped_config',
            'slider' => 'slider_config', //si type slider donc configKey = slider_config
            'matrix' => 'matrix_config',
            'conditional' => 'conditional_config',
            default => null, // cad composant normale pas besoin de configuration speciale
        };

        if ($configKey && $request->has($configKey)) { // cherche si le formulaire(blade) a envoyé slider_config
            $request->merge([
                'validation_rules' => [ //C’est la colonne qui existe dans la table form_fields
                    $configKey => $request->input($configKey), //met la config spéciale dans validation_rules
                ],
            ]);
        }
    }

    public function reorderFields(Request $request, \App\Models\FormStep $step)
    {
        $data = $request->validate([
            'order' => ['required', 'array'],
            'order.*' => ['required', 'integer', 'exists:form_fields,id'],
        ]);

        foreach ($data['order'] as $index => $fieldId) {
            $step->fields()
                ->whereKey($fieldId)
                ->update([
                    'field_order' => $index + 1,
                    'column_index' => 1,
                ]);
        }

        return response()->json([
            'success' => true,
        ]);
    }
}
