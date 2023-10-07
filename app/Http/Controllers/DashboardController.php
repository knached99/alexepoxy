<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ContactSubmissionsModel;
use App\Models\PhotoGallery;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Facades\Image; // Import the Image facade
use Intervention\Image\Exception\NotReadableException; // Catches File Exceptions for the Intervention\Image dependency

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

public function displayGallery(){
    return Inertia::render('Gallery');
}

public function getPhotosFromGallery(){
    try{
        $photos = PhotoGallery::select('id', 'photo_label', 'photo', 'photo_description', 'created_at')->get();
        return response()->json($photos);
    }
    catch(\Exception $e){
        return response()->json(['error' => $e->getMessage()], 500);
    }
}



public function uploadPhotoToGallery(Request $request)
{
   
        // Validate the request data
        $validator = \Validator::make($request->all(), [
            'photo' => 'required|image|mimes:jpeg,png,jpg,webp|max:2048',
            'photo_label' => 'required',
            'photo_description' => 'required',
        ], [
            'photo.required' => 'Photo is required',
            'photo.image' => 'Photo must be a valid image',
            'photo.mimes' => 'Photo must be a valid jpeg, jpg, png, or webp file',
            'photo.max' => 'Photo must be a max size of 2 megabytes',
            'photo_label.required' => 'Photo label is required',
            'photo_description.required' => 'Photo description is required',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

    try {
        $file = $request->file('photo');
     
        
        // Generate a unique filename
        $filename = $file->hashName() . '.' . $file->extension();
    
        // Create an Intervention Image instance from the uploaded file
        $image = Image::make($file);
    
        // Resize the image to 379x379 pixels
        $image->fit(379, 379);
    
        // Save the processed image
        $image->save(storage_path('app/public/gallery/' . $filename));
    
        // Create a new record in the database
        PhotoGallery::create([
            'photo' => $filename,
            'photo_label' => $request->input('photo_label'),
            'photo_description' => $request->input('photo_description'),
        ]);
    
        return response()->json(['success' => 'Photo uploaded to the gallery']);
    } catch (\Exception $e) {
        \Log::error('Exception: ' . $e->getMessage());
        return response()->json(['error' => 'Something went wrong uploading the photo to the gallery']);
    } catch (NotReadableException $e) {
        \Log::error('Image Intervention Exception: ' . $e->getMessage());
        return response()->json(['error', 'Something went wrong uploading that photo to the gallery.']);
    }
}


public function deletePhotoFromGallery($photoID){
    try{
        $photo = PhotoGallery::find($photoID);
        if(Storage::exists('public/gallery/'.$photo->photo)){
           $deleteFromStorage = Storage::delete('public/gallery/'.$photo->photo);
        }
        $deletePhoto = $photo->delete();
        if($deletePhoto && $deleteFromStorage){
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



    
}
