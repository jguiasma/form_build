@extends('dashboard.layouts.app')

@section('title', 'Form Fields')
@section('page-title', 'Form Fields')

@section('content')

<div class="card">
    <div class="card-header d-flex justify-content-between align-items-center">
        <span><i class="bi bi-ui-checks me-2"></i>Palette Components</span>
        <a href="{{ route('dashboard.form-fields.create') }}" class="btn btn-primary btn-sm">
            <i class="bi bi-plus-lg me-1"></i> New Field
        </a>
    </div>
    <div class="card-body">
        <table id="fields-table" class="table table-hover w-100">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Label</th>
                    <th>Field Key</th>
                    <th>Type</th>
                    <th>Categories</th>
                    <th>Packs</th>
                    <th>Active</th>
                    <th>Actions</th>
                </tr>
            </thead>
        </table>
    </div>
</div>

@endsection

@push('scripts')
<script>
    $('#fields-table').DataTable({
        processing: true,
        serverSide: true,
        ajax: '{{ route('dashboard.form-fields.datatable') }}',
        columns: [
            { data: 'id' },
            { data: 'label' },
            { data: 'field_key' },
            { data: 'type' },
            { data: 'categories', orderable: false, searchable: false },
            { data: 'packs', orderable: false, searchable: false },
            { data: 'is_palette_component', orderable: false, searchable: false },
            { data: 'actions', orderable: false, searchable: false }
        ]
    });

    // Toggle is_palette_component
    $(document).on('change', '.toggle-field-status', function() {
        const id = $(this).data('id');
        const checkbox = $(this);

        $.ajax({
            url: `/dashboard/form-fields/${id}/toggle`,
            method: 'POST',
            data: { _token: '{{ csrf_token() }}' },
            error: function() {
                checkbox.prop('checked', !checkbox.prop('checked'));
            }
        });
    });
</script>
@endpush
