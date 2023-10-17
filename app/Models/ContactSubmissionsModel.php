<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContactSubmissionsModel extends Model
{
    use HasFactory;

    protected $table = 'contact_submissions';

    protected $primaryKey = 'id';

    protected $fillable = [
        'name',
        'email',
        'phone_number',
        'message'
    ];

}
