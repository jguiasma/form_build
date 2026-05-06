@extends('dashboard.layouts.app')

@section('title', 'Subscription Details')
@section('page-title', 'Subscription Details')

@section('content')

<div class="row">
    <div class="col-md-8">
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span><i class="bi bi-credit-card-fill me-2"></i>Subscription Information</span>
                <div class="d-flex gap-2">
                    <a href="{{ route('dashboard.subscriptions.edit', $subscription->id) }}" class="btn btn-warning btn-sm">
                        <i class="bi bi-pencil me-1"></i> Edit
                    </a>
                    <a href="{{ route('dashboard.subscriptions.index') }}" class="btn btn-secondary btn-sm">
                        <i class="bi bi-arrow-left me-1"></i> Back
                    </a>
                </div>
            </div>
            <div class="card-body">
                <table class="table table-borderless">
                    <tr>
                        <th width="200" class="text-muted">ID</th>
                        <td>{{ $subscription->id }}</td>
                    </tr>
                    <tr>
                        <th class="text-muted">Account</th>
                        <td>
                            <a href="{{ route('dashboard.accounts.show', $subscription->account->id) }}">
                                {{ $subscription->account->name }}
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <th class="text-muted">Pack</th>
                        <td>
                            <a href="{{ route('dashboard.packs.show', $subscription->pack->id) }}">
                                {{ $subscription->pack->title }}
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <th class="text-muted">Amount</th>
                        <td>{{ number_format($subscription->pack->amount, 2) }} TND</td>
                    </tr>
                    <tr>
                        <th class="text-muted">Duration</th>
                        <td>{{ $subscription->pack->duration_days }} days</td>
                    </tr>
                    <tr>
                        <th class="text-muted">Validation Date</th>
                        <td>{{ $subscription->validation_date->format('d M Y') }}</td>
                    </tr>
                    <tr>
                        <th class="text-muted">Created At</th>
                        <td>{{ $subscription->created_at->format('d M Y, H:i') }}</td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
</div>

@endsection
