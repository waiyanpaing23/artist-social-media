<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Models\Post;
use App\Models\User;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function index($id)
    {
        $currentUser = Auth::user();

        $user = User::findOrFail($id);
        $user->loadCount(['artworks', 'statuses', 'followers', 'following']);

        if ($currentUser) {
            $user->loadExists(['followers as is_following' => function ($q) use ($currentUser) {
                $q->where('follower_id', $currentUser->id);
            }]);
        } else {
            $user->is_following = false;
        }

        $post = Post::where('user_id', $user->id)
                ->with('media', 'author')
                ->orderBy('created_at', 'desc')
                ->withCount('likes')
                ->withExists(['likes as is_liked_by_user' => function ($query) use ($currentUser) {
                    if ($currentUser) {
                        $query->where('user_id', $currentUser->id);
                    } else {
                        $query->whereRaw('1 = 0'); // guest
                    }
                    }])
                ->with([
                    'comments.user' => function($query) {
                        $query->select('id', 'name', 'profile_picture');
                    }
                ])
                ->withCount('comments');

        $artworks = (clone $post)->where('type', 'artwork')->get();
        $statuses = (clone $post)->where('type', 'status')->get();

        $user->is_following = (bool) $user->is_following;

        return Inertia::render('Profile', [
            'user' => $user,
            'artworks' => $artworks,
            'statuses' => $statuses
        ]);
    }


    public function update(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'name' => 'required|string|max:255',
            'username' => [
                'required',
                'string',
                'max:30',
                'regex:/^@[a-zA-Z0-9_.]+$/',
                'unique:users,username,' . $user->id
            ],
            'bio' => 'nullable|string|max:1000',
            'profile_picture' => 'nullable|image|max:5120',
        ]);

        $user->name = $request->name;
        $user->username = $request->username;
        $user->bio = $request->bio;

        if($request->hasFile('profile_picture')) {

            if ($user->profile_picture) {
                Storage::disk('public')->delete($user->profile_picture);
            }

            $file = $request->file('profile_picture');
            $filename = Str::uuid() . '_' . $file->getClientOriginalName();
            $filepath = $file->storeAs('user/profile', $filename, 'public');

            $user->profile_picture = $filepath;
        }

        $user->save();

        return redirect()->back()->with('success', 'Profile Updated Successfully!');

    }

}
