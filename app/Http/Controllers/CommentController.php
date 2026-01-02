<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCommentRequest;
use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CommentController extends Controller
{
    public function store(StoreCommentRequest $request)
    {
        DB::beginTransaction();
        try {
            $user_id = Auth::id();

            $comment = Comment::create([
                'user_id' => $user_id,
                'post_id' => $request->post_id,
                'content' => $request->content
            ]);

            DB::commit();
            return redirect()->back();

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Failed');
        }
    }


    public function update(Request $request, Comment $comment)
    {
        if ($comment->user_id !== Auth::id()) {
            abort(403);
        }

        $request->validate([
            'content' => 'required|string|max:1000'
        ]);

        $comment->update([
            'content' => $request->content
        ]);

        return redirect()->back();
    }


    public function destroy($id)
    {
        $comment = Comment::find($id);

        if ($comment->user_id !== Auth::id()) {
            abort(403);
        }

        $comment->delete();

        return redirect()->back()->with('success', 'Comment Deleted Successfully!');
    }
}
