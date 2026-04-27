<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FormAnswer;
use Illuminate\Http\Request;

class FormAnswerController extends Controller
{
    public function index()
    {
        return response()->json(FormAnswer::with(['response', 'field'])->paginate(15));
    }

    public function store(Request $request)
    {
        $request->validate([
            'response_id' => 'required|exists:form_responses,id',
            'field_id' => 'required|exists:form_fields,id',
            'value' => 'nullable|string',
        ]);

        $answer = FormAnswer::create($request->all());
        return response()->json($answer->load(['response', 'field']), 201);
    }

    public function show(FormAnswer $formAnswer)
    {
        return response()->json($formAnswer->load(['response', 'field']));
    }

    public function update(Request $request, FormAnswer $formAnswer)
    {
        $request->validate(['value' => 'nullable|string']);
        $formAnswer->update($request->only('value'));
        return response()->json($formAnswer);
    }

    public function destroy(FormAnswer $formAnswer)
    {
        $formAnswer->delete();
        return response()->json(['message' => 'Answer deleted']);
    }
}
