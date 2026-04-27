<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FormStep;
use Illuminate\Http\Request;

class FormStepController extends Controller
{
    public function index()
    {
        return response()->json(FormStep::with('fields')->paginate(15));
    }

    public function store(Request $request)
    {
        $request->validate(FormStep::validationRules());
        $step = FormStep::create($request->all());
        return response()->json($step->load('fields'), 201);
    }

    public function show(FormStep $formStep)
    {
        return response()->json($formStep->load('fields.options'));
    }

    public function update(Request $request, FormStep $formStep)
    {
        $request->validate(FormStep::validationRules($formStep->id));
        $formStep->update($request->all());
        return response()->json($formStep->load('fields'));
    }

    public function destroy(FormStep $formStep)
    {
        $formStep->delete();
        return response()->json(['message' => 'Step deleted']);
    }
}
