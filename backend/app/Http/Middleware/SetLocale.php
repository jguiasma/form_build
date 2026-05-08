<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\App;
class SetLocale
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    // app/Http/Middleware/SetLocale.php
public function handle(Request $request, Closure $next)
{
    $locale = $request->header('Accept-Language', config('app.locale'));

    $supported = ['fr', 'en', 'ar'];
    $locale = in_array($locale, $supported) ? $locale : config('app.locale');

    App::setLocale($locale);
    return $next($request);
}
}
