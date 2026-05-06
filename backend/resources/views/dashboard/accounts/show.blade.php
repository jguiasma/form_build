@extends('dashboard.layouts.app')

@section('title', 'Account Details')
@section('page-title', 'Account Details')

@section('content')

<div class="row">
    <div class="col-md-8">
        <div class="card mb-4">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span><i class="bi bi-person-fill me-2"></i>Account Information</span>
                <div class="d-flex gap-2">
                    <a href="{{ route('dashboard.accounts.edit', $account->id) }}" class="btn btn-warning btn-sm">
                        <i class="bi bi-pencil me-1"></i> Edit
                    </a>
                    <a href="{{ route('dashboard.accounts.index') }}" class="btn btn-secondary btn-sm">
                        <i class="bi bi-arrow-left me-1"></i> Back
                    </a>
                </div>
            </div>
            <div class="card-body">
                <table class="table table-borderless">
                    <tr>
                        <th width="200" class="text-muted">ID</th>
                        <td>{{ $account->id }}</td>
                    </tr>
                    <tr>
                        <th class="text-muted">Name</th>
                        <td>{{ $account->name }}</td>
                    </tr>
                    <tr>
                        <th class="text-muted">Email</th>
                        <td>{{ $account->email }}</td>
                    </tr>
                    <tr>
                        <th class="text-muted">Phone</th>
                        <td>{{ $account->phone_number ?? '-' }}</td>
                    </tr>
                    <tr>
                        <th class="text-muted">Specialty</th>
                        <td>{{ $account->specialty ?? '-' }}</td>
                    </tr>
                    <tr>
                        <th class="text-muted">Role</th>
                        <td>
                            <span class="badge bg-primary">{{ $account->role->type ?? '-' }}</span>
                        </td>
                    </tr>
                    <tr>
                        <th class="text-muted">Created At</th>
                        <td>{{ $account->created_at->format('d M Y, H:i') }}</td>
                    </tr>
                </table>
            </div>
        </div>
    </div>

    <div class="col-md-4">
        <div class="card">
            <div class="card-header">
                <i class="bi bi-credit-card-fill me-2"></i>Subscriptions
                <span class="badge bg-primary ms-1">{{ $account->subscriptions->count() }}</span>
            </div>
            <div class="card-body p-0">
                @forelse($account->subscriptions as $subscription)
                    <div class="d-flex align-items-center justify-content-between p-3 border-bottom">
                        <div>
                            <div class="fw-bold small">{{ $subscription->pack->title }}</div>
                            <div class="text-muted" style="font-size:12px">{{ $subscription->validation_date->format('d M Y') }}</div>
                        </div>
                        <a href="{{ route('dashboard.subscriptions.show', $subscription->id) }}" class="btn btn-sm btn-outline-primary">
                            <i class="bi bi-eye"></i>
                        </a>
                    </div>
                @empty
                    <div class="p-3 text-muted text-center small">No subscriptions yet</div>
                @endforelse
            </div>
        </div>
    </div>
</div>

@endsection
