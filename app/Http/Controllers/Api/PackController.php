<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pack;
use Illuminate\Http\Request;

class PackController extends Controller
{
    public function index()
    {
        return response()->json(Pack::all());
    }

    public function store(Request $request)
    {
        $request->validate(Pack::validationRules());
        $pack = Pack::create($request->all());
        return response()->json($pack, 201);
    }

    public function show(Pack $pack)
    {
        return response()->json($pack->load('subscriptions'));
    }

    public function update(Request $request, Pack $pack)
    {
        $request->validate(Pack::validationRules());
        $pack->update($request->all());
        return response()->json($pack);
    }

    public function destroy(Pack $pack)
    {
        $pack->delete();
        return response()->json(['message' => 'Pack deleted']);
    }
}
