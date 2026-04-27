@extends('dashboard.layouts.app')

@section('title', 'Field Details')
@section('page-title', 'Field Details')

@section('content')

<div class="row">
    <div class="col-md-8">
        <div class="card mb-4">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span><i class="bi bi-ui-checks me-2"></i>Field Information</span>
                <div class="d-flex gap-2">
                    <a href="{{ route('dashboard.form-fields.edit', $formField->id) }}" class="btn btn-warning btn-sm">
                        <i class="bi bi-pencil me-1"></i> Edit
                    </a>
                    <a href="{{ route('dashboard.form-fields.index') }}" class="btn btn-secondary btn-sm">
                        <i class="bi bi-arrow-left me-1"></i> Back
                    </a>
                </div>
            </div>
            <div class="card-body">
                <table class="table table-borderless">
                    <tr>
                        <th width="200" class="text-muted">ID</th>
                        <td>{{ $formField->id }}</td>
                    </tr>
                    <tr>
                        <th class="text-muted">Label</th>
                        <td>{{ $formField->label }}</td>
                    </tr>
                    <tr>
                        <th class="text-muted">Field Key</th>
                        <td><code>{{ $formField->field_key }}</code></td>
                    </tr>
                    <tr>
                        <th class="text-muted">Type</th>
                        <td><span class="badge bg-primary">{{ $formField->type }}</span></td>
                    </tr>
                    <tr>
                        <th class="text-muted">Placeholder</th>
                        <td>{{ $formField->placeholder ?? '-' }}</td>
                    </tr>
                    <tr>
                        <th class="text-muted">Description</th>
                        <td>{{ $formField->description ?? '-' }}</td>
                    </tr>
                    <tr>
                        <th class="text-muted">Required</th>
                        <td>
                            @if($formField->is_required)
                                <span class="badge bg-danger">Required</span>
                            @else
                                <span class="badge bg-secondary">Optional</span>
                            @endif
                        </td>
                    </tr>
                    <tr>
                        <th class="text-muted">Status</th>
                        <td>
                            <div class="form-check form-switch">
                                <input
                                    class="form-check-input toggle-field-status"
                                    type="checkbox"
                                    data-id="{{ $formField->id }}"
                                    {{ $formField->is_palette_component ? 'checked' : '' }}
                                    style="cursor:pointer; width:40px; height:20px;"
                                >
                                <label class="form-check-label ms-2" id="status-label">
                                    @if($formField->is_palette_component)
                                        <span class="badge bg-success">Active</span>
                                    @else
                                        <span class="badge bg-danger">Inactive</span>
                                    @endif
                                </label>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th class="text-muted">Created At</th>
                        <td>{{ $formField->created_at->format('d M Y, H:i') }}</td>
                    </tr>
                </table>
            </div>
        </div>
    </div>

    <div class="col-md-4">
        {{-- Categories --}}
        <div class="card mb-4">
            <div class="card-header">
                <i class="bi bi-tag-fill me-2"></i>Categories
                <span class="badge bg-primary ms-1">{{ $formField->categories->count() }}</span>
            </div>
            <div class="card-body p-0">
                @forelse($formField->categories as $category)
                    <div class="d-flex align-items-center justify-content-between p-3 border-bottom">
                        <div class="d-flex align-items-center gap-2">
                            <div style="width:32px; height:32px; border-radius:8px; background-color:{{ $category->color ?? '#6366f1' }}; display:flex; align-items:center; justify-content:center; color:white; font-size:14px;">
                                <i class="bi bi-{{ $category->icon ?? 'tag-fill' }}"></i>
                            </div>
                            <div>
                                <div class="fw-bold small">{{ $category->name }}</div>
                                <div class="text-muted" style="font-size:11px">
                                    <span class="badge bg-{{ $category->is_active ? 'success' : 'danger' }}" style="font-size:9px">
                                        {{ $category->is_active ? 'Active' : 'Inactive' }}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="d-flex align-items-center gap-2">
                            {{-- Toggle détacher/attacher de cette catégorie --}}
                            <div class="form-check form-switch mb-0">
                                <input
                                    class="form-check-input toggle-category-field"
                                    type="checkbox"
                                    data-field-id="{{ $formField->id }}"
                                    data-category-id="{{ $category->id }}"
                                    checked
                                    style="cursor:pointer; width:36px; height:18px;"
                                    title="Detach from this category"
                                >
                            </div>
                            <a href="{{ route('dashboard.form-categories.show', $category->id) }}" class="btn btn-sm btn-outline-primary">
                                <i class="bi bi-eye"></i>
                            </a>
                        </div>
                    </div>
                @empty
                    <div class="p-3 text-muted text-center small">No categories assigned</div>
                @endforelse
            </div>
        </div>

        {{-- Packs --}}
        <div class="card">
            <div class="card-header">
                <i class="bi bi-box-seam-fill me-2"></i>Packs
                <span class="badge bg-primary ms-1">{{ $formField->packs->count() }}</span>
            </div>
            <div class="card-body p-0">
                @forelse($formField->packs as $pack)
                    <div class="d-flex align-items-center justify-content-between p-3 border-bottom">
                        <div>
                            <div class="fw-bold small">{{ $pack->title }}</div>
                            <div class="text-muted" style="font-size:12px">
                                {{ $pack->amount }} TND — {{ $pack->duration_days }} days
                            </div>
                        </div>
                        <div class="d-flex align-items-center gap-2">
                            {{-- Toggle détacher/attacher de ce pack --}}
                            <div class="form-check form-switch mb-0">
                                <input
                                    class="form-check-input toggle-pack-field"
                                    type="checkbox"
                                    data-field-id="{{ $formField->id }}"
                                    data-pack-id="{{ $pack->id }}"
                                    checked
                                    style="cursor:pointer; width:36px; height:18px;"
                                    title="Detach from this pack"
                                >
                            </div>
                            <a href="{{ route('dashboard.packs.show', $pack->id) }}" class="btn btn-sm btn-outline-primary">
                                <i class="bi bi-eye"></i>
                            </a>
                        </div>
                    </div>
                @empty
                    <div class="p-3 text-muted text-center small">No packs assigned</div>
                @endforelse
            </div>
        </div>
    </div>
