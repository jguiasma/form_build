<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IsSuperAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->user() || $request->user()->email !== config('app.super_admin_email')) {
            return response()->json(['message' => 'Unauthorized. Super Admin access required.'], 403);
        }

        return $next($request);
    }
}
