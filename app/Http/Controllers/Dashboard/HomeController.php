<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Account;
use App\Models\Form;
use App\Models\Pack;
use App\Models\Subscription;

class HomeController extends Controller
{
    public function index()
    {
        $stats = [
            'accounts' => Account::count('*'),
            'forms' => Form::count('*'),
            'packs' => Pack::count('*'),
            'subscriptions' => Subscription::count('*'),
        ];

        return view('dashboard.home', compact('stats'));
    }
}
