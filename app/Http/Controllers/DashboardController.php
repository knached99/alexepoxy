<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ContactSubmissionsModel;

class DashboardController extends Controller
{
    public function getContactSubmissions()
{
    try {
        $contactSubmissions = ContactSubmissionsModel::all();
        return response()->json($contactSubmissions);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
}

    
}
