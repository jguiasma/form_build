@extends('dashboard.layouts.app')

@section('title', 'Form Types')
@section('page-title', 'Form Types')

@section('content')

<div class="card">
    <div class="card-header d-flex justify-content-between align-items-center">
        <span><i class="bi bi-grid-fill me-2"></i>All Form Types</span>
        <div class="d-flex gap-2">
            <a href="{{ route('dashboard.form-types.create') }}" class="btn btn-primary btn-sm">
                <i class="bi bi-plus-lg me-1"></i> New Type
            </a>
        </div>
    </div>
    <div class="card-body">
        <table id="form-types-table" class="table table-hover w-100">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Created At</th>
                    <th>Actions</th>
                </tr>
            </thead>
        </table>
    </div>
</div>

@endsection

@push('scripts')
<script>
const table = $('#form-types-table').DataTable({
    processing: true,
    serverSide: true,
    ajax: '{{ route('dashboard.form-types.datatable') }}',
    columns: [
        { data: 'id' },
        { data: 'name' },
        { data: 'is_active', orderable: false, searchable: false },
        { data: 'created_at', render: data => {
            const d = new Date(data);
            return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
        }},
        { data: 'actions', orderable: false, searchable: false }
    ]
});

$(document).on('change', '.toggle-type-status', function () {
    const id = $(this).data('id');
    const cb = $(this);
    $.ajax({
        url: `/dashboard/form-types/${id}/toggle`,
        method: 'POST',
        data: { _token: '{{ csrf_token() }}' },
        error: () => cb.prop('checked', !cb.is(':checked'))
    });
});
</script>
@endpush
