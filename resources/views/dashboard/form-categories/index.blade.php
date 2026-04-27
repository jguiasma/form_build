@extends('dashboard.layouts.app')

@section('title', 'Form Categories')
@section('page-title', 'Form Categories')

@section('content')

<div class="card">
    <div class="card-header d-flex justify-content-between align-items-center">
        <span><i class="bi bi-tag-fill me-2"></i>All Form Categories</span>
        <a href="{{ route('dashboard.form-categories.create') }}" class="btn btn-primary btn-sm">
            <i class="bi bi-plus-lg me-1"></i> New Category
        </a>
    </div>
    <div class="card-body">
        <table id="categories-table" class="table table-hover w-100">
            <thead>
                <tr>
                    <th>Icon</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
        </table>
    </div>
</div>

@endsection

@push('scripts')
<script>
    $('#categories-table').DataTable({
        processing: true,
        serverSide: true,
        ajax: '{{ route('dashboard.form-categories.datatable') }}',
        columns: [
            { data: 'icon_display', orderable: false, searchable: false },
            { data: 'name' },
            { data: 'description', defaultContent: '-' },
            { data: 'is_active', orderable: false, searchable: false },
            { data: 'actions', orderable: false, searchable: false }
        ]
    });

    // Toggle status
    $(document).on('change', '.toggle-status', function() {
        const id = $(this).data('id');
        const checkbox = $(this);

        $.ajax({
            url: `/dashboard/form-categories/${id}/toggle`,
            method: 'POST',
            data: { _token: '{{ csrf_token() }}' },
            success: function(res) {
                // optionnel: toast de confirmation
            },
            error: function() {
                // revenir à l'état précédent si erreur
                checkbox.prop('checked', !checkbox.prop('checked'));
            }
        });
    });
</script>
@endpush
