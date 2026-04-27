@extends('dashboard.layouts.app')

@section('title', 'Pack Details')
@section('page-title', 'Pack Details')

@section('content')

<div class="row">
    <div class="col-md-8">
        <div class="card mb-4">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span><i class="bi bi-box-seam-fill me-2"></i>Pack Information</span>
                <div class="d-flex gap-2">
                    <a href="{{ route('dashboard.packs.edit', $pack->id) }}" class="btn btn-warning btn-sm">
                        <i class="bi bi-pencil me-1"></i> Edit
                    </a>
                    <a href="{{ route('dashboard.packs.index') }}" class="btn btn-secondary btn-sm">
                        <i class="bi bi-arrow-left me-1"></i> Back
                    </a>
                </div>
            </div>
            <div class="card-body">
                <table class="table table-borderless">
                    <tr>
                        <th width="200" class="text-muted">ID</th>
                        <td>{{ $pack->id }}</td>
                    </tr>
                    <tr>
                        <th class="text-muted">Title</th>
                        <td>{{ $pack->title }}</td>
                    </tr>
                    <tr>
                        <th class="text-muted">Description</th>
                        <td>{{ $pack->description ?? '-' }}</td>
                    </tr>
                    <tr>
                        <th class="text-muted">Amount</th>
                        <td><strong>{{ number_format($pack->amount, 2) }}TND</strong></td>
                    </tr>
                    <tr>
                        <th class="text-muted">Duration</th>
                        <td>{{ $pack->duration_days }} days</td>
                    </tr>
                    <tr>
                        <th class="text-muted">Created At</th>
                        <td>{{ $pack->created_at->format('d M Y, H:i') }}</td>
                    </tr>
                    <tr>
                        <th class="text-muted">Updated At</th>
                        <td>{{ $pack->updated_at->format('d M Y, H:i') }}</td>
                    </tr>
                </table>
            </div>
        </div>
    </div>

    <div class="col-md-4">
        <div class="card">
            <div class="card-header">
                <i class="bi bi-credit-card-fill me-2"></i>Subscriptions
                <span class="badge bg-primary ms-1">{{ $pack->subscriptions->count() }}</span>
            </div>
            <div class="card-body p-0">
                @forelse($pack->subscriptions as $subscription)
                    <div class="d-flex align-items-center justify-content-between p-3 border-bottom">
                        <div>
                            <div class="fw-bold small">{{ $subscription->account->name }}</div>
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
