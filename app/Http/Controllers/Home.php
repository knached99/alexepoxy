<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ContactSubmissionsModel;
use App\Models\User;
use Illuminate\Support\Facades\Notification;
use App\Notifications\NotifyContactSubmitted;
use Illuminate\Notifications\NotificationException;
class Home extends Controller
{
    public function submitContactForm(Request $request)
    {
        // Ensure that the request is JSON
        if ($request->isJson()) {
            // Decode the JSON content
            $data = json_decode($request->getContent(), true);

            // Perform validation on the decoded data
            $rules = [
                'name' => 'required',
                'email' => 'required|email',
                'phone_number' => 'required|regex:/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/',
                'message' => 'required',
            ];

            $messages = [
                'name.required' => 'Your name is required',
                'email.required' => 'Your email is required',
                'email.email' => 'That is not a valid email',
                'phone_number.required' => 'Your phone number is required',
                'phone_number.regex' => 'Phone number must be a valid phone number in the format: (xxx)-xxx-xxxx',
                'message.required' => 'A brief message is required',
            ];

            $validator = \Validator::make($data, $rules, $messages);

            // If validation fails, return error response
            if ($validator->fails()) {
                return response()->json(['error' => $validator->errors()], 422);
            }

            try {
                // Create record in the database
                ContactSubmissionsModel::create($data);
                Notification::route('mail', env('MAIL_FROM_ADDRESS'))->notify(new NotifyContactSubmitted($data));

                // Return success response
                return response()->json(['success' => 'Alex Epoxy has been notified and will reach out to your email ' . $data['email'] . ' soon!']);
            } catch (\Exception $e) {
                // Return error response
                return response()->json(['error' => 'Something went wrong submitting this form'], 500);
            }
            catch(NotificationException $e){
                return response()->json(['error' => 'Something went wrong sending an email to the business'], 500);
            }
        }

        // If the request is not JSON, return an error response
        return response()->json(['error' => 'Invalid request format'], 400);
    }

    public function getSocialMediaLinks(){
        try{
           $socialMediaLinks =  User::select('facebook_url', 'instagram_url', 'twitter_url', 'tiktok_url')->get();
            return response()->json($socialMediaLinks);
        }
        catch(\Exception $e){
            \Log::error('Unable to get social media links: '.$e->getMessage());
        }
    }

}
