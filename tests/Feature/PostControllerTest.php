<?php

namespace Tests\Feature;

use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Inertia\Testing\AssertableInertia;
use Override;
use Tests\TestCase;

class PostControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    #[Override]
    public function setUp(): void
    {
        parent::setUp();

        $this->user = $this->create_user();
    }


    public function test_global_posts_are_showed_to_new_users()
    {
        $newUser = $this->user;

        $globalPost = Post::factory()->create([
            'user_id' => $this->user->id
        ]);

        $response = $this->actingAs($newUser)->get('feeds');

        $response->assertStatus(200);

        $response->assertInertia(fn (AssertableInertia $page) => $page
                ->component('Home')
                ->where('isGlobalFeed', true)
                ->has('posts.data', 1)
                ->where('posts.data.0.id', $globalPost->id)
        );
    }


    public function test_authenticated_user_deletes_post_successfully(): void
    {
        $post = Post::factory()->create([
            'user_id' => $this->user->id
        ]);

        $response = $this->actingAs($this->user)->delete('post/' . $post->id);

        $response->assertStatus(302);
        $response->assertRedirect('feeds');

        $this->assertDatabaseMissing('posts', $post->toArray());
    }


    public function test_unauthenticated_user_cant_delete_post()
    {
        $post = Post::factory()->create();

        $response = $this->actingAs($this->user)->delete('post/' . $post->id);

        $response->assertStatus(302);
        $response->assertRedirect('feeds');
    }


    private function create_user()
    {
        return User::factory()->create();
    }
}
