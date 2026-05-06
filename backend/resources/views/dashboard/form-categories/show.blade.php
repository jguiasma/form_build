@extends('dashboard.layouts.app')

@section('title', 'Category Details')
@section('page-title', 'Category Details')

@section('content')

<div class="row">
    <div class="col-md-8">
        <div class="card mb-4">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span><i class="bi bi-tag-fill me-2"></i>Category Information</span>
                <div class="d-flex gap-2">
                    <a href="{{ route('dashboard.form-categories.edit', $formCategory->id) }}" class="btn btn-warning btn-sm">
                        <i class="bi bi-pencil me-1"></i> Edit
                    </a>
                    <a href="{{ route('dashboard.form-categories.index') }}" class="btn btn-secondary btn-sm">
                        <i class="bi bi-arrow-left me-1"></i> Back
                    </a>
                </div>
            </div>
            <div class="card-body">
                <table class="table table-borderless">
                    <tr>
                        <th width="200" class="text-muted">Icon</th>
                        <td>
                            <div style="width:40px; height:40px; border-radius:10px; background-color:{{ $formCategory->color ?? '#6366f1' }}; display:flex; align-items:center; justify-content:center; color:white; font-size:20px;">
                                <i class="bi bi-{{ $formCategory->icon ?? 'tag-fill' }}"></i>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th class="text-muted">Name</th>
                        <td>{{ $formCategory->name }}</td>
                    </tr>
                    <tr>
                        <th class="text-muted">Description</th>
                        <td>{{ $formCategory->description ?? '-' }}</td>
                    </tr>
                    <tr>
                        <th class="text-muted">Color</th>
                        <td>
                            <div style="width:24px; height:24px; border-radius:50%; background-color:{{ $formCategory->color ?? '#6366f1' }}; display:inline-block;"></div>
                            <code class="ms-2">{{ $formCategory->color ?? '-' }}</code>
                        </td>
                    </tr>
                    <tr>
                        <th class="text-muted">Status</th>
                        <td>
                            <div class="form-check form-switch">
                                <input
                                    class="form-check-input toggle-category-status"
                                    type="checkbox"
                                    data-id="{{ $formCategory->id }}"
                                    {{ $formCategory->is_active ? 'checked' : '' }}
                                    style="cursor:pointer; width:40px; height:20px;"
                                >
                                <label class="form-check-label ms-2" id="category-status-label">
                                    <span class="badge bg-{{ $formCategory->is_active ? 'success' : 'danger' }}">
                                        {{ $formCategory->is_active ? 'Active' : 'Inactive' }}
                                    </span>
                                </label>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th class="text-muted">Total Forms</th>
                        <td><span class="fw-bold">{{ $formCategory->forms->count() }}</span></td>
                    </tr>
                    <tr>
                        <th class="text-muted">Total Fields</th>
                        <td><span class="fw-bold">{{ $formCategory->formFields->count() }}</span></td>
                    </tr>
                    <tr>
                        <th class="text-muted">Created At</th>
                        <td>{{ $formCategory->created_at->format('d M Y, H:i') }}</td>
                    </tr>
                </table>
            </div>
        </div>
    </div>

    <div class="col-md-4">
        {{-- Forms --}}
        <div class="card mb-4">
            <div class="card-header">
                <i class="bi bi-file-earmark-text-fill me-2"></i>Forms
                <span class="badge bg-primary ms-1">{{ $formCategory->forms->count() }}</span>
            </div>
            <div class="card-body p-0">
                @forelse($formCategory->forms as $form)
                    <div class="d-flex align-items-center justify-content-between p-3 border-bottom">
                        <div>
                            <div class="fw-bold small">{{ $form->title }}</div>
                            <div class="text-muted" style="font-size:12px">
                                <span class="badge bg-{{ $form->status === 'published' ? 'success' : ($form->status === 'draft' ? 'secondary' : 'warning') }}" style="font-size:9px">
                                    {{ ucfirst($form->status) }}
                                </span>
                                {{ $form->created_at->format('d M Y') }}
                            </div>
                        </div>
                    </div>
                @empty
                    <div class="p-3 text-muted text-center small">No forms yet</div>
                @endforelse
            </div>
        </div>

        {{-- Fields --}}
        <div class="card">
            <div class="card-header">
                <i class="bi bi-ui-checks me-2"></i>Fields
                <span class="badge bg-primary ms-1">{{ $formCategory->formFields->count() }}</span>
            </div>
            <div class="card-body p-0">
                @forelse($formCategory->formFields as $field)
                    <div class="d-flex align-items-center justify-content-between p-3 border-bottom" id="field-row-{{ $field->id }}">
                        <div>
                            <div class="fw-bold small">{{ $field->label }}</div>
                            <div class="text-muted" style="font-size:12px">
                                <span class="badge bg-primary" style="font-size:9px">{{ $field->type }}</span>
                                <code style="font-size:10px">{{ $field->field_key }}</code>
                            </div>
                        </div>
                        <div class="d-flex align-items-center gap-2">

                            <a href="{{ route('dashboard.form-fields.show', $field->id) }}" class="btn btn-sm btn-outline-primary">
                                <i class="bi bi-eye"></i>
                            </a>
                        </div>
                    </div>
                @empty
                    <div class="p-3 text-muted text-center small">No fields yet</div>
                @endforelse
            </div>
        </div>
    </div>
</div>

@endsection

@push('scripts')
<script>
    // Toggle status de la catégorie
    $(document).on('change', '.toggle-category-status', function() {
        const id = $(this).data('id');
        const isChecked = $(this).is(':checked');

        $.ajax({
            url: `/dashboard/form-categories/${id}/toggle`,
            method: 'POST',
            data: { _token: '{{ csrf_token() }}' },
            success: function() {
                $('#category-status-label').html(
                    `<span class="badge bg-${isChecked ? 'success' : 'danger'}">${isChecked ? 'Active' : 'Inactive'}</span>`
                );
            },
            error: function() {
                $('.toggle-category-status').prop('checked', !isChecked);
            }
        });
    });

</script>
@endpush
