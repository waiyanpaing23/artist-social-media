<?php

namespace App\Http\Controllers;

use App\Models\Like;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class LikeController extends Controller
{
    public function likeUnlike(Request $request)
    {
        DB::beginTransaction();
        try {
            $user_id = Auth::id();
            $post_id = $request->post_id;

            $existingLike = Like::where('user_id', $user_id)->where('post_id', $post_id)->first();

            if (!$existingLike) { // like post
                $like = new Like();
                $like->user_id = $user_id;
                $like->post_id = $post_id;
                $like->save();

            } else { // unlike post
                $existingLike->delete();
            }

            DB::commit();
            return redirect()->back();

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Failed');
        }
    }
}
