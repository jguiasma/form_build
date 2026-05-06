<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FormVersion;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class FormVersionController extends Controller
{
    public function index()
    {
        return response()->json(FormVersion::with('form')->paginate(15));
    }

    public function store(Request $request)
    {
        $request->validate([
            'form_id' => 'required|exists:forms,id',
            'version' => 'required|string|max:50',
            'schema' => 'required|array',
        ]);

        $version = FormVersion::create([
            ...$request->all(),
            'share_link' => Str::uuid(),
        ]);

        return response()->json($version->load('form'), 201);
    }

    public function show(FormVersion $formVersion)
    {
        return response()->json($formVersion->load('form'));
    }

    public function update(Request $request, FormVersion $formVersion)
    {
        $request->validate([
            'version' => 'sometimes|string|max:50',
            'schema' => 'sometimes|array',
        ]);

        $formVersion->update($request->all());
        return response()->json($formVersion);
    }

    public function destroy(FormVersion $formVersion)
    {
        $formVersion->delete();
        return response()->json(['message' => 'Version deleted']);
    }
}
