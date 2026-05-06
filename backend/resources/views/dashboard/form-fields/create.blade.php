@extends('dashboard.layouts.app')

@section('title', 'Create Field')
@section('page-title', 'Create Field')

@section('content')

<div class="row">
    <div class="col-md-8">
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span><i class="bi bi-plus-lg me-2"></i>New Palette Field</span>
                <a href="{{ route('dashboard.form-fields.index') }}" class="btn btn-secondary btn-sm">
                    <i class="bi bi-arrow-left me-1"></i> Back
                </a>
            </div>
            <div class="card-body">
                <form action="{{ route('dashboard.form-fields.store') }}" method="POST">
                    @csrf

                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label fw-semibold">Label <span class="text-danger">*</span></label>
                            <input type="text" name="label" value="{{ old('label') }}"
                                class="form-control @error('label') is-invalid @enderror"
                                placeholder="Field label">
                            @error('label')<div class="invalid-feedback">{{ $message }}</div>@enderror
                        </div>

                        <div class="col-md-6 mb-3">
                            <label class="form-label fw-semibold">Field Key <span class="text-danger">*</span></label>
                            <input type="text" name="field_key" value="{{ old('field_key') }}"
                                class="form-control @error('field_key') is-invalid @enderror"
                                placeholder="ex: address_grouped_component">
                            @error('field_key')<div class="invalid-feedback">{{ $message }}</div>@enderror
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label fw-semibold">Type <span class="text-danger">*</span></label>
                            <select name="type" id="fieldType" class="form-select @error('type') is-invalid @enderror">
                                <option value="">Select type...</option>
                                @foreach(['text','textarea','number','email','password','select','radio','checkbox','date','file','submit','signature','phone','divider','rating','url','location','voice','payment','spacer','grouped','slider','matrix','conditional'] as $type)
                                    <option value="{{ $type }}" {{ old('type') == $type ? 'selected' : '' }}>
                                        {{ ucfirst($type) }}
                                    </option>
                                @endforeach
                            </select>
                            @error('type')<div class="invalid-feedback">{{ $message }}</div>@enderror
                        </div>

                        <div class="col-md-6 mb-3" id="placeholderWrapper">
                            <label class="form-label fw-semibold">Placeholder</label>
                            <input type="text" name="placeholder" value="{{ old('placeholder') }}"
                                class="form-control @error('placeholder') is-invalid @enderror"
                                placeholder="Input placeholder...">
                            @error('placeholder')<div class="invalid-feedback">{{ $message }}</div>@enderror
                        </div>
                    </div>

                    <div class="mb-3" id="descriptionWrapper">
                        <label class="form-label fw-semibold">Description</label>
                        <textarea name="description" class="form-control @error('description') is-invalid @enderror"
                            rows="2" placeholder="Field description...">{{ old('description') }}</textarea>
                        @error('description')<div class="invalid-feedback">{{ $message }}</div>@enderror
                    </div>

                    {{-- ===== GROUPED SECTION ===== --}}
                    <div id="groupedSection" style="display:none;">
                        <hr>
                        <h6 class="fw-bold mb-3 mt-1">
                            <i class="bi bi-grid me-1"></i>Grouped Field Configuration
                        </h6>

                        <div class="mb-3">
                            <label class="form-label">Number of rows <small class="text-muted">(max 4)</small></label>
                            <select id="numRows" name="grouped_config[num_rows]" class="form-select">
                                <option value="">Select...</option>
                                @foreach([1,2,3,4] as $n)
                                    <option value="{{ $n }}" {{ old('grouped_config.num_rows') == $n ? 'selected' : '' }}>
                                        {{ $n }} row{{ $n > 1 ? 's' : '' }}
                                    </option>
                                @endforeach
                            </select>
                        </div>

                        <div id="rowsContainer"></div>
                    </div>

                    {{-- ===== SLIDER SECTION ===== --}}
                    <div id="sliderSection" style="display:none;">
                        <hr>
                        <h6 class="fw-bold mb-3 mt-1">
                            <i class="bi bi-sliders me-1"></i>Slider Configuration
                        </h6>
                        <div class="row g-3">
                            <div class="col-md-12 mb-1">
                                <label class="form-label fw-semibold">Mode</label>
                                <div class="d-flex gap-3">
                                    <div class="form-check">
                                        <input class="form-check-input" type="radio"
                                            name="slider_config[mode]" value="single"
                                            id="sliderSingle" checked>
                                        <label class="form-check-label" for="sliderSingle">
                                            Single value
                                        </label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" type="radio"
                                            name="slider_config[mode]" value="range"
                                            id="sliderRange">
                                        <label class="form-check-label" for="sliderRange">
                                            Range (min/max)
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <label class="form-label">Min</label>
                                <input type="number" name="slider_config[min]"
                                    class="form-control" value="0" placeholder="0">
                            </div>
                            <div class="col-md-3">
                                <label class="form-label">Max</label>
                                <input type="number" name="slider_config[max]"
                                    class="form-control" value="100" placeholder="100">
                            </div>
                            <div class="col-md-3">
                                <label class="form-label">Step</label>
                                <input type="number" name="slider_config[step]"
                                    class="form-control" value="1" placeholder="1">
                            </div>
                            <div class="col-md-3">
                                <label class="form-label">Unit <small class="text-muted">(€, km, %...)</small></label>
                                <input type="text" name="slider_config[unit]"
                                    class="form-control" placeholder="%" maxlength="10">
                            </div>
                            <div class="col-md-12">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox"
                                        name="slider_config[show_value]" value="1"
                                        id="sliderShowValue" checked>
                                    <label class="form-check-label" for="sliderShowValue">
                                        Show current value while sliding
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {{-- ===== MATRIX SECTION ===== --}}
                    <div id="matrixSection" style="display:none;">
                        <hr>
                        <h6 class="fw-bold mb-3 mt-1">
                            <i class="bi bi-table me-1"></i>Matrix Configuration
                        </h6>
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label fw-semibold">
                                    Scale type
                                </label>
                                <select name="matrix_config[scale_type]" class="form-select" id="matrixScaleType">
                                    <option value="numeric">Numeric (1–5)</option>
                                    <option value="numeric10">Numeric (1–10)</option>
                                    <option value="stars">Stars ★</option>
                                    <option value="emoji">Emoji 😞→😊</option>
                                    <option value="text">Text labels</option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label fw-semibold">Display style</label>
                                <select name="matrix_config[display]" class="form-select">
                                    <option value="radio">Radio buttons per row</option>
                                    <option value="slider">Slider per row</option>
                                </select>
                            </div>

                            <div class="col-md-12" id="matrixTextLabels" style="display:none;">
                                <label class="form-label fw-semibold">
                                    Column labels
                                    <small class="text-muted">(comma separated)</small>
                                </label>
                                <input type="text" name="matrix_config[text_labels]"
                                    class="form-control"
                                    placeholder="Bad, Average, Good, Very good, Excellent">
                            </div>

                            <div class="col-md-12">
                                <label class="form-label fw-semibold">
                                    Rows (criteria)
                                    <small class="text-muted">— one per line</small>
                                </label>
                                <div id="matrixRowsContainer">
                                    <div class="input-group mb-2 matrix-row-item">
                                        <input type="text" name="matrix_config[rows][]"
                                            class="form-control" placeholder="ex: Service quality">
                                        <button type="button" class="btn btn-outline-danger btn-remove-matrix-row">
                                            <i class="bi bi-trash"></i>
                                        </button>
                                    </div>
                                </div>
                                <button type="button" class="btn btn-outline-secondary btn-sm mt-1" id="addMatrixRow">
                                    <i class="bi bi-plus me-1"></i>Add row
                                </button>
                            </div>
                        </div>
                    </div>

                    {{-- ===== CONDITIONAL SECTION ===== --}}
                    <div id="conditionalSection" style="display:none;">
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
                                <select name="conditional_config[trigger_field_key]" class="form-select">
                                    <option value="">Select a field...</option>
                                    @foreach(\App\Models\FormField::where('is_palette_component', true)
                                        ->whereNotIn('type', ['divider','spacer','submit','conditional'])
                                        ->orderBy('label')
                                        ->get() as $paletteField)
                                        <option value="{{ $paletteField->field_key }}">
                                            {{ $paletteField->label }}
                                            <span class="text-muted">({{ $paletteField->field_key }})</span>
                                        </option>
                                    @endforeach
                                </select>
                            </div>
                            <div class="col-md-3">
                                <label class="form-label fw-semibold">Operator</label>
                                <select name="conditional_config[operator]" class="form-select">
                                    <option value="equals">= equals</option>
                                    <option value="not_equals">≠ not equals</option>
                                    <option value="contains">∋ contains</option>
                                    <option value="greater_than">> greater than</option>
                                    <option value="less_than">< less than</option>
                                </select>
                            </div>
                            <div class="col-md-5">
                                <label class="form-label fw-semibold">Trigger value</label>
                                <input type="text" name="conditional_config[trigger_value]"
                                    class="form-control" placeholder="ex: yes, true, 18...">
                            </div>
                            <div class="col-md-12">
                                <label class="form-label fw-semibold">
                                    Inner field type
                                    <small class="text-muted">(the field shown when condition is met)</small>
                                </label>
                                <select name="conditional_config[inner_type]" class="form-select">
                                    @foreach(['text','textarea','number','email','select','radio','checkbox','date','file'] as $t)
                                        <option value="{{ $t }}">{{ ucfirst($t) }}</option>
                                    @endforeach
                                </select>
                            </div>
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
                                            {{ in_array($category->id, old('category_ids', [])) ? 'checked' : '' }}>
                                        <label class="form-check-label" for="cat_{{ $category->id }}">
                                            {{ $category->name }}
                                        </label>
                                    </div>
                                </div>
                            @endforeach
                        </div>
                        @if($categories->isEmpty())
                            <small class="text-muted">No categories available.
                                <a href="{{ route('dashboard.form-categories.create') }}">Create one</a>
                            </small>
                        @endif
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
                                            {{ in_array($pack->id, old('pack_ids', [])) ? 'checked' : '' }}>
                                        <label class="form-check-label" for="pack_{{ $pack->id }}">
                                            {{ $pack->title }}
                                            <small class="text-muted">{{ $pack->amount }} TND</small>
                                        </label>
                                    </div>
                                </div>
                            @endforeach
                        </div>
                        @if($packs->isEmpty())
                            <small class="text-muted">No packs available.
                                <a href="{{ route('dashboard.packs.create') }}">Create one</a>
                            </small>
                        @endif
                    </div>

                    <div class="mb-3">
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" name="is_required"
                                id="is_required" value="1" {{ old('is_required') ? 'checked' : '' }}>
                            <label class="form-check-label fw-semibold" for="is_required">Required</label>
                        </div>
                    </div>

                    <div class="d-flex gap-2 mt-2">
                        <button type="submit" class="btn btn-primary">
                            <i class="bi bi-check-lg me-1"></i> Create Field
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

