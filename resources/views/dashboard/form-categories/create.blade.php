@extends('dashboard.layouts.app')

@section('title', 'Create Category')
@section('page-title', 'Create Category')

@section('content')

<div class="row">
    <div class="col-md-8">
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span><i class="bi bi-plus-lg me-2"></i>New Category</span>
                <a href="{{ route('dashboard.form-categories.index') }}" class="btn btn-secondary btn-sm">
                    <i class="bi bi-arrow-left me-1"></i> Back
                </a>
            </div>
            <div class="card-body">
                <form action="{{ route('dashboard.form-categories.store') }}" method="POST" enctype="multipart/form-data">
                    @csrf

                    <div class="mb-3">
                        <label class="form-label fw-semibold">Name <span class="text-danger">*</span></label>
                        <input
                            type="text"
                            name="name"
                            value="{{ old('name') }}"
                            class="form-control @error('name') is-invalid @enderror"
                            placeholder="Ex: Ressources Humaines"
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
                            placeholder="Category description..."
                        >{{ old('description') }}</textarea>
                        @error('description')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @enderror
                    </div>

                    {{-- Icon --}}
                    <div class="mb-3">
                        <label class="form-label fw-semibold">Icon</label>
                        <div class="d-flex flex-wrap gap-2 mt-1 align-items-center">
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
                                        {{ old('icon') == $value ? 'checked' : '' }}
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

                            {{-- Bouton + pour upload PNG --}}
                            <div>
                                <input
                                    type="file"
                                    name="icon_upload"
                                    id="icon_upload"
                                    accept=".png"
                                    class="d-none"
                                    onchange="previewUploadedIcon(this)"
                                >
                                <label
                                    for="icon_upload"
                                    id="upload-btn"
                                    class="icon-swatch d-flex align-items-center justify-content-center border rounded border-dashed"
                                    style="width:44px; height:44px; cursor:pointer; font-size:20px; transition: all 0.2s; border-style: dashed !important;"
                                    title="Upload PNG icon"
                                >
                                    <span id="upload-preview" style="display:none; width:28px; height:28px; object-fit:contain;"></span>
                                    <i class="bi bi-plus-lg" id="upload-plus-icon"></i>
                                </label>
                            </div>
                        </div>
                        @error('icon')
                            <div class="text-danger small mt-1">{{ $message }}</div>
                        @enderror
                        @error('icon_upload')
                            <div class="text-danger small mt-1">{{ $message }}</div>
                        @enderror
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
                                        {{ old('color') == $color ? 'checked' : '' }}
                                    >
                                    <label
                                        for="color_{{ $loop->index }}"
                                        class="color-swatch"
                                        style="background-color: {{ $color }}; width:32px; height:32px; border-radius:50%; display:inline-block; cursor:pointer; border: 3px solid transparent; transition: all 0.2s;"
                                    ></label>
                                </div>
                            @endforeach
                        </div>
                        @error('color')
                            <div class="text-danger small mt-1">{{ $message }}</div>
                        @enderror
                    </div>

                    <div class="mb-3">
                        <div class="form-check form-switch">
                            <input
                                class="form-check-input"
                                type="checkbox"
                                name="is_active"
                                id="is_active"
                                value="1"
                                {{ old('is_active', true) ? 'checked' : '' }}
                            >
                            <label class="form-check-label fw-semibold" for="is_active">Active</label>
                        </div>
                    </div>

                    <div class="d-flex gap-2 mt-2">
                        <button type="submit" class="btn btn-primary">
                            <i class="bi bi-check-lg me-1"></i> Create Category
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

@push('scripts')
<script>
function previewUploadedIcon(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            // désélectionner les radio icons
            document.querySelectorAll('.icon-radio').forEach(r => r.checked = false);

            // afficher preview
            const preview = document.getElementById('upload-preview');
            const plusIcon = document.getElementById('upload-plus-icon');
            preview.style.display = 'block';
            preview.innerHTML = `<img src="${e.target.result}" style="width:28px; height:28px; object-fit:contain;">`;
            plusIcon.style.display = 'none';

            // marquer le bouton comme sélectionné
            document.getElementById('upload-btn').style.borderColor = '#4e73df';
            document.getElementById('upload-btn').style.backgroundColor = '#e8ecfd';
        };
        reader.readAsDataURL(input.files[0]);
    }
}
</script>
@endpush
