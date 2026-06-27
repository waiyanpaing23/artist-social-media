<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\UserSearchService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class FollowController extends Controller
{
    protected UserSearchService $searchService;

    public function __construct(UserSearchService $searchService)
    {
        $this->searchService = $searchService;
    }


    public function index(Request $request)
    {
        /** @var \App\Models\User $currentUser */
        $currentUser = Auth::user();
        $search = $request->input('search');

        $users = $this->searchService->searchUsers($currentUser, $search);

        $transformedUsers = $users->through(
            fn($user) => $this->searchService->transformUser($user)
        );

        return Inertia::render('FollowSection', [
            'users' => $transformedUsers,
            'filters' => $request->only(['search'])
        ]);
    }


    public function follow(Request $request)
    {
        /** @var \App\Models\User $currentUser */
        $currentUser = Auth::user();

        $followUser = User::findOrFail($request->user_id);

        $currentUser->following()->syncWithoutDetaching($followUser->id);

        return redirect()->back();
    }

    public function unfollow(Request $request)
    {
        /** @var \App\Models\User $currentUser */
        $currentUser = Auth::user();

        $unfollowUser = User::findOrFail($request->user_id);

        $currentUser->following()->detach($unfollowUser->id);

        return redirect()->back();
    }

    public function getConnections($id, $type)
    {
        $user = User::find($id);

        $followers = $user->$type()
                ->withExists(['followers as is_following' => function ($q) {
                    $q->where('follower_id', Auth::id());
                }])
                ->latest()
                ->get();

        return response()->json($followers);
    }
}
