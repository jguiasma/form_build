<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\FormType;
use App\Models\FormCategory;
use Illuminate\Http\Request;
use Yajra\DataTables\Facades\DataTables;

class FormTypeController extends Controller
{
    public function index()
    {
        $categories = FormCategory::where('is_active', true)->get();
        return view('dashboard.form-types.index', compact('categories'));
    }

    public function datatable(Request $request)
    {
        $query = FormType::with('category')->select('form_types.*');

        if ($request->filled('category_id')) {
            $query->where('form_category_id', $request->category_id);
        }

        return DataTables::of($query)
            ->addColumn('category', fn($row) =>
                $row->category
                    ? '<span class="badge bg-secondary">' . e($row->category->name) . '</span>'
                    : '-'
            )
            ->addColumn('is_active', fn($row) => '
                <div class="form-check form-switch d-flex justify-content-center">
                    <input
                        class="form-check-input toggle-type-status"
                        type="checkbox"
                        data-id="' . $row->id . '"
                        ' . ($row->is_active ? 'checked' : '') . '
                        style="cursor:pointer; width:40px; height:20px;"
                    >
                </div>
            ')
            ->addColumn('actions', fn($row) => '
                <a href="' . route('dashboard.form-types.show', $row->id) . '" class="btn btn-sm btn-info">
                    <i class="bi bi-eye"></i>
                </a>
                <a href="' . route('dashboard.form-types.edit', $row->id) . '" class="btn btn-sm btn-warning">
                    <i class="bi bi-pencil"></i>
                </a>
                <form action="' . route('dashboard.form-types.destroy', $row->id) . '" method="POST" style="display:inline">
                    ' . csrf_field() . method_field('DELETE') . '
                    <button class="btn btn-sm btn-danger" onclick="return confirm(\'Delete this type?\')">
                        <i class="bi bi-trash"></i>
                    </button>
                </form>
            ')
            ->rawColumns(['category', 'is_active', 'actions'])
            ->make(true);
    }

    public function create()
    {
        $categories = FormCategory::where('is_active', true)->orderBy('name')->get();
        return view('dashboard.form-types.create', compact('categories'));
    }

    public function store(Request $request)
    {
        $data = $request->validate(FormType::validationRules());
        $data['is_active'] = $request->boolean('is_active', true);

        FormType::create($data);

        return redirect()->route('dashboard.form-types.index')
            ->with('success', 'Form type created successfully');
    }

    public function show(FormType $formType)
    {
        $formType->load(['category', 'forms']);
        return view('dashboard.form-types.show', compact('formType'));
    }

    public function edit(FormType $formType)
    {
        $categories = FormCategory::where('is_active', true)->orderBy('name')->get();
        return view('dashboard.form-types.edit', compact('formType', 'categories'));
    }

    public function update(Request $request, FormType $formType)
    {
        $data = $request->validate(FormType::validationRules());
        $data['is_active'] = $request->boolean('is_active');

        $formType->update($data);

        return redirect()->route('dashboard.form-types.index')
            ->with('success', 'Form type updated successfully');
    }

    public function destroy(FormType $formType)
    {
        $formType->delete();
        return redirect()->route('dashboard.form-types.index')
            ->with('success', 'Form type deleted successfully');
    }

    public function toggleStatus(FormType $formType)
    {
        $formType->update(['is_active' => !$formType->is_active]);
        return response()->json(['success' => true]);
    }
}