<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FormCategory;
use Illuminate\Http\Request;

class FormCategoryController extends Controller
{
    public function index()
    {
        return response()->json(FormCategory::all());
    }

    public function store(Request $request)
    {
        $request->validate(FormCategory::validationRules());
        $category = FormCategory::create($request->all());
        return response()->json($category, 201, ['message' => __('form_category.created')]);
    }

    public function show(FormCategory $formCategory)
    {
        return response()->json($formCategory->load('forms'));
    }

    public function update(Request $request, FormCategory $formCategory)
    {
        $request->validate(FormCategory::validationRules());
        $formCategory->update($request->all());
        return response()->json($formCategory, ['message' => __('form_category.updated')]);
    }

    public function destroy(FormCategory $formCategory)
    {
        $formCategory->delete();
        return response()->json(['message' => __('form_category.deleted')]);
    }
}
