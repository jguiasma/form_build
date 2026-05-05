<?php

namespace App\Http\Controllers\Dashboard;

use App\Exports\PacksExport;
use App\Http\Controllers\Controller;
use App\Models\Pack;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use Yajra\DataTables\Facades\DataTables;

class PackController extends Controller
{
    public function index()
    {
        return view('dashboard.packs.index');
    }

    public function datatable()
    {
        $packs = Pack::select('*');

        return DataTables::of($packs)
            ->addColumn('actions', fn($row) => '
                <a href="' . route('dashboard.packs.show', $row->id) . '" class="btn btn-sm btn-info">
                    <i class="bi bi-eye"></i>
                </a>
                <a href="' . route('dashboard.packs.edit', $row->id) . '" class="btn btn-sm btn-warning">
                    <i class="bi bi-pencil"></i>
                </a>
                <form action="' . route('dashboard.packs.destroy', $row->id) . '" method="POST" style="display:inline">
                    ' . csrf_field() . method_field('DELETE') . '
                    <button class="btn btn-sm btn-danger" onclick="return confirm(\'Are you sure?\')">
                        <i class="bi bi-trash"></i>
                    </button>
                </form>
            ')
            ->rawColumns(['actions'])
            ->make(true);
    }

    public function export(string $format)
    {
        $filename = 'packs_' . now()->format('Y_m_d_His');

        return match($format) {
            'xlsx' => Excel::download(new PacksExport, $filename . '.xlsx'),
            'csv'  => Excel::download(new PacksExport, $filename . '.csv', \Maatwebsite\Excel\Excel::CSV),
            'pdf'  => Excel::download(new PacksExport, $filename . '.pdf', \Maatwebsite\Excel\Excel::DOMPDF),
            default => back()->with('error', 'Format not supported'),
        };
    }

    public function create()
    {
        return view('dashboard.packs.create');
    }

    public function store(Request $request)
    {
        $request->validate(Pack::validationRules());
        Pack::create($request->all());
        return redirect()->route('dashboard.packs.index')->with('success', 'Pack created successfully');
    }

    public function edit(Pack $pack)
    {
        return view('dashboard.packs.edit', compact('pack'));
    }

    public function update(Request $request, Pack $pack)
    {
        $request->validate(Pack::validationRules());
        $pack->update($request->all());
        return redirect()->route('dashboard.packs.index')->with('success', 'Pack updated successfully');
    }

    public function show(Pack $pack)
    {
        return view('dashboard.packs.show', compact('pack'));
    }

    public function destroy(Pack $pack)
    {
        $pack->delete();
        return redirect()->route('dashboard.packs.index')->with('success', 'Pack deleted successfully');
    }
}
