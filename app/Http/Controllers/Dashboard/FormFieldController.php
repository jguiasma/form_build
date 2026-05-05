<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\FormField;
use Illuminate\Http\Request;
use Yajra\DataTables\Facades\DataTables;
use App\Models\FormCategory;
use App\Models\Pack;
use App\Exports\FormFieldsExport;
use Maatwebsite\Excel\Facades\Excel;

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
        $fields = FormField::with(['categories', 'packs'])
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
        $rules = FormField::validationRules();
        $rules['step_id'] = 'nullable';

        $type = $request->input('type');

        // Merge config into validation_rules selon le type
        $this->mergeTypeConfig($request, $type);

        $data = $request->validate($rules);
        $data['is_palette_component'] = true;
        $data['is_required']          = $request->boolean('is_required');
        $data['step_id']              = null;

        $field = FormField::create($data);

        $field->categories()->sync($request->category_ids ?? []);
        $field->packs()->sync($request->pack_ids ?? []);

        return redirect()->route('dashboard.form-fields.index')
            ->with('success', 'Field created successfully');
    }

    public function update(Request $request, FormField $formField)
    {
        $rules = FormField::validationRules();
        $rules['step_id'] = 'nullable';

        $type = $request->input('type');
        $this->mergeTypeConfig($request, $type);

        $data = $request->validate($rules);
        $data['is_required'] = $request->boolean('is_required');

        $formField->update($data);

        $formField->categories()->sync($request->category_ids ?? []);
        $formField->packs()->sync($request->pack_ids ?? []);

        return redirect()->route('dashboard.form-fields.index')
            ->with('success', 'Field updated successfully');
    }

    private function mergeTypeConfig(Request $request, string $type): void
    {
        $configKey = match($type) {
            'grouped'     => 'grouped_config',
            'slider'      => 'slider_config',
            'matrix'      => 'matrix_config',
            'conditional' => 'conditional_config',
            default       => null,
        };

        if ($configKey && $request->has($configKey)) {
            $request->merge([
                'validation_rules' => [
                    $configKey => $request->input($configKey)
                ]
            ]);
        }
    }

    public function edit(FormField $formField)
    {
        $categories = FormCategory::all();
        $packs = Pack::all();
        return view('dashboard.form-fields.edit', compact('formField', 'categories', 'packs'));
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

    public function export(string $format)
    {
        $filename = 'form_fields_' . now()->format('Y_m_d_His');

        return match($format) {
            'xlsx' => Excel::download(new FormFieldsExport, $filename . '.xlsx'),
            'csv'  => Excel::download(new FormFieldsExport, $filename . '.csv', \Maatwebsite\Excel\Excel::CSV),
            'pdf'  => Excel::download(new FormFieldsExport, $filename . '.pdf', \Maatwebsite\Excel\Excel::DOMPDF),
            default => back()->with('error', 'Format not supported'),
        };
    }
}
