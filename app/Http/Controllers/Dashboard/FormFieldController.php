<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\FormField;
use Illuminate\Http\Request;
use Yajra\DataTables\Facades\DataTables;
use App\Models\FormCategory;
use App\Models\Pack;

class FormFieldController extends Controller
{
    public function index()
    {
        $categories = FormCategory::all();
        $packs = Pack::all();
        return view('dashboard.form-fields.index', compact('categories', 'packs'));
    }

    public function datatable()
    {
        $fields = FormField::where('is_palette_component', true)
            ->with(['categories', 'packs'])
            ->select('form_fields.*');

        return DataTables::of($fields)
            ->addColumn('categories', function($row) {
                return $row->categories->map(fn($c) =>
                    '<span class="badge bg-secondary me-1">' . $c->name . '</span>'
                )->implode('');
            })
            ->addColumn('packs', function($row) {
                return $row->packs->map(fn($p) =>
                    '<span class="badge bg-info me-1">' . $p->title . '</span>'
                )->implode('');
            })
            ->addColumn('is_palette_component', fn($row) => '
                <div class="form-check form-switch d-flex justify-content-center">
                    <input
                        class="form-check-input toggle-field-status"
                        type="checkbox"
                        data-id="' . $row->id . '"
                        ' . ($row->is_palette_component ? 'checked' : '') . '
                        style="cursor:pointer; width:40px; height:20px;"
                    >
                </div>
            ')
            ->addColumn('actions', fn($row) => '
                <a href="' . route('dashboard.form-fields.show', $row->id) . '" class="btn btn-sm btn-info">
                    <i class="bi bi-eye"></i>
                </a>
                <a href="' . route('dashboard.form-fields.edit', $row->id) . '" class="btn btn-sm btn-warning">
                    <i class="bi bi-pencil"></i>
                </a>
                <form action="' . route('dashboard.form-fields.destroy', $row->id) . '" method="POST" style="display:inline">
                    ' . csrf_field() . method_field('DELETE') . '
                    <button class="btn btn-sm btn-danger" onclick="return confirm(\'Are you sure?\')">
                        <i class="bi bi-trash"></i>
                    </button>
                </form>
            ')
            ->rawColumns(['categories', 'packs', 'is_palette_component', 'actions'])
            ->make(true);
    }

    public function create()
    {
        $categories = FormCategory::where('is_active', true)->get();
        $packs = Pack::all();
        return view('dashboard.form-fields.create', compact('categories', 'packs'));
    }

    public function store(Request $request)
    {
        $data = $request->validate(FormField::validationRules());
        $data['is_palette_component'] = true;

        $field = FormField::create($data);

        if ($request->has('category_ids')) {
            $field->categories()->sync($request->category_ids);
        }

        if ($request->has('pack_ids')) {
            $field->packs()->sync($request->pack_ids);
        }

        return redirect()->route('dashboard.form-fields.index')->with('success', 'Field created successfully');
    }

    public function edit(FormField $formField)
    {
        $categories = FormCategory::all();
        $packs = Pack::all();
        return view('dashboard.form-fields.edit', compact('formField', 'categories', 'packs'));
    }

    public function update(Request $request, FormField $formField)
    {
        $request->validate(FormField::validationRules());
        $formField->update($request->all());

        $formField->categories()->sync($request->category_ids ?? []);
        $formField->packs()->sync($request->pack_ids ?? []);

        return redirect()->route('dashboard.form-fields.index')->with('success', 'Field updated successfully');
    }

    public function toggleStatus(FormField $formField)
    {
        $formField->update(['is_palette_component' => !$formField->is_palette_component]);
        return response()->json(['success' => true]);
    }

    public function show(FormField $formField)
    {
        $formField->load(['categories', 'packs']);
        return view('dashboard.form-fields.show', compact('formField'));
    }

    public function destroy(FormField $formField)
    {
        $formField->delete();
        return redirect()->route('dashboard.form-fields.index')->with('success', 'Field deleted successfully');
    }
    public function toggleCategory(FormField $formField, FormCategory $category)
    {
        if ($formField->categories()->where('form_category_id', $category->id)->exists()) {
            $formField->categories()->detach($category->id);
            $attached = false;
        } else {
            $formField->categories()->attach($category->id);
            $attached = true;
        }

        return response()->json(['success' => true, 'attached' => $attached]);
    }

    public function togglePack(FormField $formField, Pack $pack)
    {
        if ($formField->packs()->where('pack_id', $pack->id)->exists()) {
            $formField->packs()->detach($pack->id);
            $attached = false;
        } else {
            $formField->packs()->attach($pack->id);
            $attached = true;
        }

        return response()->json(['success' => true, 'attached' => $attached]);
    }
}
