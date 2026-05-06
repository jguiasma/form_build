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
                            <select name="type" id="fieldType"
                                class="form-select @error('type') is-invalid @enderror">
                                <option value="">Select type...</option>
                                @foreach([
                                    'text','textarea','number','email','password','select','radio',
                                    'checkbox','date','file','submit','signature','phone','divider',
                                    'rating','url','location','voice','payment','spacer',
                                    'grouped','slider','matrix','conditional'
                                ] as $type)
                                    <option value="{{ $type }}"
                                        {{ old('type', $formField->type) == $type ? 'selected' : '' }}>
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

                    <div class="mb-3">
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

                    {{-- ===== GROUPED ===== --}}
                    <div id="groupedSection"
                        style="display: {{ $formField->type === 'grouped' ? 'block' : 'none' }};">
                        <hr>
                        <h6 class="fw-bold mb-3 mt-1">
                            <i class="bi bi-grid me-1"></i>Grouped Field Configuration
                        </h6>
                        <div class="mb-3">
                            <label class="form-label">Number of rows <small class="text-muted">(max 4)</small></label>
                            <select id="numRows" name="grouped_config[num_rows]" class="form-select">
                                <option value="">Select...</option>
                                @foreach([1,2,3,4] as $n)
                                    <option value="{{ $n }}"
                                        {{ ($groupedConfig['num_rows'] ?? null) == $n ? 'selected' : '' }}>
                                        {{ $n }} row{{ $n > 1 ? 's' : '' }}
                                    </option>
                                @endforeach
                            </select>
                        </div>
                        <div id="rowsContainer"></div>
                    </div>

                    {{-- ===== SLIDER ===== --}}
                    <div id="sliderSection"
                        style="display: {{ $formField->type === 'slider' ? 'block' : 'none' }};">
                        <hr>
                        <h6 class="fw-bold mb-3 mt-1">
                            <i class="bi bi-sliders me-1"></i>Slider Configuration
                        </h6>
                        <div class="row g-3">
                            <div class="col-md-12 mb-1">
                                <label class="form-label fw-semibold">Mode</label>
                                <div class="d-flex gap-3">
                                    @foreach(['single' => 'Single value', 'range' => 'Range (min/max)'] as $val => $lbl)
                                        <div class="form-check">
                                            <input class="form-check-input" type="radio"
                                                name="slider_config[mode]"
                                                value="{{ $val }}"
                                                id="slider_{{ $val }}"
                                                {{ ($sliderConfig['mode'] ?? 'single') === $val ? 'checked' : '' }}>
                                            <label class="form-check-label" for="slider_{{ $val }}">
                                                {{ $lbl }}
                                            </label>
                                        </div>
                                    @endforeach
                                </div>
                            </div>
                            <div class="col-md-3">
                                <label class="form-label">Min</label>
                                <input type="number" name="slider_config[min]"
                                    class="form-control"
                                    value="{{ $sliderConfig['min'] ?? 0 }}">
                            </div>
                            <div class="col-md-3">
                                <label class="form-label">Max</label>
                                <input type="number" name="slider_config[max]"
                                    class="form-control"
                                    value="{{ $sliderConfig['max'] ?? 100 }}">
                            </div>
                            <div class="col-md-3">
                                <label class="form-label">Step</label>
                                <input type="number" name="slider_config[step]"
                                    class="form-control"
                                    value="{{ $sliderConfig['step'] ?? 1 }}">
                            </div>
                            <div class="col-md-3">
                                <label class="form-label">Unit <small class="text-muted">(€, km, %...)</small></label>
                                <input type="text" name="slider_config[unit]"
                                    class="form-control"
                                    value="{{ $sliderConfig['unit'] ?? '' }}"
                                    placeholder="%" maxlength="10">
                            </div>
                            <div class="col-md-12">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox"
                                        name="slider_config[show_value]"
                                        value="1"
                                        id="sliderShowValue"
                                        {{ ($sliderConfig['show_value'] ?? true) ? 'checked' : '' }}>
                                    <label class="form-check-label" for="sliderShowValue">
                                        Show current value while sliding
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {{-- ===== MATRIX ===== --}}
                    <div id="matrixSection"
                        style="display: {{ $formField->type === 'matrix' ? 'block' : 'none' }};">
                        <hr>
                        <h6 class="fw-bold mb-3 mt-1">
                            <i class="bi bi-table me-1"></i>Matrix Configuration
                        </h6>
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label fw-semibold">Scale type</label>
                                <select name="matrix_config[scale_type]" class="form-select"
                                    id="matrixScaleType">
                                    @foreach([
                                        'numeric'   => 'Numeric (1–5)',
                                        'numeric10' => 'Numeric (1–10)',
                                        'stars'     => 'Stars ★',
                                        'emoji'     => 'Emoji 😞→😊',
                                        'text'      => 'Text labels',
                                    ] as $val => $lbl)
                                        <option value="{{ $val }}"
                                            {{ ($matrixConfig['scale_type'] ?? 'numeric') === $val ? 'selected' : '' }}>
                                            {{ $lbl }}
                                        </option>
                                    @endforeach
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label fw-semibold">Display style</label>
                                <select name="matrix_config[display]" class="form-select">
                                    @foreach(['radio' => 'Radio buttons per row', 'slider' => 'Slider per row'] as $val => $lbl)
                                        <option value="{{ $val }}"
                                            {{ ($matrixConfig['display'] ?? 'radio') === $val ? 'selected' : '' }}>
                                            {{ $lbl }}
                                        </option>
                                    @endforeach
                                </select>
                            </div>
                            <div class="col-md-12" id="matrixTextLabels"
                                style="display: {{ ($matrixConfig['scale_type'] ?? '') === 'text' ? 'block' : 'none' }};">
                                <label class="form-label fw-semibold">
                                    Column labels <small class="text-muted">(comma separated)</small>
                                </label>
                                <input type="text" name="matrix_config[text_labels]"
                                    class="form-control"
                                    value="{{ $matrixConfig['text_labels'] ?? '' }}"
                                    placeholder="Bad, Average, Good, Very good, Excellent">
                            </div>
                            <div class="col-md-12">
                                <label class="form-label fw-semibold">
                                    Rows (criteria) <small class="text-muted">— one per line</small>
                                </label>
                                <div id="matrixRowsContainer">
                                    {{-- Rebuilt by JS from existingMatrix --}}
                                </div>
                                <button type="button" class="btn btn-outline-secondary btn-sm mt-1"
                                    id="addMatrixRow">
                                    <i class="bi bi-plus me-1"></i>Add row
                                </button>
                            </div>
                        </div>
                    </div>

                    {{-- ===== CONDITIONAL ===== --}}
                    <div id="conditionalSection"
                        style="display: {{ $formField->type === 'conditional' ? 'block' : 'none' }};">
                        <hr>
                        <h6 class="fw-bold mb-3 mt-1">
                            <i class="bi bi-diagram-2 me-1"></i>Conditional Logic
                        </h6>
                        <div class="alert alert-info py-2 small">
                            <i class="bi bi-info-circle me-1"></i>
                            This field will only appear when the condition below is met.
                        </div>
                        <div class="row g-3">
                            <div class="col-md-4">
                                <label class="form-label fw-semibold">Trigger field</label>
                                <select name="conditional_config[trigger_field_key]"
                                    class="form-select">
                                    <option value="">Select a field...</option>
                                    @foreach(\App\Models\FormField::where('is_palette_component', true)
                                        ->whereNotIn('type', ['divider','spacer','submit','conditional'])
                                        ->where('id', '!=', $formField->id)
                                        ->orderBy('label')
                                        ->get() as $pf)
                                        <option value="{{ $pf->field_key }}"
                                            {{ ($conditionalConfig['trigger_field_key'] ?? '') === $pf->field_key ? 'selected' : '' }}>
                                            {{ $pf->label }} ({{ $pf->field_key }})
                                        </option>
                                    @endforeach
                                </select>
                            </div>
                            <div class="col-md-3">
                                <label class="form-label fw-semibold">Operator</label>
                                <select name="conditional_config[operator]" class="form-select">
                                    @foreach([
                                        'equals'       => '= equals',
                                        'not_equals'   => '≠ not equals',
                                        'contains'     => '∋ contains',
                                        'greater_than' => '> greater than',
                                        'less_than'    => '< less than',
                                    ] as $val => $lbl)
                                        <option value="{{ $val }}"
                                            {{ ($conditionalConfig['operator'] ?? 'equals') === $val ? 'selected' : '' }}>
                                            {{ $lbl }}
                                        </option>
                                    @endforeach
                                </select>
                            </div>
                            <div class="col-md-5">
                                <label class="form-label fw-semibold">Trigger value</label>
                                <input type="text" name="conditional_config[trigger_value]"
                                    class="form-control"
                                    value="{{ $conditionalConfig['trigger_value'] ?? '' }}"
                                    placeholder="ex: yes, true, 18...">
                            </div>
                            <div class="col-md-12">
                                <label class="form-label fw-semibold">
                                    Inner field type
                                    <small class="text-muted">(shown when condition is met)</small>
                                </label>
                                <select name="conditional_config[inner_type]" class="form-select">
                                    @foreach(['text','textarea','number','email','select','radio','checkbox','date','file'] as $t)
                                        <option value="{{ $t }}"
                                            {{ ($conditionalConfig['inner_type'] ?? 'text') === $t ? 'selected' : '' }}>
                                            {{ ucfirst($t) }}
                                        </option>
                                    @endforeach
                                </select>
                            </div>
                        </div>
                    </div>

                    {{-- ===== CATEGORIES ===== --}}
                    <div class="mb-3 mt-4">
                        <label class="form-label fw-semibold">Form Categories</label>
                        <div class="row row-cols-2 row-cols-md-3 g-2">
                            @foreach($categories as $category)
                                <div class="col">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox"
                                            name="category_ids[]"
                                            value="{{ $category->id }}"
                                            id="cat_{{ $category->id }}"
                                            {{ in_array($category->id, old('category_ids', $formField->categories->pluck('id')->toArray())) ? 'checked' : '' }}>
                                        <label class="form-check-label" for="cat_{{ $category->id }}">
                                            {{ $category->name }}
                                        </label>
                                    </div>
                                </div>
                            @endforeach
                        </div>
                        @if($categories->isEmpty())
                            <small class="text-muted">No categories available.</small>
                        @endif
                    </div>

                    {{-- ===== PACKS ===== --}}
                    <div class="mb-3">
                        <label class="form-label fw-semibold">Packs</label>
                        <div class="row row-cols-2 row-cols-md-3 g-2">
                            @foreach($packs as $pack)
                                <div class="col">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox"
                                            name="pack_ids[]"
                                            value="{{ $pack->id }}"
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
                        @if($packs->isEmpty())
                            <small class="text-muted">No packs available.</small>
                        @endif
                    </div>

                    <div class="mb-3">
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox"
                                name="is_required" id="is_required" value="1"
                                {{ old('is_required', $formField->is_required) ? 'checked' : '' }}>
                            <label class="form-check-label fw-semibold" for="is_required">
                                Required
                            </label>
                        </div>
                    </div>

                    <div class="d-flex gap-2 mt-2">
                        <button type="submit" class="btn btn-primary">
                            <i class="bi bi-check-lg me-1"></i> Update Field
                        </button>
                        <a href="{{ route('dashboard.form-fields.index') }}"
                            class="btn btn-outline-secondary">Cancel</a>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

