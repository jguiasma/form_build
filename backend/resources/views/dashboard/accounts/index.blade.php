@extends('dashboard.layouts.app')

@section('title', 'Accounts')
@section('page-title', 'Accounts')

@section('content')

<div class="card">
    <div class="card-header d-flex justify-content-between align-items-center">
        <span><i class="bi bi-people-fill me-2"></i>All Accounts</span>
        <div class="d-flex gap-2">
            <div class="dropdown">
                <button class="btn btn-success btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown">
                    <i class="bi bi-download me-1"></i> Export
                </button>
                <ul class="dropdown-menu">
                    <li>
                        <a class="dropdown-item" href="{{ route('dashboard.accounts.export', 'xlsx') }}">
                            <i class="bi bi-file-earmark-excel me-2 text-success"></i> Excel (.xlsx)
                        </a>
                    </li>
                    <li>
                        <a class="dropdown-item" href="{{ route('dashboard.accounts.export', 'csv') }}">
                            <i class="bi bi-filetype-csv me-2 text-primary"></i> CSV
                        </a>
                    </li>
                </ul>
            </div>
            <a href="{{ route('dashboard.accounts.create') }}" class="btn btn-primary btn-sm">
                <i class="bi bi-plus-lg me-1"></i> New Account
            </a>
        </div>
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
