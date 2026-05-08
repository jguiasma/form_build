<?php

namespace App\Http\Middleware;
use Closure;
use Illuminate\Http\Request;

class CheckRole
{
    /**
     * Usage:
     * ->middleware('role:superadmin')
     * ->middleware('role:superadmin,admin')
     * ->middleware('role:superadmin,admin,creator')
     */
    public function handle(Request $request, Closure $next, string ...$roles): mixed
    {
        $account = $request->user();

        // 1. Not authenticated
        if (!$account) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated. Please log in.',
            ], 401);
        }

        // 2. Load role relation
        $account->loadMissing('role');
        $roleType = $account->role?->type;

        // 3. Check if role is allowed
        if (!in_array($roleType, $roles)) {
            return response()->json([
                'success'        => false,
                'message'        => 'Forbidden. You do not have access to this resource.',
                'your_role'      => $roleType,
                'required_roles' => $roles,
            ], 403);
        }

        return $next($request);
    }
}
