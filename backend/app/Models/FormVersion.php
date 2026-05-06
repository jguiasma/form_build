<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FormVersion extends Model
{
   use HasFactory;

    protected $fillable = [
        'form_id',
        'version',
        'schema',
        'share_link',
    ];

    protected $casts = [
        'schema' => 'array',
    ];

    public function form(): BelongsTo
    {
        return $this->belongsTo(Form::class);
    }
}