@endsection

@push('scripts')
<script>
const fieldTypes    = ['text', 'number', 'email', 'textarea', 'select', 'date', 'phone', 'url'];
const noPlaceholder = [
    'grouped', 'divider', 'spacer', 'submit', 'signature', 'payment',
    'voice', 'location', 'rating', 'file', 'checkbox', 'radio',
    'slider', 'matrix', 'conditional'
];

const sectionMap = {
    grouped:     'groupedSection',
    slider:      'sliderSection',
    matrix:      'matrixSection',
    conditional: 'conditionalSection',
};

const existingGrouped     = @json($groupedConfig     ?? []);
const existingMatrix      = @json($matrixConfig      ?? []);

// ── Type change ────────────────────────────────────────────────
document.getElementById('fieldType').addEventListener('change', function () {
    const type = this.value;

    Object.values(sectionMap).forEach(id => {
        document.getElementById(id).style.display = 'none';
    });

    if (sectionMap[type]) {
        document.getElementById(sectionMap[type]).style.display = 'block';
    }

    document.getElementById('placeholderWrapper').style.display =
        noPlaceholder.includes(type) ? 'none' : 'block';
});

// ── DOMContentLoaded ───────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
    const currentType = document.getElementById('fieldType').value;

    if (currentType === 'grouped' && existingGrouped.num_rows) {
        buildRows(parseInt(existingGrouped.num_rows), existingGrouped.rows ?? {});
    }

    if (currentType === 'matrix') {
        rebuildMatrixRows(existingMatrix.rows ?? []);
    }

    if (noPlaceholder.includes(currentType)) {
        document.getElementById('placeholderWrapper').style.display = 'none';
    }
});

