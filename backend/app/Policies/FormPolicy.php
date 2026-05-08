<?php

namespace App\Policies;

use App\Models\Form;
use App\Models\Account;
use Illuminate\Auth\Access\Response;

class FormPolicy
{
    /**
     * Determine whether the account can view any models.
     */
    public function viewAny(Account $account): bool
    {
        return true; 
    }

    /**
     * Determine whether the account can view the model.
     */
    public function view(Account $account, Form $form): bool
    {
        return true; 
    }

    public function create(Account $account): bool
    {
        return true;
    }

    public function update(Account $account, Form $form): bool
    {
        return true;
    }

    public function delete(Account $account, Form $form): bool
    {
        return true;
    }

    public function restore(Account $account, Form $form): bool
    {
        return true;
    }

    public function forceDelete(Account $account, Form $form): bool
    {
        return true;
    }
}
