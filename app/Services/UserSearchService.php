<?php

namespace App\Services;

use App\Models\User;

class UserSearchService
{
    public function searchUsers(User $currentUser, ?string $search, int $perPage = 12)
    {
        $followedUsersId = $currentUser->following()->pluck('users.id');

        $query = User::query()->where('id', '!=', $currentUser->id);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('username', 'like', "%{$search}%");
            });
        } else {
            $query->whereNotIn('id', $followedUsersId);
        }

        return $query
            ->withExists(['followers as is_following' => function ($q) use ($currentUser) {
                $q->where('follower_id', $currentUser->id);
            }])
            ->withCount(['artworks', 'statuses'])
            ->latest()
            ->paginate($perPage);
    }

    public function transformUser(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'username' => '@' . strtolower(str_replace(' ', '', $user->name)),
            'profile_picture' => $user->profile_picture,
            'bio' => $user->bio,
            'is_following' => (bool) $user->is_following,
            'artworks_count' => $user->artworks_count,
            'statuses_count' => $user->statuses_count
        ];
    }
}
