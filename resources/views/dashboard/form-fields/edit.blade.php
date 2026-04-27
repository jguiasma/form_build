@extends('dashboard.layouts.app')

@section('title', 'Edit Field')
@section('page-title', 'Edit Field')

@section('content')

<div class="row">
    <div class="col-md-8">
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span><i class="bi bi-pencil me-2"></i>Edit Field — {{ $formField->label }}</span>
                <div class="d-flex gap-2">
                    <a href="{{ route('dashboard.form-fields.show', $formField->id) }}" class="btn btn-info btn-sm">
                        <i class="bi bi-eye me-1"></i> View
                    </a>
                    <a href="{{ route('dashboard.form-fields.index') }}" class="btn btn-secondary btn-sm">
                        <i class="bi bi-arrow-left me-1"></i> Back
                    </a>
                </div>
            </div>
            <div class="card-body">
                <form action="{{ route('dashboard.form-fields.update', $formField->id) }}" method="POST">
                    @csrf
                    @method('PUT')

                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label fw-semibold">Label <span class="text-danger">*</span></label>
                            <input
                                type="text"
                                name="label"
                                value="{{ old('label', $formField->label) }}"
                                class="form-control @error('label') is-invalid @enderror"
                            >
                            @error('label')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>

                        <div class="col-md-6 mb-3">
                            <label class="form-label fw-semibold">Field Key <span class="text-danger">*</span></label>
                            <input
                                type="text"
                                name="field_key"
                                value="{{ old('field_key', $formField->field_key) }}"
                                class="form-control @error('field_key') is-invalid @enderror"
                            >
                            @error('field_key')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label fw-semibold">Type <span class="text-danger">*</span></label>
                            <select name="type" class="form-select @error('type') is-invalid @enderror">
                                <option value="">Select type...</option>
                                @foreach(['text','textarea','number','email','password','select','radio','checkbox','date','file','submit','signature','phone','divider','rating','url','location','voice','payment','spacer','grouped'] as $type)
                                    <option value="{{ $type }}" {{ old('type', $formField->type) == $type ? 'selected' : '' }}>
                                        {{ ucfirst($type) }}
                                    </option>
                                @endforeach
                            </select>
                            @error('type')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>

                        <div class="col-md-6 mb-3">
                            <label class="form-label fw-semibold">Placeholder</label>
                            <input
                                type="text"
                                name="placeholder"
                                value="{{ old('placeholder', $formField->placeholder) }}"
                                class="form-control @error('placeholder') is-invalid @enderror"
                            >
                            @error('placeholder')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>
                    </div>

                    <div class="mb-3">
                        <label class="form-label fw-semibold">Description</label>
                        <textarea
                            name="description"
                            class="form-control @error('description') is-invalid @enderror"
                            rows="2"
                        >{{ old('description', $formField->description) }}</textarea>
                        @error('description')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @enderror
                    </div>
                    {{-- Form Categories --}}
                    <div class="mb-3">
                        <label class="form-label fw-semibold">Form Categories</label>
                        <div class="row row-cols-2 row-cols-md-3 g-2">
                            @foreach($categories as $category)
                                <div class="col">
                                    <div class="form-check">
                                        <input
                                            class="form-check-input"
                                            type="checkbox"
                                            name="category_ids[]"
                                            value="{{ $category->id }}"
                                            id="cat_{{ $category->id }}"
                                            {{ in_array($category->id, old('category_ids', $formField->categories->pluck('id')->toArray())) ? 'checked' : '' }}
                                        >
                                        <label class="form-check-label" for="cat_{{ $category->id }}">
                                            {{ $category->name }}
                                        </label>
                                    </div>
                                </div>
                            @endforeach
                        </div>
                        @if($categories->isEmpty())
                            <small class="text-muted">No categories available. <a href="{{ route('dashboard.form-categories.create') }}">Create one</a></small>
                        @endif
                    </div>

                    {{-- Packs --}}
                    <div class="mb-3">
                        <label class="form-label fw-semibold">Packs</label>
                        <div class="row row-cols-2 row-cols-md-3 g-2">
                            @foreach($packs as $pack)
                                <div class="col">
                                    <div class="form-check">
                                        <input
                                            class="form-check-input"
                                            type="checkbox"
                                            name="pack_ids[]"
                                            value="{{ $pack->id }}"
                                            id="pack_{{ $pack->id }}"
                                            {{ in_array($pack->id, old('pack_ids', $formField->packs->pluck('id')->toArray())) ? 'checked' : '' }}
                                        >
                                        <label class="form-check-label" for="pack_{{ $pack->id }}">
                                            {{ $pack->title }}
                                            <small class="text-muted">{{ $pack->amount }} TND</small>
                                        </label>
                                    </div>
                                </div>
                            @endforeach
                        </div>
                        @if($packs->isEmpty())
                            <small class="text-muted">No packs available. <a href="{{ route('dashboard.packs.create') }}">Create one</a></small>
                        @endif
                    </div>

                    <div class="mb-3">
                        <div class="form-check form-switch">
                            <input
                                class="form-check-input"
                                type="checkbox"
                                name="is_required"
                                id="is_required"
                                value="1"
                                {{ old('is_required', $formField->is_required) ? 'checked' : '' }}
                            >
                            <label class="form-check-label fw-semibold" for="is_required">Required</label>
                        </div>
                    </div>

                    <div class="d-flex gap-2 mt-2">
                        <button type="submit" class="btn btn-primary">
                            <i class="bi bi-check-lg me-1"></i> Update Field
                        </button>
                        <a href="{{ route('dashboard.form-fields.index') }}" class="btn btn-outline-secondary">
                            Cancel
                        </a>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

@endsection
