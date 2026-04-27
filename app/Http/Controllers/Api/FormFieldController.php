<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FormField;
use Illuminate\Http\Request;

class FormFieldController extends Controller
{
    public function index()
    {
        return response()->json(
            FormField::with(['options', 'categories', 'packs'])->paginate(15)
        );
    }

    public function paletteComponents()
    {
        return response()->json(
            FormField::where('is_palette_component', true)
                ->with(['options', 'categories', 'packs'])
                ->get()
                ->groupBy(fn($field) => $field->categories->pluck('name')->join(', ') ?: 'Uncategorized')
        );
    }

    public function store(Request $request)
    {
        $request->validate(FormField::validationRules());
        $field = FormField::create($request->all());

        if ($request->has('category_ids')) {
            $field->categories()->sync($request->category_ids);
        }
        if ($request->has('pack_ids')) {
            $field->packs()->sync($request->pack_ids);
        }

        return response()->json($field->load(['options', 'categories', 'packs']), 201);
    }

    public function show(FormField $formField)
    {
        return response()->json($formField->load(['options', 'categories', 'packs']));
    }

    public function update(Request $request, FormField $formField)
    {
        $request->validate(FormField::validationRules());
        $formField->update($request->all());

        $formField->categories()->sync($request->category_ids ?? []);
        $formField->packs()->sync($request->pack_ids ?? []);

        return response()->json($formField->load(['options', 'categories', 'packs']));
    }

    public function destroy(FormField $formField)
    {
        $formField->delete();
        return response()->json(['message' => 'Field deleted']);
    }
}
