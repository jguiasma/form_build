<?php

namespace App\Exports;

use App\Models\Subscription;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class SubscriptionsExport implements FromCollection, WithHeadings, WithMapping
{
    public function collection()
    {
        return Subscription::with(['account', 'pack'])->get();
    }

    public function headings(): array
    {
        return ['#', 'Account', 'Email', 'Pack', 'Amount (TND)', 'Validation Date', 'Created At'];
    }

    public function map($row): array
    {
        return [
            $row->id,
            $row->account->name ?? '-',
            $row->account->email ?? '-',
            $row->pack->title ?? '-',
            $row->pack->amount ?? '-',
            $row->validation_date->format('d/m/Y'),
            $row->created_at->format('d/m/Y H:i'),
        ];
    }
}
