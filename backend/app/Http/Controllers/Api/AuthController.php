<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MagicCode;
use App\Models\Account;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Carbon\Carbon;

class AuthController extends Controller
{
    public function sendMagicCode(Request $request)
    {
        $request->validate(['email' => 'required|email|exists:accounts,email']);

        MagicCode::where('email', $request->email)->update(['is_valid' => false]);

        $code = Str::random(6);

        MagicCode::create([
            'email' => $request->email,
            'code' => $code,
            'expiration_date' => Carbon::now()->addMinutes(15),
            'is_valid' => true,
        ]);

        // TODO: Mail::to($request->email)->send(new MagicCodeMail($code));

        return response()->json(['message' => 'Magic code sent successfully']);
    }

    public function verifyMagicCode(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'code' => 'required|string',
        ]);

        $magicCode = MagicCode::where('email', $request->email)
            ->where('code', $request->code)
            ->where('is_valid', true)
            ->first();

        if (!$magicCode) {
            return response()->json(['message' => 'Invalid code'], 401);
        }

        if ($magicCode->isExpired()) {
            $magicCode->update(['is_valid' => false]);
            return response()->json(['message' => 'Code expired'], 401);
        }

        $magicCode->update([
            'is_valid' => false,
            'verified_at' => Carbon::now(),
        ]);

        $account = Account::where('email', $request->email)->first();
        $token = $account->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Authenticated successfully',
            'token' => $token,
            'account' => $account->load('role'),
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out successfully']);
    }

    public function me(Request $request)
    {
        return response()->json($request->user()->load('role'));
    }
}