// ── Type change ────────────────────────────────────────────────
document.getElementById('fieldType').addEventListener('change', function () {
    const type = this.value;

    // Cacher toutes les sections spéciales
    Object.values(sectionMap).forEach(id => {
        document.getElementById(id).style.display = 'none';
    });

    // Afficher la bonne section
    if (sectionMap[type]) {
        document.getElementById(sectionMap[type]).style.display = 'block';
    }

    // Placeholder visibility
    document.getElementById('placeholderWrapper').style.display =
        noPlaceholder.includes(type) ? 'none' : 'block';
});

// ── GROUPED ────────────────────────────────────────────────────
document.getElementById('numRows').addEventListener('change', function () {
    buildRows(parseInt(this.value), {});
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
                    Fields in row ${r}
                    <small class="text-muted">(max 3)</small>
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
                            placeholder="Label..."
                            value="${col.label ?? ''}">
                    </div>
                    <div class="col-md-4">
                        <label class="form-label small">Placeholder</label>
                        <input type="text"
                            name="grouped_config[rows][${row}][cols][${c}][placeholder]"
                            class="form-control form-control-sm"
                            placeholder="Placeholder..."
                            value="${col.placeholder ?? ''}">
                    </div>
                </div>
            </div>
        `;
    }
}

// ── MATRIX ─────────────────────────────────────────────────────
document.getElementById('matrixScaleType').addEventListener('change', function () {
    document.getElementById('matrixTextLabels').style.display =
        this.value === 'text' ? 'block' : 'none';
});

document.getElementById('addMatrixRow').addEventListener('click', function () {
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

// Suppression d'une ligne matrix (délégation)
document.addEventListener('click', function (e) {
    if (e.target.closest('.btn-remove-matrix-row')) {
        const items = document.querySelectorAll('.matrix-row-item');
        if (items.length > 1) {
            e.target.closest('.matrix-row-item').remove();
        }
    }
});
</script>
@endpush
