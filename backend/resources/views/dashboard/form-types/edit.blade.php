@extends('dashboard.layouts.app')

@section('title', 'Edit Form Type')
@section('page-title', 'Edit Form Type')

@section('content')

<div class="row">
    <div class="col-md-6">
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span><i class="bi bi-pencil me-2"></i>Edit — {{ $formType->name }}</span>
                <div class="d-flex gap-2">
                    <a href="{{ route('dashboard.form-types.show', $formType->id) }}"
                        class="btn btn-info btn-sm">
                        <i class="bi bi-eye me-1"></i> View
                    </a>
                    <a href="{{ route('dashboard.form-types.index') }}"
                        class="btn btn-secondary btn-sm">
                        <i class="bi bi-arrow-left me-1"></i> Back
                    </a>
                </div>
            </div>
            <div class="card-body">
                <form action="{{ route('dashboard.form-types.update', $formType->id) }}"
                    method="POST">
                    @csrf
                    @method('PUT')

                    <div class="mb-3">
                        <label class="form-label fw-semibold">
                            Category <span class="text-danger">*</span>
                        </label>
                        <select name="form_category_id"
                            class="form-select @error('form_category_id') is-invalid @enderror">
                            <option value="">Select a category...</option>
                            @foreach($categories as $cat)
                                <option value="{{ $cat->id }}"
                                    {{ old('form_category_id', $formType->form_category_id) == $cat->id ? 'selected' : '' }}>
                                    {{ $cat->name }}
                                </option>
                            @endforeach
                        </select>
                        @error('form_category_id')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @enderror
                    </div>

                    <div class="mb-3">
                        <label class="form-label fw-semibold">
                            Name <span class="text-danger">*</span>
                        </label>
                        <input type="text" name="name"
                            value="{{ old('name', $formType->name) }}"
                            class="form-control @error('name') is-invalid @enderror">
                        @error('name')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @enderror
                    </div>

                    <div class="mb-3">
                        <label class="form-label fw-semibold">Description</label>
                        <textarea name="description"
                            class="form-control @error('description') is-invalid @enderror"
                            rows="3">{{ old('description', $formType->description) }}</textarea>
                        @error('description')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @enderror
                    </div>

                    <div class="mb-3">
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox"
                                name="is_active" id="is_active" value="1"
                                {{ old('is_active', $formType->is_active) ? 'checked' : '' }}>
                            <label class="form-check-label fw-semibold" for="is_active">
                                Active
                            </label>
                        </div>
                    </div>

                    <div class="d-flex gap-2">
                        <button type="submit" class="btn btn-primary">
                            <i class="bi bi-check-lg me-1"></i> Update
                        </button>
                        <a href="{{ route('dashboard.form-types.index') }}"
                            class="btn btn-outline-secondary">Cancel</a>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

@endsection