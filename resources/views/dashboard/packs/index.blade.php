@extends('dashboard.layouts.app')

@section('title', 'Packs')
@section('page-title', 'Packs')

@section('content')

<div class="card">
    <div class="card-header d-flex justify-content-between align-items-center">
        <span><i class="bi bi-box-seam-fill me-2"></i>All Packs</span>
        <a href="{{ route('dashboard.packs.create') }}" class="btn btn-primary btn-sm">
            <i class="bi bi-plus-lg me-1"></i> New Pack
        </a>
    </div>
    <div class="card-body">
        <table id="packs-table" class="table table-hover w-100">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Amount</th>
                    <th>Duration</th>
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
    $('#packs-table').DataTable({
        processing: true,
        serverSide: true,
        ajax: '{{ route('dashboard.packs.datatable') }}',
        columns: [
            { data: 'id' },
            { data: 'title' },
            { data: 'amount', render: function(data, type, row) {
                return type === 'display' ? `${parseFloat(data)} TND` : data;
            } },

            { data: 'duration_days', render : function(data, type, row) {
                return type === 'display' ? `${data} days` : data;
            } },
            //je veux le date sous forme jj/mm/aaaa
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
