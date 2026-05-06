<?php

namespace App\Exports;

use App\Models\Account;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class AccountsExport implements FromCollection, WithHeadings, WithMapping
{
    public function collection()
    {
        return Account::with('role')->get();
    }

    public function headings(): array
    {
        return ['#', 'Name', 'Email', 'Role', 'Phone', 'Specialty', 'Created At'];
    }

    public function map($row): array
    {
        return [
            $row->id,
            $row->name,
            $row->email,
            $row->role->type ?? '-',
            $row->phone_number ?? '-',
            $row->specialty ?? '-',
            $row->created_at->format('d/m/Y H:i'),
        ];
    }
}
