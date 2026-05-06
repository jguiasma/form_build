<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\FormType;

class FormTypeController extends Controller
{
    public function index()
    {
        return response()->json(FormType::all());
    }

    public function store(Request $request)
    {
        $request->validate(FormType::validationRules());
        $type = FormType::create($request->all());
        return response()->json(['data' => $type, 'message' => __('form_type.created')], 201);
    }

    public function show(FormType $formType)
    {
        return response()->json($formType->load('forms'));
    }

    public function update(Request $request, FormType $formType)
    {
        $request->validate(FormType::validationRules());
        $formType->update($request->all());
        return response()->json(['data' => $formType, 'message' => __('form_type.updated')], 200);
    }

    public function destroy(FormType $formType)
    {
        $formType->delete();
        return response()->json(['message' => __('form_type.deleted')]);
    }
}
