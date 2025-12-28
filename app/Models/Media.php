<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Media extends Model
{
    protected $fillable = [
        'post_id',
        'media_type',
        'file_path',
    ];

    public function post()
    {
        return $this->belongsTo(Post::class);
    }
}
