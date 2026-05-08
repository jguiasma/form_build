<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Form;
use App\Models\FormAnswer;
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

    public function saveAnswers(Request $request, Form $form, FormStep $step)
    {
        if ($step->form_id !== $form->id) {
            abort(404);
        }

        $data = $request->validate([
            'response_id' => ['required', 'exists:form_responses,id'],
            'answers' => ['required', 'array'],
            'answers.*.field_id' => ['required', 'exists:form_fields,id'],
            'answers.*.value' => ['nullable', 'string'],
        ]);

        $response = $form->responses()
            ->whereKey($data['response_id'])
            ->firstOrFail();

        foreach ($data['answers'] as $answer) {
            FormAnswer::updateOrCreate(
                [
                    'response_id' => $response->id,
                    'field_id' => $answer['field_id'],
                ],
                [
                    'value' => $answer['value'] ?? null,
                ]
            );
        }

        return response()->json([
            'success' => true,
        ]);
    }

    public function reorderSteps(Request $request, Form $form)
    {
        $data = $request->validate([
            'order' => ['required', 'array'],
            'order.*' => ['required', 'integer', 'exists:form_steps,id'],
        ]);

        foreach ($data['order'] as $index => $stepId) {
            $form->steps()
                ->whereKey($stepId)
                ->update(['step_order' => $index + 1]);
        }

        return response()->json([
            'success' => true,
        ]);
    }
}