// ── GROUPED ────────────────────────────────────────────────────
document.getElementById('numRows').addEventListener('change', function () {
    buildRows(parseInt(this.value), existingGrouped.rows ?? {});
});

function buildRows(numRows, oldRows) {
    const container = document.getElementById('rowsContainer');
    container.innerHTML = '';

    for (let r = 1; r <= numRows; r++) {
        const rowData = oldRows[r] ?? {};
        const div = document.createElement('div');
        div.className = 'border rounded p-3 mb-3 bg-light';
        div.innerHTML = `
            <h6 class="fw-bold">Row ${r}</h6>
            <div class="mb-2">
                <label class="form-label">
                    Fields in row ${r} <small class="text-muted">(max 3)</small>
                </label>
                <select class="form-select numCols" data-row="${r}"
                    name="grouped_config[rows][${r}][num_cols]">
                    <option value="">Select...</option>
                    ${[1,2,3].map(n =>
                        `<option value="${n}" ${rowData.num_cols == n ? 'selected' : ''}>
                            ${n} field${n > 1 ? 's' : ''}
                        </option>`
                    ).join('')}
                </select>
            </div>
            <div id="colsContainer_${r}"></div>
        `;
        container.appendChild(div);

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
                        <select name="grouped_config[rows][${row}][cols][${c}][type]"
                            class="form-select form-select-sm">
                            ${fieldTypes.map(t =>
                                `<option value="${t}" ${col.type === t ? 'selected' : ''}>
                                    ${t.charAt(0).toUpperCase() + t.slice(1)}
                                </option>`
                            ).join('')}
                        </select>
                    </div>
                    <div class="col-md-4">
                        <label class="form-label small">Label</label>
                        <input type="text"
                            name="grouped_config[rows][${row}][cols][${c}][label]"
                            class="form-control form-control-sm"
                            placeholder="Label..." value="${col.label ?? ''}">
                    </div>
                    <div class="col-md-4">
                        <label class="form-label small">Placeholder</label>
                        <input type="text"
                            name="grouped_config[rows][${row}][cols][${c}][placeholder]"
                            class="form-control form-control-sm"
                            placeholder="Placeholder..." value="${col.placeholder ?? ''}">
                    </div>
                </div>
            </div>
        `;
    }
}

// ── MATRIX ─────────────────────────────────────────────────────
function rebuildMatrixRows(rows) {
    const container = document.getElementById('matrixRowsContainer');
    if (!container) return;
    container.innerHTML = '';

    // Si rows est vide, ajouter une ligne vide par défaut
    const list = rows.length > 0 ? rows : [''];

    list.forEach(row => {
        const div = document.createElement('div');
        div.className = 'input-group mb-2 matrix-row-item';
        div.innerHTML = `
            <input type="text" name="matrix_config[rows][]"
                class="form-control" value="${row}"
                placeholder="ex: Service quality">
            <button type="button" class="btn btn-outline-danger btn-remove-matrix-row">
                <i class="bi bi-trash"></i>
            </button>
        `;
        container.appendChild(div);
    });
}

const addMatrixBtn = document.getElementById('addMatrixRow');
if (addMatrixBtn) {
    addMatrixBtn.addEventListener('click', function () {
        const container = document.getElementById('matrixRowsContainer');
        const div = document.createElement('div');
        div.className = 'input-group mb-2 matrix-row-item';
        div.innerHTML = `
            <input type="text" name="matrix_config[rows][]"
                class="form-control" placeholder="ex: Delivery speed">
            <button type="button" class="btn btn-outline-danger btn-remove-matrix-row">
                <i class="bi bi-trash"></i>
            </button>
        `;
        container.appendChild(div);
    });
}

document.addEventListener('click', function (e) {
    if (e.target.closest('.btn-remove-matrix-row')) {
        const items = document.querySelectorAll('.matrix-row-item');
        if (items.length > 1) {
            e.target.closest('.matrix-row-item').remove();
        }
    }
});

const matrixScaleType = document.getElementById('matrixScaleType');
if (matrixScaleType) {
    matrixScaleType.addEventListener('change', function () {
        const el = document.getElementById('matrixTextLabels');
        if (el) el.style.display = this.value === 'text' ? 'block' : 'none';
    });
}
</script>
@endpush
