<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Subscription;
use App\Models\Account;
use App\Models\Pack;
use Illuminate\Http\Request;
use Yajra\DataTables\Facades\DataTables;

class SubscriptionController extends Controller
{
    public function index()
    {
        return view('dashboard.subscriptions.index');
    }

    public function datatable()
    {
        $subscriptions = Subscription::with(['account', 'pack'])->select('subscriptions.*');

        return DataTables::of($subscriptions)
           ->addColumn('actions', fn($row) => '
                <a href="' . route('dashboard.subscriptions.show', $row->id) . '" class="btn btn-sm btn-info">
                    <i class="bi bi-eye"></i>
                </a>
                <a href="' . route('dashboard.subscriptions.edit', $row->id) . '" class="btn btn-sm btn-warning">
                    <i class="bi bi-pencil"></i>
                </a>
                <form action="' . route('dashboard.subscriptions.destroy', $row->id) . '" method="POST" style="display:inline">
                    ' . csrf_field() . method_field('DELETE') . '
                    <button class="btn btn-sm btn-danger" onclick="return confirm(\'Are you sure?\')">
                        <i class="bi bi-trash"></i>
                    </button>
                </form>
            ')
            ->addColumn('account', fn($row) => $row->account->name ?? '-')
            ->addColumn('pack', fn($row) => $row->pack->title ?? '-')
            ->rawColumns(['actions'])
            ->make(true);
    }

    public function create()
    {
        $accounts = Account::all();
        $packs = Pack::all();
        return view('dashboard.subscriptions.create', compact('accounts', 'packs'));
    }

    public function store(Request $request)
    {
        $request->validate(Subscription::validationRules());
        Subscription::create($request->all());
        return redirect()->route('dashboard.subscriptions.index')->with('success', 'Subscription created successfully');
    }

    public function edit(Subscription $subscription)
    {
        $accounts = Account::all();
        $packs = Pack::all();
        return view('dashboard.subscriptions.edit', compact('subscription', 'accounts', 'packs'));
    }

    public function update(Request $request, Subscription $subscription)
    {
        $request->validate(Subscription::validationRules());
        $subscription->update($request->all());
        return redirect()->route('dashboard.subscriptions.index')->with('success', 'Subscription updated successfully');
    }
    public function show(Subscription $subscription)
    {
        return view('dashboard.subscriptions.show', compact('subscription'));
    }

    public function destroy(Subscription $subscription)
    {
        $subscription->delete();
        return redirect()->route('dashboard.subscriptions.index')->with('success', 'Subscription deleted successfully');
    }
}
