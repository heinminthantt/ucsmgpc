<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureRole
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        if (!\Illuminate\Support\Facades\Auth::check()) {
            abort(401);
        }

        $userRole = strtoupper($request->user()->role);
        $requiredRole = strtoupper($role);

        if ($userRole !== 'ADMIN' && $userRole !== $requiredRole) {
            abort(403, 'Unauthorized access.');
        }

        return $next($request);
    }
}
