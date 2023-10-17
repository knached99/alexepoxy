<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContactSubmissionsModel extends Model
{
    use HasFactory;

    protected $table = 'contact_submissions';

    protected $primaryKey = 'submissionID';

    protected $fillable = [
        'submissionID',
        'name',
        'email',
        'phone_number',
        'message'
    ];

    protected $casts = ['submissionID'=>'string'];
}
