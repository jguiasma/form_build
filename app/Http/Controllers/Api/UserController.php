<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index()
    {
        return response()->json(User::with('role')->paginate(15));
    }

    public function store(Request $request)
    {
        $request->validate(User::validationRules());
        $user = User::create($request->all());
        return response()->json($user->load('role'), 201);
    }

    public function show(User $user)
    {
        return response()->json($user->load(['role', 'subscriptions.pack']));
    }

    public function update(Request $request, User $user)
    {
        $rules = User::validationRules();
        $rules['email'] = ['required', 'string', 'email', 'unique:users,email,' . $user->id, 'max:254'];
        $rules['password'] = ['sometimes', 'string', 'min:8'];

        $request->validate($rules);
        $user->update($request->all());
        return response()->json($user->load('role'));
    }

    public function destroy(User $user)
    {
        $user->delete();
        return response()->json(['message' => 'User deleted']);
    }
}
