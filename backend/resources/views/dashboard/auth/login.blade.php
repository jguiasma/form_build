<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login — {{ config('app.name') }}</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css" rel="stylesheet">
    <style>
        body {
            min-height: 100vh;
            background-color: #1a1a2e;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .login-card {
            width: 100%;
            max-width: 420px;
            background: #fff;
            border-radius: 16px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }

        .login-brand {
            text-align: center;
            margin-bottom: 32px;
        }

        .login-brand .icon {
            width: 60px;
            height: 60px;
            background-color: #4e73df;
            border-radius: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 16px;
        }

        .login-brand .icon i {
            font-size: 28px;
            color: #fff;
        }

        .login-brand h4 {
            font-weight: 800;
            color: #1a1a2e;
            margin: 0;
        }

        .login-brand small {
            color: #aaa;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .form-label {
            font-weight: 600;
            font-size: 13px;
            color: #444;
        }

        .form-control {
            border-radius: 10px;
            padding: 12px 16px;
            font-size: 14px;
            border: 1.5px solid #e3e6f0;
        }

        .form-control:focus {
            border-color: #4e73df;
            box-shadow: 0 0 0 3px rgba(78,115,223,0.15);
        }

        .btn-login {
            background-color: #4e73df;
            color: #fff;
            border: none;
            border-radius: 10px;
            padding: 13px;
            font-weight: 700;
            font-size: 15px;
            width: 100%;
            transition: all 0.2s;
        }

        .btn-login:hover {
            background-color: #3a5fcf;
            transform: translateY(-1px);
        }
    </style>
</head>
<body>
    <div class="login-card">
        <div class="login-brand">
            <div class="icon">
                <i class="bi bi-layers-fill"></i>
            </div>
            <h4>FormFlow</h4>
            <small>Super Admin Access</small>
        </div>

        @if($errors->any())
            <div class="alert alert-danger alert-dismissible fade show mb-4" role="alert">
                <i class="bi bi-exclamation-triangle-fill me-2"></i>
                {{ $errors->first() }}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        @endif

        <form action="{{ route('dashboard.login') }}" method="POST">
            @csrf
            <div class="mb-3">
                <label class="form-label">Email Address</label>
                <div class="input-group">
                    <span class="input-group-text bg-white border-end-0">
                        <i class="bi bi-envelope text-muted"></i>
                    </span>
                    <input
                        type="email"
                        name="email"
                        value="{{ old('email') }}"
                        class="form-control border-start-0 @error('email') is-invalid @enderror"
                        placeholder="admin@example.com"
                        required
                        autofocus
                    >
                </div>
            </div>

            <div class="mb-4">
                <label class="form-label">Password</label>
                <div class="input-group">
                    <span class="input-group-text bg-white border-end-0">
                        <i class="bi bi-lock text-muted"></i>
                    </span>
                    <input
                        type="password"
                        name="password"
                        class="form-control border-start-0 @error('password') is-invalid @enderror"
                        placeholder="••••••••"
                        required
                    >
                </div>
            </div>

            <div class="mb-4 d-flex align-items-center justify-content-between">
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" name="remember" id="remember">
                    <label class="form-check-label text-muted small" for="remember">Remember me</label>
                </div>
            </div>

            <button type="submit" class="btn-login">
                <i class="bi bi-box-arrow-in-right me-2"></i>Sign In
            </button>
        </form>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
