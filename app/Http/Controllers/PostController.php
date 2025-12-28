<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePostRequest;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // $posts = Post::orderBy('created_at', 'desc')->get();
        $posts = [
            [
                'id' => 1,
                'title' => 'First Post',
                'content' => 'This is the content of the first post.',
            ],
            [
                'id' => 2,
                'title' => 'Second Post',
                'content' => 'This is the content of the second post.',
            ],
        ];

        return Inertia::render('Home/Home', [
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
            return redirect()->back()->withErrors(['error' => 'Failed to create post.']);
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
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
