<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Form;
use App\Models\FormResponse;
use App\Models\FormStep;
use App\Models\FormVersion;
use App\Services\FormPublishService;
use App\Services\ValidationRuleGenerator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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
        $data = $request->validate(Form::validationRules());
        $form = Form::create($data);

        FormStep::create([
            'form_id' => $form->id,
            'title' => 'Step 1',
            'step_order' => 1,
            'is_required' => true,
        ]);

        return response()->json($form->load(['category', 'creator', 'steps.fields.options']), 201);
    }

    public function show(Form $form)
    {
        return response()->json(
            $form->load(['category', 'creator', 'steps.fields.options', 'versions'])
        );
    }

    public function publish(Request $request, Form $form, FormPublishService $publishService)
    {
        $form->update([
            'status' => 'published',
            'published_at' => now(),
        ]);

        $version = $publishService->publish($form->fresh());
        $frontendUrl = rtrim(
            $request->header('origin', env('FRONTEND_URL', 'http://localhost:5173')),
            '/'
        );

        return response()->json([
            'success' => true,
            'version' => $version->version,
            'uuid' => $version->share_link,
            'share_link' => $frontendUrl . '/f/' . $version->share_link,
        ]);
    }

    public function publicShow(string $uuid)
    {
        $version = FormVersion::where('share_link', $uuid)->latest()->firstOrFail();
        $form = $version->form()->firstOrFail();

        if ($form->status !== 'published') {
            abort(404);
        }

        return response()->json([
            'data' => $version->schema,
        ]);
    }

    public function start(Form $form)
    {
        if ($form->status !== 'published') {
            abort(404);
        }

        $response = FormResponse::create([
            'form_id' => $form->id,
            'status' => 'in_progress',
            'started_at' => now(),
        ]);

        return response()->json([
            'response_id' => $response->id,
        ], 201);
    }

    public function submit(Request $request, Form $form, ValidationRuleGenerator $ruleGenerator)
    {
        $request->validate([
            'response_id' => ['required', 'exists:form_responses,id'],
        ]);

        $response = FormResponse::with(['form.steps.fields.options'])
            ->where('form_id', $form->id)
            ->whereKey($request->response_id)
            ->firstOrFail();

        $allFields = $response->form->steps->flatMap(fn ($step) => $step->fields);
        $dynamicRules = $ruleGenerator->generateForStep($allFields);

        if (!empty($dynamicRules)) {
            $request->validate($dynamicRules);
        }

        $response->update([
            'status' => 'completed',
            'submitted_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Form submitted successfully',
        ]);
    }

    public function update(Request $request, Form $form)
    {
        $data = $request->all();

        DB::transaction(function () use ($form, $data) {
            $form->update(collect($data)
                ->only([
                    'form_category_id',
                    'form_type_id',
                    'title',
                    'description',
                    'status',
                    'created_by',
                    'published_at',
                ])
                ->toArray());

            if (!array_key_exists('steps', $data)) {
                return;
            }

            $keptStepIds = [];

            foreach ($data['steps'] as $stepData) {
                $step = $form->steps()->updateOrCreate(
                    ['id' => is_numeric($stepData['id'] ?? null) ? $stepData['id'] : null],
                    [
                        'title' => $stepData['title'],
                        'description' => $stepData['description'] ?? null,
                        'step_order' => $stepData['step_order'] ?? 1,
                        'is_required' => $stepData['is_required'] ?? true,
                    ]
                );

                $keptStepIds[] = $step->id;
                $keptFieldIds = [];

                foreach (($stepData['fields'] ?? []) as $fieldData) {
                    $field = $step->fields()->updateOrCreate(
                        ['id' => is_numeric($fieldData['id'] ?? null) ? $fieldData['id'] : null],
                        [
                            'label' => $fieldData['label'],
                            'field_key' => $fieldData['field_key'],
                            'type' => $fieldData['type'],
                            'placeholder' => $fieldData['placeholder'] ?? null,
                            'default_value' => $fieldData['default_value'] ?? null,
                            'description' => $fieldData['description'] ?? null,
                            'is_required' => $fieldData['is_required'] ?? false,
                            'field_order' => $fieldData['field_order'] ?? 1,
                            'column_index' => $fieldData['column_index'] ?? 1,
                            'column_span' => $fieldData['column_span'] ?? 1,
                            'validation_rules' => $fieldData['validation_rules'] ?? null,
                            'custom_error_message' => $fieldData['custom_error_message'] ?? null,
                        ]
                    );

                    $keptFieldIds[] = $field->id;
                    $keptOptionIds = [];

                    foreach (($fieldData['options'] ?? []) as $optionIndex => $optionData) {
                        $optionPayload = collect($optionData)
                            ->only(['label', 'value', 'option_order'])
                            ->toArray();
                        $optionPayload['option_order'] = $optionPayload['option_order'] ?? $optionIndex + 1;

                        $option = $field->options()->updateOrCreate(
                            ['id' => is_numeric($optionData['id'] ?? null) ? $optionData['id'] : null],
                            $optionPayload
                        );

                        $keptOptionIds[] = $option->id;
                    }

                    $field->options()
                        ->when(count($keptOptionIds) > 0, fn ($query) => $query->whereNotIn('id', $keptOptionIds))
                        ->when(count($keptOptionIds) === 0, fn ($query) => $query)
                        ->delete();
                }

                $step->fields()
                    ->when(count($keptFieldIds) > 0, fn ($query) => $query->whereNotIn('id', $keptFieldIds))
                    ->when(count($keptFieldIds) === 0, fn ($query) => $query)
                    ->delete();
            }

            $form->steps()
                ->when(count($keptStepIds) > 0, fn ($query) => $query->whereNotIn('id', $keptStepIds))
                ->when(count($keptStepIds) === 0, fn ($query) => $query)
                ->delete();
        });

        return response()->json($form->fresh()->load(['category', 'creator', 'steps.fields.options']));
    }

    public function destroy(Form $form)
    {
        $form->delete();
        return response()->json(['message' => 'Form deleted']);
    }

    public function responses(Form $form)
    {
        return response()->json([
            'data' => $form->responses()
                ->with('answers.field')
                ->latest()
                ->paginate(15),
        ]);
    }

    public function stats()
    {
        return response()->json([
            'data' => [
                'total_forms' => Form::count(),
                'published_forms' => Form::where('status', 'published')->count(),
                'draft_forms' => Form::where('status', 'draft')->count(),
                'total_responses' => FormResponse::count(),
            ],
        ]);
    }
}
