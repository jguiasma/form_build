<?php

namespace App\Http\Controllers;

use App\Http\Requests\Web\Registration\RegisterRequest;
use App\Http\Requests\Web\Auth\LoginRequest;
use App\Models\Account;
use App\Models\MagicCode;
use App\Notifications\SendVerificationCode;
use App\Http\Requests\Web\Registration\VerifyMagicCodeRequest;
use App\Http\Requests\Web\Registration\CompleteRegistrationRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AuthController extends Controller
{
    /**
     * Register a new account.
     */
   public function register(RegisterRequest $request): JsonResponse
    {
        $data = $request->validated();
        $this->generateAndSendMagicCode($data['email']);

        return response()->json([
            'success' => true,
            'message' => __('auth.magic_code_sent_verify'),
            'email'   => $data['email'],
        ], 201);
    }

    /**
     * Login request.
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $this->generateAndSendMagicCode($request->email);

        return response()->json([
            'success' => true,
            'message' => __('auth.magic_code_sent'),
            'email'   => $request->email,
        ]);
    }

    /**
     * Verify the magic code.
     */
    public function verify(VerifyMagicCodeRequest $request): JsonResponse
    {
        $data = $request->validated();

        $magicCode = MagicCode::where('email', $data['email'])
            ->where('is_valid', true)
            ->where('expiration_date', '>', Carbon::now())
            ->orderBy('created_at', 'desc')
            ->first();

        if (!$magicCode || !Hash::check($data['code'], $magicCode->code)) {
            return response()->json([
                'success' => false,
                'message' => __('auth.invalid_or_expired_code'),
            ], 422);
        }   

        // Mark as verified
        $magicCode->update([
            'is_valid' => false,
            'verified_at' => Carbon::now(),
        ]);

        $account = Account::with('role')->where('email', $data['email'])->first();

        if ($account && $account->role && $account->role->type === 'admin') {
            // Existing admin -> log in immediately
            $token = $account->createToken('auth_token')->plainTextToken;
            return response()->json([
                'success' => true,
                'message' => 'Code verified. Logged in.',
                'account' => $account,
                'token'   => $token,
                'requires_completion' => false
            ]);
        }

        // New user or existing user upgrading to admin -> requires completion
        return response()->json([
            'success' => true,
            'message' => !$account ? __('auth.code_verified_account_created') : __('auth.code_verified'),
            'account' => $account,
            'email'   => $data['email'],
            'verification_id' => $magicCode->id, // Proof
            'requires_completion' => true
        ]);
    }

    /**
     * Finalize registration (consolidated step).
     */
    public function finalizeRegistration(CompleteRegistrationRequest $request): JsonResponse
    {
        $data = $request->validated();

        // Security check: proof of verification
        $magicCode = MagicCode::where('id', $data['verification_token'])
            ->where('email', $data['email'])
            ->whereNotNull('verified_at')
            ->where('verified_at', '>', Carbon::now()->subMinutes(60))
            ->first();

        if (!$magicCode) {
            return response()->json(['success' => false, 'message' => 'Invalid verification or session expired.'], 401);
        }

        return DB::transaction(function () use ($data, $request) {
            $adminRoleId = \App\Models\Role::where('type', 'admin')->value('id') ?? 1;
            
            $account = Account::where('email', $data['email'])->first();
            
            if ($account) {
                $account->update([
                    'name' => $data['name'],
                    'phone_number' => $data['phone_number'],
                    'role_id' => $adminRoleId,
                ]);
            } else {
                $account = Account::create([
                    'name' => $data['name'],
                    'email' => $data['email'],
                    'phone_number' => $data['phone_number'],
                    'role_id' => $adminRoleId,
                ]);
            }

            // Handle Photo/Avatar
            $avatarUrl = $data['avatar'] ?? null;
            if ($request->hasFile('photo')) {
                $path = $request->file('photo')->store('avatars', 'public');
                $avatarUrl = $path; // Store relative path
            }

            // Handle Profile
            if ($account->profile) {
                $account->profile->update([
                    'specialty' => $data['specialty'],
                    'avatar'    => $avatarUrl ?? $account->profile->avatar,
                ]);
            } else {
                $account->profile()->create([
                    'specialty' => $data['specialty'],
                    'avatar'    => $avatarUrl,
                ]);
            }

            $token = $account->createToken('auth_token')->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'Registration complete!',
                'account' => $account->load('profile', 'role'),
                'token'   => $token,
            ]);
        });
    }

    private function generateAndSendMagicCode(string $email)
    {
        MagicCode::where('email', $email)->where('is_valid', true)->update(['is_valid' => false]);
        $code = str_pad((string)random_int(100000, 999999), 6, '0', STR_PAD_LEFT);

        MagicCode::create([
            'email' => $email,
            'code' => Hash::make($code),
            'expiration_date' => Carbon::now()->addMinutes(10),
            'is_valid' => true,
        ]);

        Notification::route('mail', $email)->notify(new SendVerificationCode($code));
    }
}
