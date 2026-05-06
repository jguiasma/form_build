@extends('dashboard.layouts.app')

@section('title', 'Edit Field')
@section('page-title', 'Edit Field')

@section('content')

<div class="row">
    <div class="col-md-8">
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span><i class="bi bi-pencil me-2"></i>Edit Field — {{ $formField->label }}</span>
                <div class="d-flex gap-2">
                    <a href="{{ route('dashboard.form-fields.show', $formField->id) }}" class="btn btn-info btn-sm">
                        <i class="bi bi-eye me-1"></i> View
                    </a>
                    <a href="{{ route('dashboard.form-fields.index') }}" class="btn btn-secondary btn-sm">
                        <i class="bi bi-arrow-left me-1"></i> Back
                    </a>
                </div>
            </div>
            <div class="card-body">
                <form action="{{ route('dashboard.form-fields.update', $formField->id) }}" method="POST">
                    @csrf
                    @method('PUT')

                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label fw-semibold">Label <span class="text-danger">*</span></label>
                            <input type="text" name="label"
                                value="{{ old('label', $formField->label) }}"
                                class="form-control @error('label') is-invalid @enderror">
                            @error('label')<div class="invalid-feedback">{{ $message }}</div>@enderror
                        </div>

                        <div class="col-md-6 mb-3">
                            <label class="form-label fw-semibold">Field Key <span class="text-danger">*</span></label>
                            <input type="text" name="field_key"
                                value="{{ old('field_key', $formField->field_key) }}"
                                class="form-control @error('field_key') is-invalid @enderror">
                            @error('field_key')<div class="invalid-feedback">{{ $message }}</div>@enderror
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label fw-semibold">Type <span class="text-danger">*</span></label>
                            <select name="type" id="fieldType" class="form-select @error('type') is-invalid @enderror">
                                <option value="">Select type...</option>
                                @foreach(['text','textarea','number','email','password','select','radio','checkbox','date','file','submit','signature','phone','divider','rating','url','location','voice','payment','spacer','grouped'] as $type)
                                    <option value="{{ $type }}" {{ old('type', $formField->type) == $type ? 'selected' : '' }}>
                                        {{ ucfirst($type) }}
                                    </option>
                                @endforeach
                            </select>
                            @error('type')<div class="invalid-feedback">{{ $message }}</div>@enderror
                        </div>

                        <div class="col-md-6 mb-3" id="placeholderWrapper">
                            <label class="form-label fw-semibold">Placeholder</label>
                            <input type="text" name="placeholder"
                                value="{{ old('placeholder', $formField->placeholder) }}"
                                class="form-control @error('placeholder') is-invalid @enderror">
                            @error('placeholder')<div class="invalid-feedback">{{ $message }}</div>@enderror
                        </div>
                    </div>

                    <div class="mb-3" id="descriptionWrapper">
                        <label class="form-label fw-semibold">Description</label>
                        <textarea name="description"
                            class="form-control @error('description') is-invalid @enderror"
                            rows="2">{{ old('description', $formField->description) }}</textarea>
                        @error('description')<div class="invalid-feedback">{{ $message }}</div>@enderror
                    </div>

                   @php
                        $groupedConfig     = $formField->validation_rules['grouped_config']     ?? null;
                        $sliderConfig      = $formField->validation_rules['slider_config']      ?? null;
                        $matrixConfig      = $formField->validation_rules['matrix_config']      ?? null;
                        $conditionalConfig = $formField->validation_rules['conditional_config'] ?? null;
                    @endphp

                    <div id="groupedSection" style="display: {{ $formField->type === 'grouped' ? 'block' : 'none' }};">
                        <hr>
                        <h6 class="fw-bold mb-3 mt-1">
                            <i class="bi bi-grid me-1"></i>Grouped Field Configuration
                        </h6>

                        <div class="mb-3">
                            <label class="form-label">Number of rows <small class="text-muted">(max 4)</small></label>
                            <select id="numRows" name="grouped_config[num_rows]" class="form-select">
                                <option value="">Select...</option>
                                @foreach([1,2,3,4] as $n)
                                    <option value="{{ $n }}" {{ ($groupedConfig['num_rows'] ?? null) == $n ? 'selected' : '' }}>
                                        {{ $n }} row{{ $n > 1 ? 's' : '' }}
                                    </option>
                                @endforeach
                            </select>
                        </div>

                        <div id="rowsContainer"></div>
                    </div>

                    <div id="sliderSection"
                        style="display: {{ $formField->type === 'slider' ? 'block' : 'none' }};">
                        <select name="slider_config[mode]" class="form-select">
                            @foreach(['single' => 'Single value', 'range' => 'Range'] as $val => $label)
                                <option value="{{ $val }}"
                                    {{ ($sliderConfig['mode'] ?? 'single') === $val ? 'selected' : '' }}>
                                    {{ $label }}
                                </option>
                            @endforeach
                        </select>
                        <input type="number" name="slider_config[min]"
                            class="form-control"
                            value="{{ $sliderConfig['min'] ?? 0 }}">
                        <input type="number" name="slider_config[max]"
                            class="form-control"
                            value="{{ $sliderConfig['max'] ?? 100 }}">
                        <input type="number" name="slider_config[step]"
                            class="form-control"
                            value="{{ $sliderConfig['step'] ?? 1 }}">
                        <input type="text" name="slider_config[unit]"
                            class="form-control"
                            value="{{ $sliderConfig['unit'] ?? '' }}">
                        <input type="checkbox" name="slider_config[show_value]"
                            value="1"
                            {{ ($sliderConfig['show_value'] ?? true) ? 'checked' : '' }}>
                    </div>


                    <div id="conditionalSection"
                        style="display: {{ $formField->type === 'conditional' ? 'block' : 'none' }};">
                        <label class="form-label fw-semibold">Conditional Logic</label>
                        <small class="text-muted d-block mb-2">Show this field only if certain conditions are met.</small>
                        <div id="conditionsContainer">
                            @php
                                $conditions = $conditionalConfig['conditions'] ?? [];
                            @endphp
                            @foreach($conditions as $index => $cond)
                                <div class="border rounded p-3 mb-2">
                                    <div class="d-flex gap-2 align-items-center mb-2">
                                        <label class="form-label small mb-0">Condition {{ $index + 1 }}</label>
                                        <button type="button" class="btn btn-sm btn-danger remove-condition"></button>
                                            <i class="bi bi-x"></i>
                                        </button>
                                    </div>
                                    <div class="row g-2">
                                        <div class="col-md-4">
                                            <label class="form-label small">Field</label>
                                            <select name="conditional_config[conditions][{{ $index }}][field_id]" class="form-select form-select-sm">
                                                @foreach($allFields as $f)
                                                    <option value="{{ $f->id }}" {{ $cond['field_id'] == $f->id ? 'selected' : '' }}>
                                                        {{ $f->label }}
                                                    </option>
                                                @endforeach
                                            </select>
                                        </div>
                                        <div class="col-md-4">
                                            <label class="form-label small">Operator</label>
                                            <select name="conditional_config[conditions][{{ $index }}][operator]" class="form-select form-select-sm">
                                                @foreach(['equals' => 'Equals', 'not_equals' => 'Not Equals', 'contains' => 'Contains', 'not_contains' => 'Not Contains'] as $opVal => $opLabel)
                                                    <option value="{{ $opVal }}" {{ $cond['operator'] == $opVal ? 'selected' : '' }}>
                                                        {{ $opLabel }}
                                                    </option>
                                                @endforeach
                                            </select>
                                        </div>
                                        <div class="col-md-4">
                                            <label class="form-label small">Value</label>
                                            <input type="text" name="conditional_config[conditions][{{ $index }}][value]" class="form-control form-control-sm" value="{{ $cond['value'] }}">
                                        </div>
                                    </div>
                                </div>
                            @endforeach
                        </div>
                        <button type="button" id="addCondition" class="btn btn-sm btn-primary">
                            <i class="bi bi-plus me-1"></i> Add Condition
                        </button>
                    </div>

                    <div id="matrixSection"
                        style="display: {{ $formField->type === 'matrix' ? 'block' : 'none' }};">
                        <label class="form-label fw-semibold">Matrix Configuration</label>
                        <small class="text-muted d-block mb-2">Define rows and columns for the matrix field.</small>
                        <div id="matrixConfigContainer">
                            @php
                                $matrixRows = $matrixConfig['rows'] ?? [];
                            @endphp
                            @foreach($matrixRows as $rowKey => $row)
                                <div class="border rounded p-3 mb-2">
                                    <h6 class="fw-bold small">Row {{ $rowKey }}</h6>
                                    <div class="mb-2">
                                        <label class="form-label small">Number of columns <small class="text-muted">(max 5)</small></label>
                                        <select name="matrix_config[rows][{{ $rowKey }}][num_cols]"
                                            class="form-select form-select-sm matrix-num-cols" data-row="{{ $rowKey }}">
                                            <option value="">Select...</option>
                                            @foreach([1,2,3,4,5] as $n)
                                                <option value="{{ $n }}" {{ ($row['num_cols'] ?? null) == $n ? 'selected' : '' }}>
                                                    {{ $n }} column{{ $n > 1 ? 's' : '' }}
                                                </option>
                                            @endforeach
                                        </select>
                                    </div>
                                    <div id="matrixColsContainer_{{ $rowKey }}">
                                        @php
                                            $cols = $row['cols'] ?? [];
                                        @endphp
                                        @foreach($cols as $colKey => $col)
                                            <div class="border rounded p-2 mb-2 bg-light">
                                                <h6 class="text-muted small fw-bold">Column {{ $colKey }} (Row {{ $rowKey }})</h6>
                                                <input type="text" name="matrix_config[rows][{{ $rowKey }}][cols][{{ $colKey }}][label]"
                                                    class="form-control form-control-sm mb-1"
                                                    placeholder="Label..." value="{{ $col['label'] ?? '' }}">
                                                <input type="text" name="matrix_config[rows][{{ $rowKey }}][cols][{{ $colKey }}][placeholder]"
                                                    class="form-control form-control-sm"
                                                    placeholder="Placeholder..." value="{{ $col['placeholder'] ?? '' }}">
                                            </div>
                                        @endforeach
                                    </div>
                                </div>
                            @endforeach
                        </div>
                    </div>
                    {{-- Form Categories --}}
                    <div class="mb-3">
                        <label class="form-label fw-semibold">Form Categories</label>
                        <div class="row row-cols-2 row-cols-md-3 g-2">
                            @foreach($categories as $category)
                                <div class="col">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox"
                                            name="category_ids[]" value="{{ $category->id }}"
                                            id="cat_{{ $category->id }}"
                                            {{ in_array($category->id, old('category_ids', $formField->categories->pluck('id')->toArray())) ? 'checked' : '' }}>
                                        <label class="form-check-label" for="cat_{{ $category->id }}">
                                            {{ $category->name }}
                                        </label>
                                    </div>
                                </div>
                            @endforeach
                        </div>
                    </div>

                    {{-- Packs --}}
                    <div class="mb-3">
                        <label class="form-label fw-semibold">Packs</label>
                        <div class="row row-cols-2 row-cols-md-3 g-2">
                            @foreach($packs as $pack)
                                <div class="col">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox"
                                            name="pack_ids[]" value="{{ $pack->id }}"
                                            id="pack_{{ $pack->id }}"
                                            {{ in_array($pack->id, old('pack_ids', $formField->packs->pluck('id')->toArray())) ? 'checked' : '' }}>
                                        <label class="form-check-label" for="pack_{{ $pack->id }}">
                                            {{ $pack->title }}
                                            <small class="text-muted">{{ $pack->amount }} TND</small>
                                        </label>
                                    </div>
                                </div>
                            @endforeach
                        </div>
                    </div>

                    <div class="mb-3">
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" name="is_required"
                                id="is_required" value="1"
                                {{ old('is_required', $formField->is_required) ? 'checked' : '' }}>
                            <label class="form-check-label fw-semibold" for="is_required">Required</label>
                        </div>
                    </div>

                    <div class="d-flex gap-2 mt-2">
                        <button type="submit" class="btn btn-primary">
                            <i class="bi bi-check-lg me-1"></i> Update Field
                        </button>
                        <a href="{{ route('dashboard.form-fields.index') }}" class="btn btn-outline-secondary">Cancel</a>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

