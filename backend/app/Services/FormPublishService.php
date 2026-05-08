<?php

namespace App\Services;

use App\Models\Form;
use App\Models\FormVersion;
use Illuminate\Support\Str;

class FormPublishService
{
   public function publish(Form $form): FormVersion
{
    $form->load(['category', 'creator', 'steps.fields.options']);

    $lastVersion = (int) $form->versions()->max('version');

    $shareLink = $form->versions()
        ->whereNotNull('share_link')
        ->oldest()
        ->value('share_link') ?: Str::slug($form->title) . '-' . Str::random(6);

    return FormVersion::create([
        'form_id' => $form->id,
        'version' => (string) ($lastVersion + 1),
        'schema' => $this->buildSchema($form),
        'share_link' => $shareLink,
    ]);
}


    private function buildSchema(Form $form): array
    {
        return $form->toArray();
    }
}
