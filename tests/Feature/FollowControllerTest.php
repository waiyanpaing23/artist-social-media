<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class FollowControllerTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function authenticated_user_can_follow_another_user(): void
    {
        $currentUser = User::factory()->create();
        $targetUser = User::factory()->create();

        $response = $this->actingAs($currentUser)
            ->post('/user/follow', ['user_id' => $targetUser->id]);

        $response->assertRedirect();

        $this->assertDatabaseHas('follows', [
            'follower_id' => $currentUser->id,
            'followed_id' => $targetUser->id
        ]);
    }

    #[Test]
    public function authenticated_user_can_unfollow_another_user()
    {
        $currentUser = User::factory()->create();
        $targetUser = User::factory()->create();

        $currentUser->following()->syncWithoutDetaching($targetUser->id);

        $this->assertDatabaseHas('follows', [
            'follower_id' => $currentUser->id,
            'followed_id' => $targetUser->id
        ]);

        $response = $this->actingAs($currentUser)->post('user/unfollow', [
            'user_id' => $targetUser->id
        ]);

        $response->assertRedirect();

        $this->assertDatabaseMissing('follows',[
            'follower_id' => $currentUser->id,
            'followed_id' => $targetUser->id
        ]);
    }
}
