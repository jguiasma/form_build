<?php

namespace App\Exports;

use App\Models\FormCategory;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class FormCategoriesExport implements FromCollection, WithHeadings, WithMapping
{
    public function collection()
    {
        return FormCategory::withCount(['forms', 'formFields'])->get();
    }

    public function headings(): array
    {
        return ['#', 'Name', 'Description', 'Forms', 'Fields', 'Status', 'Created At'];
    }

    public function map($row): array
    {
        return [
            $row->id,
            $row->name,
            $row->description ?? '-',
            $row->forms_count,
            $row->form_fields_count,
            $row->is_active ? 'Active' : 'Inactive',
            $row->created_at->format('d/m/Y H:i'),
        ];
    }
}
