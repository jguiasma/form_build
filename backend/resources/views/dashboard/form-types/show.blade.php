@extends('dashboard.layouts.app')

@section('title', 'Form Type Details')
@section('page-title', 'Form Type Details')

@section('content')

<div class="row">
    <div class="col-md-7">
        <div class="card mb-4">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span><i class="bi bi-grid-fill me-2"></i>Type Information</span>
                <div class="d-flex gap-2">
                    <a href="{{ route('dashboard.form-types.edit', $formType->id) }}"
                        class="btn btn-warning btn-sm">
                        <i class="bi bi-pencil me-1"></i> Edit
                    </a>
                    <a href="{{ route('dashboard.form-types.index') }}"
                        class="btn btn-secondary btn-sm">
                        <i class="bi bi-arrow-left me-1"></i> Back
                    </a>
                </div>
            </div>
            <div class="card-body">
                <table class="table table-borderless">
                    <tr>
                        <th width="200" class="text-muted">Name</th>
                        <td>{{ $formType->name }}</td>
                    </tr>
                    <tr>
                        <th class="text-muted">Description</th>
                        <td>{{ $formType->description ?? '-' }}</td>
                    </tr>
                    <tr>
                        <th class="text-muted">Status</th>
                        <td>
                            <div class="form-check form-switch">
                                <input class="form-check-input toggle-type-status"
                                    type="checkbox"
                                    data-id="{{ $formType->id }}"
                                    {{ $formType->is_active ? 'checked' : '' }}
                                    style="cursor:pointer; width:40px; height:20px;">
                                <label class="form-check-label ms-2" id="type-status-label">
                                    <span class="badge bg-{{ $formType->is_active ? 'success' : 'danger' }}">
                                        {{ $formType->is_active ? 'Active' : 'Inactive' }}
                                    </span>
                                </label>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th class="text-muted">Created At</th>
                        <td>{{ $formType->created_at->format('d M Y, H:i') }}</td>
                    </tr>
                </table>
            </div>
        </div>
    </div>

    <div class="col-md-5">
        <div class="card">
            <div class="card-header">
                <i class="bi bi-file-earmark-text-fill me-2"></i>Forms
                <span class="badge bg-primary ms-1">{{ $formType->forms->count() }}</span>
            </div>
            <div class="card-body p-0">
                @forelse($formType->forms as $form)
                    <div class="d-flex align-items-center justify-content-between p-3 border-bottom">
                        <div>
                            <div class="fw-bold small">{{ $form->title }}</div>
                            <div class="text-muted" style="font-size:12px">
                                <span class="badge bg-{{ $form->status === 'published' ? 'success' : 'secondary' }}"
                                    style="font-size:9px">
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
    </div>

</div>

@endsection

@push('scripts')
<script>
    $(document).on('change', '.toggle-type-status', function () {
        const id = $(this).data('id');
        const isChecked = $(this).is(':checked');

        $.ajax({
            url: `/dashboard/form-types/${id}/toggle`,
            method: 'POST',
            data: { _token: '{{ csrf_token() }}' },
            success: () => {
                $('#type-status-label').html(
                    `<span class="badge bg-${isChecked ? 'success' : 'danger'}">
                        ${isChecked ? 'Active' : 'Inactive'}
                    </span>`
                );
            },
            error: () => $('.toggle-type-status').prop('checked', !isChecked)
        });
    });
</script>
@endpush