</div>

@endsection

@push('scripts')
<script>
    // Toggle status du field
    $(document).on('change', '.toggle-field-status', function() {
        const id = $(this).data('id');
        const isChecked = $(this).is(':checked');

        $.ajax({
            url: `/dashboard/form-fields/${id}/toggle`,
            method: 'POST',
            data: { _token: '{{ csrf_token() }}' },
            success: function() {
                $('#status-label').html(isChecked
                    ? '<span class="badge bg-success">Active</span>'
                    : '<span class="badge bg-danger">Inactive</span>'
                );
            },
            error: function() {
                $(this).prop('checked', !isChecked);
            }
        });
    });

    // Toggle détacher field d'une catégorie
    $(document).on('change', '.toggle-category-field', function() {
        const fieldId = $(this).data('field-id');
        const categoryId = $(this).data('category-id');
        const checkbox = $(this);
        const isChecked = checkbox.is(':checked');

        $.ajax({
            url: `/dashboard/form-fields/${fieldId}/toggle-category/${categoryId}`,
            method: 'POST',
            data: { _token: '{{ csrf_token() }}' },
            success: function() {
                if (!isChecked) {
                    checkbox.closest('.d-flex.align-items-center.justify-content-between').fadeOut(300);
                }
            },
            error: function() {
                checkbox.prop('checked', !isChecked);
            }
        });
    });

    // Toggle détacher field d'un pack
    $(document).on('change', '.toggle-pack-field', function() {
        const fieldId = $(this).data('field-id');
        const packId = $(this).data('pack-id');
        const checkbox = $(this);
        const isChecked = checkbox.is(':checked');

        $.ajax({
            url: `/dashboard/form-fields/${fieldId}/toggle-pack/${packId}`,
            method: 'POST',
            data: { _token: '{{ csrf_token() }}' },
            success: function() {
                if (!isChecked) {
                    checkbox.closest('.d-flex.align-items-center.justify-content-between').fadeOut(300);
                }
            },
            error: function() {
                checkbox.prop('checked', !isChecked);
            }
        });
    });
</script>
@endpush
