<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ContactSubmissionsModel;
use App\Models\PhotoGallery;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function getContactSubmissions()
{
    try {
        $contactSubmissions = ContactSubmissionsModel::select('id', 'name', 'email', 'phone_number', 'message', 'created_at')->get();
        // \Log::info($contactSubmissions);
        return response()->json($contactSubmissions);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
}

public function displayGallery(){
    return Inertia::render('Gallery');
}

public function getPhotosFromGallery(){
    try{
        $photos = PhotoGallery::select('id', 'photo_label', 'photo', 'photo_description')->get();
        return response()->json($photos);
    }
    catch(\Exception $e){
        return response()->json(['error' => $e->getMessage()], 500);
    }
}

public function deletePhotoFromGallery($photoID){
    try{
        $deletePhoto = PhotoGallery::destroy($photoID);

        if($deletePhoto){
            return response()->json(['success'=>'Photo deleted from gallery']);
        }
        else{
            return response()->json(['error'=>'Unable to delete photo']);
        }
    }
        catch(\Exception $e){
            return response()->json(['error'=> 'An error occurred while deleting that photo: '.$e->getMessage()], 500);
        }
    
}

public function deleteSubmission($submissionID){
    try {
        $delete = ContactSubmissionsModel::destroy($submissionID);

        if ($delete) {
            return response()->json(['success' => 'Submission deleted successfully']);
        } else {
            return response()->json(['error' => 'Submission not found'], 404);
        }
    } catch (\Exception $e) {
        // Handle any exceptions that occur during deletion
        return response()->json(['error' => 'An error occurred while deleting the submission: '.$e->getMessage().' '], 500);
    }
}

    
}
