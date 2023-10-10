<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Home;
use App\Http\Controllers\DashboardController;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Home', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::post('/submitContactForm', [Home::class, 'submitContactForm'])->name('submitContactForm');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/getPhotosFromGallery', [DashboardController::class, 'getPhotosFromGallery'])->name('getPhotosFromGallery');

Route::middleware('auth')->group(function () {
    Route::get('/gallery', [DashboardController::class, 'displayGallery'])->name('gallery');
    Route::get('/getContactSubmissions', [DashboardController::class, 'getContactSubmissions'])->name('getContactSubmissions');
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::delete('/deleteSubmission/{submissionID}', [DashboardController::class, 'deleteSubmission'])->name('deleteSubmission');
    Route::post('/uploadPhotoToGallery', [DashboardController::class, 'uploadPhotoToGallery'])->name('uploadPhotoToGallery');
    Route::get('/photo/{photoID}/view', [DashboardController::class, 'renderPhotoGallery'])->name('view');
    Route::get('/getPhotoByID/{photoID}', [DashboardController::class, 'getPhotoByID'])->name('getPhotoByID');
    Route::put('/editPhoto/{photoID}', [DashboardController::class,  'editPhoto'])->name('editPhoto');
    Route::delete('/deletePhoto/{photoID}', [DashboardController::class, 'deletePhotoFromGallery'])->name('deletePhoto');
});

require __DIR__.'/auth.php';
