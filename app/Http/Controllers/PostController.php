<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePostRequest;
use App\Http\Requests\UpdatePostRequest;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $user_id = $user->id;

        $followedUsersId = $user->following()->pluck('users.id');
        $allowedUsers = $followedUsersId->push($user_id);

        $posts = Post::with('media', 'author')
                ->whereIn('user_id', $allowedUsers)
                ->orderBy('created_at', 'desc')
                ->withCount('likes')
                ->withExists(['likes as is_liked_by_user' => function ($query) use ($user_id) {
                    $query->where('user_id', $user_id);
                }])
                ->with([
                    'comments.user' => function($query) {
                        $query->select('id', 'name', 'profile_picture');
                    }
                ])
                ->withCount('comments')
                ->get();

        if ($request->wantsJson() && !$request->header('X-Inertia')) {
            return response()->json($posts);
        }

        return Inertia::render('Home', [
            'posts' => $posts,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePostRequest $request)
    {
        DB::beginTransaction();
        try {
            $post = Post::create([
                'user_id' => Auth::id(),
                'type' => $request->type,
                'content' => $request->content,
                'title' => $request->title,
                'medium' => $request->medium,
                'dimensions' => $request->dimensions,
            ]);

            if ($request->hasFile('main_artwork')) {
                foreach($request->file('main_artwork') as $artwork) {
                    $artworkName = Str::uuid() . '_' . $artwork->getClientOriginalName();
                    $artworkPath = $artwork->storeAs('media/artworks', $artworkName, 'public');

                    $post->media()->create([
                        'media_type' => 'image',
                        'file_path' => $artworkPath,
                    ]);
                }
            }

            if ($request->hasFile('media_files')) {
                foreach ($request->file('media_files') as $mediaFile) {
                    $fileName = Str::uuid() . '_' . $mediaFile->getClientOriginalName();
                    $mediaPath = $mediaFile->storeAs('media/others', $fileName, 'public');

                    $post->media()->create([
                        'media_type' => 'image',
                        'file_path' => $mediaPath,
                    ]);
                }
            }
            DB::commit();
            return redirect()->route('feeds')->with('success', 'Post Uploaded');

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Failed to create post.');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePostRequest $request, $id)
    {
        $post = Post::findOrFail($id);
        if ($request->user()->id !== $post->user_id) {
            return redirect()->route('feeds')->with('error', 'Unauthorized action.');
        }

        DB::beginTransaction();
        try {
            $post->update([
                'content' => $request->content,
                'title' => $request->title,
                'medium' => $request->medium,
                'dimensions' => $request->dimensions,
            ]);

            // Handle deletion of existing media
            if ($request->filled('deleted_media_ids')) {
                foreach ($request->deleted_media_ids as $mediaId) {
                    $media = $post->media()->find($mediaId);
                    if ($media) {
                        Storage::disk('public')->delete($media->file_path);
                        $media->delete();
                    }
                }
            }

            // Handle new media uploads
            if ($request->hasFile('main_artwork')) {
                foreach($request->file('main_artwork') as $artwork) {
                    $artworkName = Str::uuid() . '_' . $artwork->getClientOriginalName();
                    $artworkPath = $artwork->storeAs('media/artworks', $artworkName, 'public');

                    $post->media()->create([
                        'media_type' => 'image',
                        'file_path' => $artworkPath,
                    ]);
                }
            }

            if ($request->hasFile('media_files')) {
                foreach ($request->file('media_files') as $mediaFile) {
                    $fileName = Str::uuid() . '_' . $mediaFile->getClientOriginalName();
                    $mediaPath = $mediaFile->storeAs('media/others', $fileName, 'public');

                    $post->media()->create([
                        'media_type' => 'image',
                        'file_path' => $mediaPath,
                    ]);
                }
            }

            DB::commit();
            return redirect()->back()->with('success', 'Post updated successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Failed to update post.');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $post = Post::findOrFail($id);

        if ($post->user_id !== Auth::id()) {
            return redirect()->route('feeds')->with('error', 'Unauthorized action.');
        }

        foreach ($post->media as $media) {
            Storage::disk('public')->delete($media->file_path);
            $media->delete(); // file delete
        }

        $post->delete(); // post delete

        return redirect()->route('feeds')->with('success', 'Post deleted successfully.');
    }
}
