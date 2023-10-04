<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ContactSubmissionsModel;

class DashboardController extends Controller
{
    public function getContactSubmissions(){
        $contactSubmissions = ContactSubmissionsModel::all();
        return $contactSubmissions; 
    }
}
