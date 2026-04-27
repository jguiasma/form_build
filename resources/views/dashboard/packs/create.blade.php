@extends('dashboard.layouts.app')

@section('title', 'Create Pack')
@section('page-title', 'Create Pack')

@section('content')

<div class="row">
    <div class="col-md-8">
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span><i class="bi bi-plus-lg me-2"></i>New Pack</span>
                <a href="{{ route('dashboard.packs.index') }}" class="btn btn-secondary btn-sm">
                    <i class="bi bi-arrow-left me-1"></i> Back
                </a>
            </div>
            <div class="card-body">
                <form action="{{ route('dashboard.packs.store') }}" method="POST">
                    @csrf

                    <div class="mb-3">
                        <label class="form-label fw-semibold">Title <span class="text-danger">*</span></label>
                        <input
                            type="text"
                            name="title"
                            value="{{ old('title') }}"
                            class="form-control @error('title') is-invalid @enderror"
                            placeholder="Pack title"
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
                            placeholder="Pack description..."
                        >{{ old('description') }}</textarea>
                        @error('description')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @enderror
                    </div>

                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label fw-semibold">Amount ($) <span class="text-danger">*</span></label>
                            <input
                                type="number"
                                name="amount"
                                value="{{ old('amount') }}"
                                class="form-control @error('amount') is-invalid @enderror"
                                placeholder="0.00"
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
                                value="{{ old('duration_days') }}"
                                class="form-control @error('duration_days') is-invalid @enderror"
                                placeholder="30"
                                min="1"
                            >
                            @error('duration_days')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>
                    </div>

                    <div class="d-flex gap-2 mt-2">
                        <button type="submit" class="btn btn-primary">
                            <i class="bi bi-check-lg me-1"></i> Create Pack
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
