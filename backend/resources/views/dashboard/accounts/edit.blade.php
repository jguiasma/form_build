@extends('dashboard.layouts.app')

@section('title', 'Edit Account')
@section('page-title', 'Edit Account')

@section('content')

<div class="row">
    <div class="col-md-8">
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span><i class="bi bi-pencil me-2"></i>Edit Account — {{ $account->name }}</span>
                <div class="d-flex gap-2">
                    <a href="{{ route('dashboard.accounts.show', $account->id) }}" class="btn btn-info btn-sm">
                        <i class="bi bi-eye me-1"></i> View
                    </a>
                    <a href="{{ route('dashboard.accounts.index') }}" class="btn btn-secondary btn-sm">
                        <i class="bi bi-arrow-left me-1"></i> Back
                    </a>
                </div>
            </div>
            <div class="card-body">
                <form action="{{ route('dashboard.accounts.update', $account->id) }}" method="POST">
                    @csrf
                    @method('PUT')

                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label fw-semibold">Name <span class="text-danger">*</span></label>
                            <input
                                type="text"
                                name="name"
                                value="{{ old('name', $account->name) }}"
                                class="form-control @error('name') is-invalid @enderror"
                            >
                            @error('name')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>

                        <div class="col-md-6 mb-3">
                            <label class="form-label fw-semibold">Email <span class="text-danger">*</span></label>
                            <input
                                type="email"
                                name="email"
                                value="{{ old('email', $account->email) }}"
                                class="form-control @error('email') is-invalid @enderror"
                            >
                            @error('email')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label fw-semibold">Phone Number</label>
                            <input
                                type="text"
                                name="phone_number"
                                value="{{ old('phone_number', $account->phone_number) }}"
                                class="form-control @error('phone_number') is-invalid @enderror"
                            >
                            @error('phone_number')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>

                        <div class="col-md-6 mb-3">
                            <label class="form-label fw-semibold">Specialty</label>
                            <input
                                type="text"
                                name="specialty"
                                value="{{ old('specialty', $account->specialty) }}"
                                class="form-control @error('specialty') is-invalid @enderror"
                            >
                            @error('specialty')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>
                    </div>

                    <div class="mb-3">
                        <label class="form-label fw-semibold">Role <span class="text-danger">*</span></label>
                        <select name="role_id" class="form-select @error('role_id') is-invalid @enderror">
                            <option value="">Select role...</option>
                            @foreach($roles as $role)
                                <option value="{{ $role->id }}" {{ old('role_id', $account->role_id) == $role->id ? 'selected' : '' }}>
                                    {{ ucfirst($role->type) }}
                                </option>
                            @endforeach
                        </select>
                        @error('role_id')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @enderror
                    </div>

                    <div class="d-flex gap-2 mt-2">
                        <button type="submit" class="btn btn-primary">
                            <i class="bi bi-check-lg me-1"></i> Update Account
                        </button>
                        <a href="{{ route('dashboard.accounts.index') }}" class="btn btn-outline-secondary">
                            Cancel
                        </a>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

@endsection
