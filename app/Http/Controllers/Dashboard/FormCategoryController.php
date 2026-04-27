<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\FormCategory;
use Illuminate\Http\Request;
use Yajra\DataTables\Facades\DataTables;

class FormCategoryController extends Controller
{
    public function index()
    {
        return view('dashboard.form-categories.index');
    }

   public function datatable()
    {
        $categories = FormCategory::withCount(['forms', 'formFields'])
            ->select('form_categories.*');

        return DataTables::of($categories)
            ->addColumn('icon_display', function($row) {
                $bg = $row->color ?? '#6366f1';
                if ($row->icon && str_ends_with($row->icon, '.png')) {
                    return '
                        <div style="width:40px; height:40px; border-radius:10px; background-color:' . $bg . '; display:flex; align-items:center; justify-content:center;">
                            <img src="' . asset('storage/icons/' . $row->icon) . '" style="width:22px; height:22px; object-fit:contain; filter:brightness(0) invert(1);">
                        </div>
                    ';
                }
                return '
                    <div style="width:40px; height:40px; border-radius:10px; background-color:' . $bg . '; display:flex; align-items:center; justify-content:center; color:white; font-size:18px;">
                        <i class="bi bi-' . ($row->icon ?? 'tag-fill') . '"></i>
                    </div>
                ';
            })
            ->addColumn('is_active', fn($row) => '
                <div class="form-check form-switch d-flex justify-content-center">
                    <input
                        class="form-check-input toggle-status"
                        type="checkbox"
                        data-id="' . $row->id . '"
                        ' . ($row->is_active ? 'checked' : '') . '
                        style="cursor:pointer; width:40px; height:20px;"
                    >
                </div>
            ')
            ->addColumn('actions', fn($row) => '
                <a href="' . route('dashboard.form-categories.show', $row->id) . '" class="btn btn-sm btn-info">
                    <i class="bi bi-eye"></i>
                </a>
                <a href="' . route('dashboard.form-categories.edit', $row->id) . '" class="btn btn-sm btn-warning">
                    <i class="bi bi-pencil"></i>
                </a>
                <form action="' . route('dashboard.form-categories.destroy', $row->id) . '" method="POST" style="display:inline">
                    ' . csrf_field() . method_field('DELETE') . '
                    <button class="btn btn-sm btn-danger" onclick="return confirm(\'Are you sure?\')">
                        <i class="bi bi-trash"></i>
                    </button>
                </form>
            ')
            ->rawColumns(['icon_display', 'is_active', 'actions'])
            ->make(true);
    }

    public function create()
    {
        return view('dashboard.form-categories.create');
    }

    public function store(Request $request)
    {
        $rules = FormCategory::validationRules();
        $rules['icon_upload'] = ['nullable', 'image', 'mimes:png', 'max:512'];

        $request->validate($rules);

        $data = $request->all();

        if ($request->hasFile('icon_upload')) {
            $filename = time() . '_' . $request->file('icon_upload')->getClientOriginalName();
            $request->file('icon_upload')->storeAs('icons', $filename, 'public');
            $data['icon'] = $filename;
        }

        FormCategory::create($data);
        return redirect()->route('dashboard.form-categories.index')->with('success', 'Category created successfully');
    }

    public function edit(FormCategory $formCategory)
    {
        return view('dashboard.form-categories.edit', compact('formCategory'));
    }

    public function toggleStatus(Request $request, FormCategory $formCategory)
    {
        $formCategory->update(['is_active' => !$formCategory->is_active]);
        return response()->json(['success' => true, 'is_active' => $formCategory->is_active]);
    }

    public function update(Request $request, FormCategory $formCategory)
    {
        $rules = FormCategory::validationRules();
        $rules['icon_upload'] = ['nullable', 'image', 'mimes:png', 'max:512'];

        $request->validate($rules);

        $data = $request->all();

        if ($request->hasFile('icon_upload')) {
            $filename = time() . '_' . $request->file('icon_upload')->getClientOriginalName();
            $request->file('icon_upload')->storeAs('icons', $filename, 'public');
            $data['icon'] = $filename;
        }

        $formCategory->update($data);
        return redirect()->route('dashboard.form-categories.index')->with('success', 'Category updated successfully');
    }

    public function show(FormCategory $formCategory)
    {
        return view('dashboard.form-categories.show', compact('formCategory'));
    }

    public function destroy(FormCategory $formCategory)
    {
        $formCategory->delete();
        return redirect()->route('dashboard.form-categories.index')->with('success', 'Category deleted successfully');
    }
}
