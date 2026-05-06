<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FieldOption;
use Illuminate\Http\Request;

class FieldOptionController extends Controller
{
    public function index()
    {
        return response()->json(FieldOption::all());
    }

    public function store(Request $request)
    {
        $request->validate(FieldOption::validationRules());
        $option = FieldOption::create($request->all());
        return response()->json($option, 201);
    }

    public function show(FieldOption $fieldOption)
    {
        return response()->json($fieldOption);
    }

    public function update(Request $request, FieldOption $fieldOption)
    {
        $request->validate(FieldOption::validationRules());
        $fieldOption->update($request->all());
        return response()->json($fieldOption);
    }

    public function destroy(FieldOption $fieldOption)
    {
        $fieldOption->delete();
        return response()->json(['message' => 'Option deleted']);
    }
}
