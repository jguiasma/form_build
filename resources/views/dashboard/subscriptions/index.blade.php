@extends('dashboard.layouts.app')

@section('title', 'Subscriptions')
@section('page-title', 'Subscriptions')

@section('content')

<div class="card">
    <div class="card-header d-flex justify-content-between align-items-center">
        <span><i class="bi bi-credit-card-fill me-2"></i>All Subscriptions</span>
        <a href="{{ route('dashboard.subscriptions.create') }}" class="btn btn-primary btn-sm">
            <i class="bi bi-plus-lg me-1"></i> New Subscription
        </a>
    </div>
    <div class="card-body">
        <table id="subscriptions-table" class="table table-hover w-100">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Account</th>
                    <th>Pack</th>
                    <th>Validation Date</th>
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
    $('#subscriptions-table').DataTable({
        processing: true,
        serverSide: true,
        ajax: '{{ route('dashboard.subscriptions.datatable') }}',
        columns: [
            { data: 'id' },
            { data: 'account' },
            { data: 'pack' },
            { data: 'validation_date', render: function(data, type, row) {
                if (type === 'display' || type === 'filter') {
                    const date = new Date(data);
                    const day = String(date.getDate()).padStart(2, '0');
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const year = date.getFullYear();
                    return `${day}/${month}/${year}`;
                }
                return data;
            } },
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
