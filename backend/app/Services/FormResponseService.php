<?php
namespace App\Services;

use App\Models\FormResponse;
use App\Models\FormAnswer;
use Illuminate\Support\Carbon;

class FormResponseService
{
    public function start(int $formId, ?int $userId, array $biometricData = []): FormResponse
    {
        return FormResponse::create(array_merge([
            'form_id'    => $formId,
            'user_id'    => $userId,
            'status'     => 'in_progress',
            'started_at' => Carbon::now(),
        ], $biometricData));
    }

    public function saveAnswers(int $responseId, array $answers): void
    {
        foreach ($answers as $answer) {
            FormAnswer::updateOrCreate(
                ['response_id' => $responseId, 'field_id' => $answer['field_id']],
                ['value'       => $answer['value']]
            );
        }
    }

    public function submit(int $responseId): FormResponse
    {
        $response = FormResponse::findOrFail($responseId);
        $response->update(['status' => 'completed', 'submitted_at' => Carbon::now()]);
        return $response;
    }
}