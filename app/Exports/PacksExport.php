<?php

namespace App\Exports;

use App\Models\Pack;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class PacksExport implements FromCollection, WithHeadings, WithMapping
{
    public function collection()
    {
        return Pack::all();
    }

    public function headings(): array
    {
        return ['#', 'Title', 'Description', 'Amount (TND)', 'Duration (days)', 'Created At'];
    }

    public function map($row): array
    {
        return [
            $row->id,
            $row->title,
            $row->description ?? '-',
            $row->amount,
            $row->duration_days,
            $row->created_at->format('d/m/Y H:i'),
        ];
    }
}
