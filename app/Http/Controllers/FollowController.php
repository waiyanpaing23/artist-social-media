<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class FollowController extends Controller
{
    public function index(Request $request)
    {
        /** @var \App\Models\User $currentUser */
        $currentUser = Auth::user();
        $search = $request->input('search');

        $followedUsersId = $currentUser->following()->pluck('users.id');

        $query = User::query()->where('id', '!=', $currentUser->id); // exclude self

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%");
            });
        } else {
            $followedUsersId = $currentUser->following()->pluck('users.id');
            $query->whereNotIn('id', $followedUsersId);
        }

        $users = $query
            ->withExists(['followers as is_following' => function ($q) use ($currentUser) {
                $q->where('follower_id', $currentUser->id);
            }])
            ->latest()
            ->paginate(12)
            ->withQueryString();

        $users->through(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'username' => '@' . strtolower(str_replace(' ', '', $user->name)),
                'profile_picture' => $user->profile_picture,
                'bio' => $user->bio,
                'is_following' => (bool) $user->is_following,
            ];
        });

        return Inertia::render('FollowSection', [
            'users' => $users,
            'filters' => $request->only(['search'])
        ]);
    }


    public function follow(Request $request)
    {
        /** @var \App\Models\User $currentUser */
        $currentUser = Auth::user();

        $followUser = User::findOrFail($request->user_id);

        $currentUser->following()->syncWithoutDetaching($followUser->id);

        return back();
    }

    public function unfollow(Request $request)
    {
        /** @var \App\Models\User $currentUser */
        $currentUser = Auth::user();

        $unfollowUser = User::findOrFail($request->user_id);

        $currentUser->following()->detach($unfollowUser->id);

        return back();
    }
}
