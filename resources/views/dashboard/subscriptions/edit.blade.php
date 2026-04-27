@extends('dashboard.layouts.app')

@section('title', 'Edit Subscription')
@section('page-title', 'Edit Subscription')

@section('content')

<div class="row">
    <div class="col-md-8">
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span><i class="bi bi-pencil me-2"></i>Edit Subscription #{{ $subscription->id }}</span>
                <div class="d-flex gap-2">
                    <a href="{{ route('dashboard.subscriptions.index') }}" class="btn btn-secondary btn-sm">
                        <i class="bi bi-arrow-left me-1"></i> Back
                    </a>
                </div>
            </div>
            <div class="card-body">
                <form action="{{ route('dashboard.subscriptions.update', $subscription->id) }}" method="POST">
                    @csrf
                    @method('PUT')

                    <div class="mb-3">
                        <label class="form-label fw-semibold">Account <span class="text-danger">*</span></label>
                        <select name="account_id" class="form-select @error('account_id') is-invalid @enderror">
                            <option value="">Select account...</option>
                            @foreach($accounts as $account)
                                <option value="{{ $account->id }}" {{ old('account_id', $subscription->account_id) == $account->id ? 'selected' : '' }}>
                                    {{ $account->name }} — {{ $account->email }}
                                </option>
                            @endforeach
                        </select>
                        @error('account_id')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @enderror
                    </div>

                    <div class="mb-3">
                        <label class="form-label fw-semibold">Pack <span class="text-danger">*</span></label>
                        <select name="pack_id" class="form-select @error('pack_id') is-invalid @enderror">
                            <option value="">Select pack...</option>
                            @foreach($packs as $pack)
                                <option value="{{ $pack->id }}" {{ old('pack_id', $subscription->pack_id) == $pack->id ? 'selected' : '' }}>
                                    {{ $pack->title }} — ${{ $pack->amount }} / {{ $pack->duration_days }} days
                                </option>
                            @endforeach
                        </select>
                        @error('pack_id')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @enderror
                    </div>

                    <div class="mb-3">
                        <label class="form-label fw-semibold">Validation Date <span class="text-danger">*</span></label>
                        <input
                            type="date"
                            name="validation_date"
                            value="{{ old('validation_date', $subscription->validation_date->format('Y-m-d')) }}"
                            class="form-control @error('validation_date') is-invalid @enderror"
                        >
                        @error('validation_date')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @enderror
                    </div>

                    <div class="d-flex gap-2 mt-2">
                        <button type="submit" class="btn btn-primary">
                            <i class="bi bi-check-lg me-1"></i> Update Subscription
                        </button>
                        <a href="{{ route('dashboard.subscriptions.index') }}" class="btn btn-outline-secondary">
                            Cancel
                        </a>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

@endsection
