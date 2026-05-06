@extends('dashboard.layouts.app')

@section('title', 'Edit Pack')
@section('page-title', 'Edit Pack')

@section('content')

<div class="row">
    <div class="col-md-8">
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span><i class="bi bi-pencil me-2"></i>Edit Pack — {{ $pack->title }}</span>
                <div class="d-flex gap-2">
                    <a href="{{ route('dashboard.packs.index') }}" class="btn btn-secondary btn-sm">
                        <i class="bi bi-arrow-left me-1"></i> Back
                    </a>
                </div>
            </div>
            <div class="card-body">
                <form action="{{ route('dashboard.packs.update', $pack->id) }}" method="POST">
                    @csrf
                    @method('PUT')

                    <div class="mb-3">
                        <label class="form-label fw-semibold">Title <span class="text-danger">*</span></label>
                        <input
                            type="text"
                            name="title"
                            value="{{ old('title', $pack->title) }}"
                            class="form-control @error('title') is-invalid @enderror"
                        >
                        @error('title')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @enderror
                    </div>

                    <div class="mb-3">
                        <label class="form-label fw-semibold">Description</label>
                        <textarea
                            name="description"
                            class="form-control @error('description') is-invalid @enderror"
                            rows="3"
                        >{{ old('description', $pack->description) }}</textarea>
                        @error('description')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @enderror
                    </div>

                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label fw-semibold">Amount (TND) <span class="text-danger">*</span></label>
                            <input
                                type="number"
                                name="amount"
                                value="{{ old('amount', $pack->amount) }}"
                                class="form-control @error('amount') is-invalid @enderror"
                                step="0.01"
                                min="0"
                            >
                            @error('amount')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>

                        <div class="col-md-6 mb-3">
                            <label class="form-label fw-semibold">Duration (days) <span class="text-danger">*</span></label>
                            <input
                                type="number"
                                name="duration_days"
                                value="{{ old('duration_days', $pack->duration_days) }}"
                                class="form-control @error('duration_days') is-invalid @enderror"
                                min="1"
                            >
                            @error('duration_days')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>
                    </div>

                    <div class="d-flex gap-2 mt-2">
                        <button type="submit" class="btn btn-primary">
                            <i class="bi bi-check-lg me-1"></i> Update Pack
                        </button>
                        <a href="{{ route('dashboard.packs.index') }}" class="btn btn-outline-secondary">
                            Cancel
                        </a>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

@endsection
