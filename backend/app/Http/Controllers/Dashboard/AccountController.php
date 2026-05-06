<?php

namespace App\Http\Controllers\Dashboard;

use App\Exports\AccountsExport;
use App\Http\Controllers\Controller;
use App\Models\Account;
use App\Models\Role;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use Yajra\DataTables\Facades\DataTables;

class AccountController extends Controller
{
    public function index()
    {
        return view('dashboard.accounts.index');
    }

    public function datatable()
    {
        $accounts = Account::with('role')->select('accounts.*');

        return DataTables::of($accounts)
            ->addColumn('role', fn($row) => $row->role->type ?? '-')
            ->addColumn('actions', fn($row) => '
                <a href="' . route('dashboard.accounts.show', $row->id) . '" class="btn btn-sm btn-info">
                    <i class="bi bi-eye"></i>
                </a>
                <a href="' . route('dashboard.accounts.edit', $row->id) . '" class="btn btn-sm btn-warning">
                    <i class="bi bi-pencil"></i>
                </a>
                <form action="' . route('dashboard.accounts.destroy', $row->id) . '" method="POST" style="display:inline">
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
        $filename = 'accounts_' . now()->format('Y_m_d_His');

        return match($format) {
            'xlsx' => Excel::download(new AccountsExport, $filename . '.xlsx'),
            'csv'  => Excel::download(new AccountsExport, $filename . '.csv', \Maatwebsite\Excel\Excel::CSV),
            'pdf'  => Excel::download(new AccountsExport, $filename . '.pdf', \Maatwebsite\Excel\Excel::DOMPDF),
            default => back()->with('error', 'Format not supported'),
        };
    }

    public function create()
    {
        $roles = Role::whereIn('type', ['admin', 'user'])->get();
        return view('dashboard.accounts.create', compact('roles'));
    }

    public function store(Request $request)
    {
        $request->validate(Account::validationRules());
        Account::create($request->all());
        return redirect()->route('dashboard.accounts.index')->with('success', __('account_created'));
    }

    public function edit(Account $account)
    {
        $roles = Role::whereIn('type', ['admin', 'user'])->get();
        return view('dashboard.accounts.edit', compact('account', 'roles'));
    }

    public function update(Request $request, Account $account)
    {
        $rules = Account::validationRules();
        $rules['email'] = ['required', 'string', 'email', 'unique:accounts,email,' . $account->id, 'max:254'];
        $request->validate($rules);
        $account->update($request->all());
        return redirect()->route('dashboard.accounts.index')->with('success', __('account_updated'));
    }

    public function show(Account $account)
    {
        return view('dashboard.accounts.show', compact('account'));
    }

    public function destroy(Account $account)
    {
        $account->delete();
        return redirect()->route('dashboard.accounts.index')->with('success', __('account_deleted'));
    }
}