@endsection

@push('scripts')
<script>
    const fieldTypes = ['text', 'number', 'email', 'textarea', 'select', 'date', 'phone', 'url'];
    const noPlaceholderTypes = ['grouped', 'divider', 'spacer', 'submit', 'signature', 'payment', 'voice', 'location', 'rating', 'file', 'checkbox', 'radio'];

    // Grouped config existant depuis le backend
    const existingGrouped     = @json($groupedConfig     ?? []);
    const existingSlider      = @json($sliderConfig      ?? []);
    const existingMatrix      = @json($matrixConfig      ?? []);
    const existingConditional = @json($conditionalConfig ?? []);

    document.getElementById('fieldType').addEventListener('change', function () {
        const type = this.value;
        document.getElementById('groupedSection').style.display  = type === 'grouped' ? 'block' : 'none';
        document.getElementById('sliderSection').style.display = type === 'slider' ? 'block' : 'none';
        document.getElementById('matrixSection').style.display = type === 'matrix' ? 'block' : 'none';
        document.getElementById('conditionalSection').style.display = type === 'conditional' ? 'block' : 'none';
        document.getElementById('placeholderWrapper').style.display = noPlaceholderTypes.includes(type) ? 'none' : 'block';
    });

    document.getElementById('numRows').addEventListener('change', function () {
        buildRows(parseInt(this.value), existingConfig.rows ?? {});
    });

    // Au chargement si c'est déjà grouped → rebuild depuis existingConfig
    document.addEventListener('DOMContentLoaded', function () {
        const currentType = document.getElementById('fieldType').value;

        if (type === 'grouped' && existingGrouped.num_rows) {
            buildRows(parseInt(existingGrouped.num_rows), existingGrouped.rows ?? {});
        }

        if (type === 'matrix' && existingMatrix.rows) {
            const container = document.getElementById('matrixRowsContainer');
            container.innerHTML = '';
            existingMatrix.rows.forEach(row => {
                const div = document.createElement('div');
                div.className = 'input-group mb-2 matrix-row-item';
                div.innerHTML = `
                    <input type="text" name="matrix_config[rows][]"
                        class="form-control" value="${row}">
                    <button type="button"
                        class="btn btn-outline-danger btn-remove-matrix-row">
                        <i class="bi bi-trash"></i>
                    </button>`;
                container.appendChild(div);
            });
            // Show text labels if needed
            if (existingMatrix.scale_type === 'text') {
                document.getElementById('matrixTextLabels').style.display = 'block';
            }
        }

        if (noPlaceholderTypes.includes(currentType)) {
            document.getElementById('placeholderWrapper').style.display = 'none';
        }
    });

    function buildRows(numRows, oldRows) {
        const container = document.getElementById('rowsContainer');
        container.innerHTML = '';

        for (let r = 1; r <= numRows; r++) {
            const rowData = oldRows[r] ?? {};
            const rowDiv = document.createElement('div');
            rowDiv.className = 'border rounded p-3 mb-3 bg-light';
            rowDiv.innerHTML = `
                <h6 class="fw-bold">Row ${r}</h6>
                <div class="mb-2">
                    <label class="form-label">Number of fields <small class="text-muted">(max 3)</small></label>
                    <select class="form-select numCols" data-row="${r}" name="grouped_config[rows][${r}][num_cols]">
                        <option value="">Select...</option>
                        ${[1,2,3].map(n =>
                            `<option value="${n}" ${rowData.num_cols == n ? 'selected' : ''}>${n} field${n>1?'s':''}</option>`
                        ).join('')}
                    </select>
                </div>
                <div id="colsContainer_${r}"></div>
            `;
            container.appendChild(rowDiv);

            if (rowData.num_cols) {
                buildCols(r, parseInt(rowData.num_cols), rowData.cols ?? {});
            }
        }

        document.querySelectorAll('.numCols').forEach(sel => {
            sel.addEventListener('change', function () {
                buildCols(this.dataset.row, parseInt(this.value), {});
            });
        });
    }

    function buildCols(row, numCols, oldCols) {
        const colContainer = document.getElementById(`colsContainer_${row}`);
        colContainer.innerHTML = '';

        for (let c = 1; c <= numCols; c++) {
            const col = oldCols[c] ?? {};
            colContainer.innerHTML += `
                <div class="border rounded p-2 mb-2 bg-white">
                    <h6 class="text-muted small fw-bold">Field ${c} (Row ${row})</h6>
                    <div class="row g-2">
                        <div class="col-md-4">
                            <label class="form-label small">Type</label>
                            <select name="grouped_config[rows][${row}][cols][${c}][type]" class="form-select form-select-sm">
                                ${fieldTypes.map(t =>
                                    `<option value="${t}" ${col.type === t ? 'selected' : ''}>${t.charAt(0).toUpperCase()+t.slice(1)}</option>`
                                ).join('')}
                            </select>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label small">Label</label>
                            <input type="text" name="grouped_config[rows][${row}][cols][${c}][label]"
                                class="form-control form-control-sm"
                                placeholder="Label..." value="${col.label ?? ''}">
                        </div>
                        <div class="col-md-4">
                            <label class="form-label small">Placeholder</label>
                            <input type="text" name="grouped_config[rows][${row}][cols][${c}][placeholder]"
                                class="form-control form-control-sm"
                                placeholder="Placeholder..." value="${col.placeholder ?? ''}">
                        </div>
                    </div>
                </div>
            `;
        }
    }
</script>
@endpush
