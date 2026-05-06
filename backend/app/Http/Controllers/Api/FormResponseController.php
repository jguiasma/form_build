<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FormResponse;
use Illuminate\Http\Request;

class FormResponseController extends Controller
{
    public function index()
    {
        return response()->json(
            FormResponse::with(['form', 'user'])->paginate(15)
        );
    }

    public function store(Request $request)
    {
        $request->validate([
            'form_id' => 'required|exists:forms,id',
            'user_id' => 'nullable|exists:users,id',
            'status' => 'sometimes|in:in_progress,completed',
            'started_at' => 'nullable|date',
            'submitted_at' => 'nullable|date',
        ]);

        $response = FormResponse::create($request->all());
        return response()->json($response->load(['form', 'user']), 201);
    }

    public function show(FormResponse $formResponse)
    {
        return response()->json(
            $formResponse->load(['form', 'user', 'answers.field'])
        );
    }

    public function update(Request $request, FormResponse $formResponse)
    {
        $request->validate([
            'status' => 'sometimes|in:in_progress,completed',
            'submitted_at' => 'nullable|date',
        ]);

        $formResponse->update($request->all());
        return response()->json($formResponse->load(['form', 'user']));
    }

    public function destroy(FormResponse $formResponse)
    {
        $formResponse->delete();
        return response()->json(['message' => 'Response deleted']);
    }
}
