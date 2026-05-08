<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'Dashboard') — {{ config('app.name') }}</title>

    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Bootstrap Icons -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css" rel="stylesheet">
    <!-- DataTables -->
    <link href="https://cdn.datatables.net/1.13.6/css/dataTables.bootstrap5.min.css" rel="stylesheet">

    <style>
        body {
            min-height: 100vh;
            background-color: #f4f6f9;
        }

        .sidebar {
            width: 260px;
            min-height: 100vh;
            background-color: #1a1a2e;
            position: fixed;
            top: 0;
            left: 0;
            z-index: 100;
            transition: all 0.3s;
        }

        .sidebar .brand {
            padding: 20px;
            border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .sidebar .brand h5 {
            color: #fff;
            font-weight: 700;
            margin: 0;
        }

        .sidebar .brand small {
            color: rgba(255,255,255,0.4);
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .sidebar .nav-link {
            color: rgba(255,255,255,0.6);
            padding: 12px 20px;
            font-size: 14px;
            font-weight: 500;
            border-radius: 0;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .sidebar .nav-link:hover,
        .sidebar .nav-link.active {
            color: #fff;
            background-color: rgba(255,255,255,0.1);
            border-left: 3px solid #4e73df;
        }

        .sidebar .nav-link i {
            font-size: 16px;
            width: 20px;
        }

        .sidebar .nav-section {
            padding: 16px 20px 8px;
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            color: rgba(255,255,255,0.3);
            font-weight: 700;
        }

        .main-content {
            margin-left: 260px;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }

        .topbar {
            background-color: #fff;
            padding: 0 24px;
            height: 64px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid #e3e6f0;
            position: sticky;
            top: 0;
            z-index: 99;
        }

        .topbar .page-title {
            font-size: 18px;
            font-weight: 700;
            color: #1a1a2e;
            margin: 0;
        }

        .content-wrapper {
            padding: 24px;
            flex: 1;
        }

        .card {
            border: none;
            border-radius: 12px;
            box-shadow: 0 2px 12px rgba(0,0,0,0.06);
        }

        .card-header {
            background-color: #fff;
            border-bottom: 1px solid #e3e6f0;
            border-radius: 12px 12px 0 0 !important;
            padding: 16px 20px;
            font-weight: 700;
            font-size: 15px;
        }

        .stat-card {
            border-radius: 12px;
            padding: 20px;
            color: #fff;
            border: none;
        }

        .stat-card .stat-icon {
            font-size: 32px;
            opacity: 0.7;
        }

        .stat-card .stat-value {
            font-size: 28px;
            font-weight: 800;
        }

        .stat-card .stat-label {
            font-size: 13px;
            opacity: 0.85;
        }

        .btn-primary {
            background-color: #4e73df;
            border-color: #4e73df;
        }

        .badge {
            font-size: 11px;
        }
    </style>

    @stack('styles')
</head>
<body>

    <!-- Sidebar -->
    <div class="sidebar">
        <div class="brand">
            <h5><i class="bi bi-layers-fill me-2"></i>FormFlow</h5>
            <small>Super Admin</small>
        </div>

        <nav class="mt-2">
            <div class="nav-section">Main</div>

            <a href="{{ route('dashboard.home') }}"
               class="nav-link {{ request()->routeIs('dashboard.home') ? 'active' : '' }}">
                <i class="bi bi-speedometer2"></i> Dashboard
            </a>

            <div class="nav-section">Management</div>

            <a href="{{ route('dashboard.accounts.index') }}"
               class="nav-link {{ request()->routeIs('dashboard.accounts.*') ? 'active' : '' }}">
                <i class="bi bi-people-fill"></i> Accounts
            </a>

            <a href="{{ route('dashboard.packs.index') }}"
               class="nav-link {{ request()->routeIs('dashboard.packs.*') ? 'active' : '' }}">
                <i class="bi bi-box-seam-fill"></i> Packs
            </a>

            <a href="{{ route('dashboard.subscriptions.index') }}"
               class="nav-link {{ request()->routeIs('dashboard.subscriptions.*') ? 'active' : '' }}">
                <i class="bi bi-credit-card-fill"></i> Subscriptions
            </a>

            <div class="nav-section">Forms</div>

            <a href="{{ route('dashboard.form-categories.index') }}"
               class="nav-link {{ request()->routeIs('dashboard.form-categories.*') ? 'active' : '' }}">
                <i class="bi bi-tag-fill"></i> Form Categories
            </a>

            <a href="{{ route('dashboard.form-types.index') }}"
               class="nav-link {{ request()->routeIs('dashboard.form-types.*') ? 'active' : '' }}">
                <i class="bi bi-journal-text"></i> Form Types
            </a>

            <a href="{{ route('dashboard.form-fields.index') }}"
               class="nav-link {{ request()->routeIs('dashboard.form-fields.*') ? 'active' : '' }}">
                <i class="bi bi-ui-checks"></i> Form Fields
            </a>
        </nav>
    </div>

    <!-- Main Content -->
    <div class="main-content">

        <!-- Topbar -->
        <div class="topbar">
            <h1 class="page-title">@yield('page-title', 'Dashboard')</h1>

            <div class="d-flex align-items-center gap-3">
                <span class="text-muted small">
                    <i class="bi bi-person-circle me-1"></i>
                    {{ Auth::user()->name }}
                </span>
                <form action="{{ route('dashboard.logout') }}" method="POST" class="m-0">
                    @csrf
                    <button type="submit" class="btn btn-sm btn-outline-danger">
                        <i class="bi bi-box-arrow-right me-1"></i> Logout
                    </button>
                </form>
            </div>
        </div>

        <!-- Content -->
        <div class="content-wrapper">

            {{-- Alerts --}}
            @if(session('success'))
                <div class="alert alert-success alert-dismissible fade show" role="alert">
                    <i class="bi bi-check-circle-fill me-2"></i>{{ session('success') }}
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                </div>
            @endif

            @if(session('error'))
                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                    <i class="bi bi-exclamation-triangle-fill me-2"></i>{{ session('error') }}
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                </div>
            @endif

            @yield('content')
        </div>
    </div>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <!-- jQuery -->
    <script src="https://code.jquery.com/jquery-3.7.0.min.js"></script>
    <!-- DataTables -->
    <script src="https://cdn.datatables.net/1.13.6/js/jquery.dataTables.min.js"></script>
    <script src="https://cdn.datatables.net/1.13.6/js/dataTables.bootstrap5.min.js"></script>

    @stack('scripts')
</body>
</html>
