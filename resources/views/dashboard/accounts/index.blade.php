@extends('dashboard.layouts.app')

@section('title', 'Accounts')
@section('page-title', 'Accounts')

@section('content')

<div class="card">
    <div class="card-header d-flex justify-content-between align-items-center">
        <span><i class="bi bi-people-fill me-2"></i>All Accounts</span>
        <a href="{{ route('dashboard.accounts.create') }}" class="btn btn-primary btn-sm">
            <i class="bi bi-plus-lg me-1"></i> New Account
        </a>
    </div>
    <div class="card-body">
        <table id="accounts-table" class="table table-hover w-100">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
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
    $('#accounts-table').DataTable({
        processing: true,
        serverSide: true,
        ajax: '{{ route('dashboard.accounts.datatable') }}',
        columns: [
            { data: 'id' },
            { data: 'name' },
            { data: 'email' },
            { data: 'phone_number', defaultContent: '-' },
            { data: 'role' },
            { data: 'created_at', render: function(data, type, row) {
                if (type === 'display' || type === 'filter') {
                    const date = new Date(data);
                    const day = String(date.getDate()).padStart(2, '0');
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const year = date.getFullYear();
                    return `${day}/${month}/${year}`;
                }
                return data;
            } },
            { data: 'actions', orderable: false, searchable: false }
        ]
    });
</script>
@endpush
