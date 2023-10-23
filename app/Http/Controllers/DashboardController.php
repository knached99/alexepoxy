<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ContactSubmissionsModel;
use App\Models\PhotoGallery;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Notification;
use Intervention\Image\Facades\Image; 
use Intervention\Image\Exception\NotReadableException; // Catches File Exceptions for the Intervention\Image dependency
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Notifications\NotificationException;
use App\Notifications\ReplyNotification;

class DashboardController extends Controller
{
    public function getContactSubmissions()
{
    try {
        $contactSubmissions = ContactSubmissionsModel::select('id', 'name', 'email', 'phone_number', 'message', 'created_at')->get();
        // \Log::info($contactSubmissions);
        return response()->json($contactSubmissions);
    } catch (\Exception $e) {
        \Log::error('Exception Caught in: '.__FUNCTION__.' On Line: '.$e->getLine().' Error Message: '.$e->getMessage());
        return response()->json(['error' => $e->getMessage()], 500);
    }
}

public function deleteSubmission($id){
    try {
        $delete = ContactSubmissionsModel::destroy($id);

        if ($delete) {
            return response()->json(['success' => 'Submission deleted successfully']);
        } else {
            return response()->json(['error' => 'Submission not found'], 404);
        }
    } catch (\Exception $e) {
        // Handle any exceptions that occur during deletion
        \Log::error('Exception Caught in: '.__FUNCTION__.' On Line: '.$e->getLine().' Error Message: '.$e->getMessage());
        return response()->json(['error' => 'An error occurred while deleting the submission'], 500);
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
        \Log::error('Exception Caught in: '.__FUNCTION__.' On Line: '.$e->getLine().' Error Message: '.$e->getMessage());
        return response()->json(['error' => 'Something went wrong getting the photos from the gallery'], 500);
    }
}

public function renderPhotoGallery($photoID) {
    try {
        $data = PhotoGallery::where('id', $photoID)->firstOrFail(); // Fetch the photo data
        return Inertia::render('View', [
            'photoID' => $photoID,
            'data' => $data, 
        ]);
    } catch (\Exception $e) {
        \Log::error('Exception Caught in: '.__FUNCTION__.' On Line: '.$e->getLine().' Error Message: '.$e->getMessage());
        return response()->json(['error' => 'Something went wrong getting that photo from the gallery'], 500);
    }
    catch(ModelNotFoundException $e){
        \Log::error('Exception Caught in: '.__FUNCTION__.' On Line: '.$e->getLine().' Error Message: '.$e->getMessage());
        return response()->json(['error'=>'Cannot get that photo, it may not exist or you may have deleted it']);
    }
}

public function getContactSubmission($contactID){
    try{
        $data = ContactSubmissionsModel::where('id', $contactID)->firstOrFail(); 
        return Inertia::render('ViewContactSubmission', [
            'contactID' => $contactID,
            'data' => $data 
        ]);
    }

    catch(ModelNotFoundException $e){
        return response()->json(['error'=>'Could not find that submission, you may have deleted it'], 500);
    }
   
    catch(\Exception $e){
        return response()->json(['error' => 'Cannot fetch contact data'], 500);
    }
}


public function getPhotoByID($photoID) {
    try{
        $data = PhotoGallery::where('id', $photoID)->firstOrFail(); // Fetch the photo data
        return response()->json($data);
    }
    catch(\Exception $e){
        \Log::error('Exception Caught in: '.__FUNCTION__.' On Line: '.$e->getLine().' Error Message: '.$e->getMessage());
        return response()->json(['error'=>'Something went wrong getting new content'], 500);
    }

    catch(ModelNotFoundException $e){
        \Log::error('Exception Caught in: '.__FUNCTION__.' On Line: '.$e->getLine().' Error Message: '.$e->getMessage());
        return response()->json(['error'=>'Something went wrong getting new content'], 500);
    }
}




public function respondToCustomer(Request $request, $customerID){
    try{
        $customer = ContactSubmissionsModel::findOrFail($customerID);
        if($request->isJson()){
            $data = json_decode($request->getContent(), true);
            $rules = [
                'message'=>'required'
            ];

            $messages = [
                'messages.required'=>'You must send a reply to this person'
            ];

            $validate = \Validator::make($data, $rules, $messages);

            if($validate->fails()){
                return response()->json(['error'=>$validate->errors()], 422);
            }
            Notification::route('mail', $customer->email)->notify(new ReplyNotification($customer->name, $customer->message, $data));
            return response()->json(['success'=>'Your reply was sent to '.$customer->name. '. You can delete this submission if you\'d like.']);
        }
    }
    catch(ModelNotFoundException $e){
        \Log::error('Exception Caught in: '.__FUNCTION__.' On Line: '.$e->getLine().' Error Message: '.$e->getMessage());
        return response()->json(['error'=>'Something went wrong, if this persists, please reach out to the pixel perfect team'], 500);
    }
    catch(NotificationException $e){
        \Log::error('Exception Caught in: '.__FUNCTION__.' On Line: '.$e->getLine().' Error Message: '.$e->getMessage());
        return response()->json(['error'=>'Something went wrong sending '.$customer->name.' a reply, if this persists, please reach out to the pixel perfect team'], 500);
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
        \Log::error('Exception Caught in: '.__FUNCTION__.' On Line: '.$e->getLine().' Error Message: '.$e->getMessage());
        return response()->json(['error' => 'Something went wrong uploading the photo to the gallery']);
    } catch (NotReadableException $e) {
        \Log::error('Exception Caught in: '.__FUNCTION__.' On Line: '.$e->getLine().' Error Message: '.$e->getMessage());
        return response()->json(['error', 'Something went wrong uploading that photo to the gallery.']);
    }
}

public function editPhoto(Request $request, $photoID){
    try{
        $photo = PhotoGallery::findOrFail($photoID);
        $validate = \Validator::make($request->only('photo_label', 'photo_description'),[
            'photo_label'=>'required',
            'photo_description'=>'required'
        ]);
        if($validate->fails()){
            return response()->json(['error'=>$validate->errors()], 422);
        }
        $photo->photo_label = $request->input('photo_label');
        $photo->photo_description = $request->input('photo_description');
        $photo->save();
        return response()->json(['success'=>'Your changes were saved']);
    }
    catch(\Exception $e){
        \Log::error('Exception Caught in: '.__FUNCTION__.' On Line: '.$e->getLine().' Error Message: '.$e->getMessage());
        return response()->json(['error'=>'Something went wrong editing this content']);
    }
    catch(ModelNotFoundException $e){
        \Log::error('Exception Caught in: '.__FUNCTION__.' On Line: '.$e->getLine().' Error Message: '.$e->getMessage());
        return response()->json(['error'=>'Something went wrong editing this content']);
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
            \Log::error('Exception Caught in: '.__FUNCTION__.' On Line: '.$e->getLine().' Error Message: '.$e->getMessage());
            return response()->json(['error'=> 'An error occurred while deleting that photo'], 500);
        }
    
}



    
}
