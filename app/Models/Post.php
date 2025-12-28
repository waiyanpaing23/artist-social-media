<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    protected $fillable = [
        'user_id',
        'type',
        'content',
        'title',
        'medium',
        'dimensions',
    ];

    public function media()
    {
        return $this->hasMany(Media::class);
    }
}
