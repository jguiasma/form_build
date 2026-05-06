<?php

namespace App\Exports;

use App\Models\FormField;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class FormFieldsExport implements FromCollection, WithHeadings, WithMapping
{
    public function collection()
    {
        return FormField::with(['categories', 'packs'])->get();
    }

    public function headings(): array
    {
        return ['#', 'Label', 'Field Key', 'Type', 'Categories', 'Packs', 'Required', 'Active', 'Created At'];
    }

    public function map($row): array
    {
        return [
            $row->id,
            $row->label,
            $row->field_key,
            $row->type,
            $row->categories->pluck('name')->join(', ') ?: '-',
            $row->packs->pluck('title')->join(', ') ?: '-',
            $row->is_required ? 'Yes' : 'No',
            $row->is_palette_component ? 'Active' : 'Inactive',
            $row->created_at->format('d/m/Y H:i'),
        ];
    }
}
