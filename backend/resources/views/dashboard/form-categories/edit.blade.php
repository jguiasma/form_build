@extends('dashboard.layouts.app')

@section('title', 'Edit Category')
@section('page-title', 'Edit Category')

@section('content')

<div class="row">
    <div class="col-md-8">
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span><i class="bi bi-pencil me-2"></i>Edit Category — {{ $formCategory->name }}</span>
                <div class="d-flex gap-2">
                    <a href="{{ route('dashboard.form-categories.index') }}" class="btn btn-secondary btn-sm">
                        <i class="bi bi-arrow-left me-1"></i> Back
                    </a>
                </div>
            </div>
            <div class="card-body">
                <form action="{{ route('dashboard.form-categories.update', $formCategory->id) }}" method="POST">
                    @csrf
                    @method('PUT')

                    <div class="mb-3">
                        <label class="form-label fw-semibold">Name <span class="text-danger">*</span></label>
                        <input
                            type="text"
                            name="name"
                            value="{{ old('name', $formCategory->name) }}"
                            class="form-control @error('name') is-invalid @enderror"
                        >
                        @error('name')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @enderror
                    </div>

                    <div class="mb-3">
                        <label class="form-label fw-semibold">Description</label>
                        <textarea
                            name="description"
                            class="form-control @error('description') is-invalid @enderror"
                            rows="3"
                        >{{ old('description', $formCategory->description) }}</textarea>
                        @error('description')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @enderror
                    </div>

                    {{-- Icon --}}
                    <div class="mb-3">
                        <label class="form-label fw-semibold">Icon</label>
                        <div class="d-flex flex-wrap gap-2 mt-1">
                            @foreach([
                                'people-fill' => 'bi-people-fill',
                                'heart-fill' => 'bi-heart-fill',
                                'mortarboard-fill' => 'bi-mortarboard-fill',
                                'bank' => 'bi-bank',
                                'currency-dollar' => 'bi-currency-dollar',
                                'file-text-fill' => 'bi-file-text-fill',
                                'building-fill' => 'bi-building-fill',
                                'briefcase-fill' => 'bi-briefcase-fill',
                                'shield-fill' => 'bi-shield-fill',
                            ] as $value => $iconClass)
                                <div>
                                    <input
                                        type="radio"
                                        name="icon"
                                        value="{{ $value }}"
                                        id="icon_{{ $value }}"
                                        class="d-none icon-radio"
                                        {{ old('icon', $formCategory->icon) == $value ? 'checked' : '' }}
                                    >
                                    <label
                                        for="icon_{{ $value }}"
                                        class="icon-swatch d-flex align-items-center justify-content-center border rounded"
                                        style="width:44px; height:44px; cursor:pointer; font-size:20px; transition: all 0.2s;"
                                        title="{{ $value }}"
                                    >
                                        <i class="bi {{ $iconClass }}"></i>
                                    </label>
                                </div>
                            @endforeach
                        </div>
                    </div>

                    {{-- Color --}}
                    <div class="mb-3">
                        <label class="form-label fw-semibold">Color</label>
                        <div class="d-flex flex-wrap gap-2 mt-1">
                            @foreach([
                                '#6366f1', '#ef4444', '#10b981',
                                '#f59e0b', '#8b5cf6', '#ec4899',
                                '#06b6d4', '#f97316'
                            ] as $color)
                                <div>
                                    <input
                                        type="radio"
                                        name="color"
                                        value="{{ $color }}"
                                        id="color_{{ $loop->index }}"
                                        class="d-none color-radio"
                                        {{ old('color', $formCategory->color) == $color ? 'checked' : '' }}
                                    >
                                    <label
                                        for="color_{{ $loop->index }}"
                                        class="color-swatch"
                                        style="background-color: {{ $color }}; width:32px; height:32px; border-radius:50%; display:inline-block; cursor:pointer; border: 3px solid transparent; transition: all 0.2s;"
                                    ></label>
                                </div>
                            @endforeach
                        </div>
                    </div>

                    <div class="mb-3">
                        <div class="form-check form-switch">
                            <input
                                class="form-check-input"
                                type="checkbox"
                                name="is_active"
                                id="is_active"
                                value="1"
                                {{ old('is_active', $formCategory->is_active) ? 'checked' : '' }}
                            >
                            <label class="form-check-label fw-semibold" for="is_active">Active</label>
                        </div>
                    </div>

                    <div class="d-flex gap-2 mt-2">
                        <button type="submit" class="btn btn-primary">
                            <i class="bi bi-check-lg me-1"></i> Update Category
                        </button>
                        <a href="{{ route('dashboard.form-categories.index') }}" class="btn btn-outline-secondary">
                            Cancel
                        </a>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

@endsection

@push('styles')
<style>
    .color-radio:checked + .color-swatch {
        border-color: #1a1a2e !important;
        transform: scale(1.2);
    }
    .color-swatch:hover {
        transform: scale(1.1);
    }
    .icon-radio:checked + .icon-swatch {
        background-color: #e8ecfd;
        border-color: #4e73df !important;
        color: #4e73df;
    }
    .icon-swatch:hover {
        background-color: #f1f3ff;
        border-color: #4e73df !important;
    }
</style>
@endpush
