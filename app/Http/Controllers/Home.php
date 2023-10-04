<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ContactSubmissionsModel;

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

                // Return success response
                return response()->json(['success' => 'Alex Epoxy has been notified and will reach out to your email ' . $data['email'] . ' soon!']);
            } catch (\Exception $e) {
                // Return error response
                return response()->json(['error' => $e->getMessage()], 500);
            }
        }

        // If the request is not JSON, return an error response
        return response()->json(['error' => 'Invalid request format'], 400);
    }
}
