<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Account;
use Illuminate\Http\Request;

class AccountController extends Controller
{
    public function index()
    {
        return response()->json(Account::with('role')->paginate(15));
    }

   public function store(Request $request)
    {
        $request->validate(Account::validationRules());
        $account = Account::create($request->all());
        return response()->json([
            'message' => __('account.created'),
            'data' => $account->load('role')
        ], 201);
    }

    public function show(Account $account)
    {
        return response()->json($account->load(['role', 'subscriptions.pack']));
    }

   public function update(Request $request, Account $account)
    {
        $rules = Account::validationRules();
        $rules['email'] = ['required', 'string', 'email', 'unique:accounts,email,' . $account->id, 'max:254'];
        $request->validate($rules);
        $account->update($request->all());
        return response()->json([
            'message' => __('account.updated'),
            'data' => $account->load('role')
        ]);
    }

    public function destroy(Account $account)
    {
        $account->delete();
        return response()->json(['message' => __('account.deleted')]);
    }
}
