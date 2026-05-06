@extends('dashboard.layouts.app')

@section('title', 'Dashboard')
@section('page-title', 'Dashboard')

@section('content')

<div class="row g-4 mb-4">
    <div class="col-sm-6 col-xl-3">
        <div class="stat-card" style="background: linear-gradient(135deg, #4e73df, #3a5fcf)">
            <div class="d-flex justify-content-between align-items-start">
                <div>
                    <div class="stat-label">Total Accounts</div>
                    <div class="stat-value">{{ $stats['accounts'] }}</div>
                </div>
                <i class="bi bi-people-fill stat-icon"></i>
            </div>
        </div>
    </div>
    <div class="col-sm-6 col-xl-3">
        <div class="stat-card" style="background: linear-gradient(135deg, #1cc88a, #17a673)">
            <div class="d-flex justify-content-between align-items-start">
                <div>
                    <div class="stat-label">Total Forms</div>
                    <div class="stat-value">{{ $stats['forms'] }}</div>
                </div>
                <i class="bi bi-file-earmark-text-fill stat-icon"></i>
            </div>
        </div>
    </div>
    <div class="col-sm-6 col-xl-3">
        <div class="stat-card" style="background: linear-gradient(135deg, #f6c23e, #dda20a)">
            <div class="d-flex justify-content-between align-items-start">
                <div>
                    <div class="stat-label">Total Packs</div>
                    <div class="stat-value">{{ $stats['packs'] }}</div>
                </div>
                <i class="bi bi-box-seam-fill stat-icon"></i>
            </div>
        </div>
    </div>
    <div class="col-sm-6 col-xl-3">
        <div class="stat-card" style="background: linear-gradient(135deg, #e74a3b, #c0392b)">
            <div class="d-flex justify-content-between align-items-start">
                <div>
                    <div class="stat-label">Subscriptions</div>
                    <div class="stat-value">{{ $stats['subscriptions'] }}</div>
                </div>
                <i class="bi bi-credit-card-fill stat-icon"></i>
            </div>
        </div>
    </div>
</div>

@endsection
