<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Subscription;
use Illuminate\Http\Request;

class SubscriptionController extends Controller
{
    public function index()
    {
        return response()->json(Subscription::with(['user', 'pack'])->paginate(15));
    }

    public function store(Request $request)
    {
        $request->validate(Subscription::validationRules());
        $subscription = Subscription::create($request->all());
        return response()->json($subscription->load(['user', 'pack']), 201 , ['message' => __('subscription.created')]);
    }

    public function show(Subscription $subscription)
    {
        return response()->json($subscription->load(['user', 'pack']));
    }

    public function update(Request $request, Subscription $subscription)
    {
        $request->validate(Subscription::validationRules());
        $subscription->update($request->all());
        return response()->json($subscription->load(['user', 'pack']), ['message' => __('subscription.updated')]);
    }

    public function destroy(Subscription $subscription)
    {
        $subscription->delete();
        return response()->json(['message' => __('subscription.deleted')]);
    }
}
