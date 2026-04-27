<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Form;
use Illuminate\Http\Request;

class FormController extends Controller
{
    public function index()
    {
        return response()->json(
            Form::with(['category', 'creator'])->paginate(15)
        );
    }

    public function store(Request $request)
    {
        $request->validate(Form::validationRules());
        $form = Form::create($request->all());
        return response()->json($form->load(['category', 'creator']), 201);
    }

    public function show(Form $form)
    {
        return response()->json(
            $form->load(['category', 'creator', 'steps.fields.options'])
        );
    }

    public function update(Request $request, Form $form)
    {
        $request->validate(Form::validationRules());
        $form->update($request->all());
        return response()->json($form->load(['category', 'creator']));
    }

    public function destroy(Form $form)
    {
        $form->delete();
        return response()->json(['message' => 'Form deleted']);
    }
}
