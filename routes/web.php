<?php

use App\Http\Controllers\CommentController;
use App\Http\Controllers\FollowController;
use App\Http\Controllers\LikeController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Route::get('/', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });

Route::get('/', function() {
    return redirect()->route('feeds');
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile/{id}', [ProfileController::class, 'index'])->name('profile.index');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');

    Route::get('/feeds', [PostController::class, 'index'])->name('feeds');
    Route::post('/posts', [PostController::class, 'store'])->name('posts.store');
    Route::patch('/posts/{id}', [PostController::class, 'update'])->name('posts.update');
    Route::delete('/post/{id}', [PostController::class, 'destroy'])->name('posts.destroy');

    Route::post('/post/like', [LikeController::class, 'likeUnlike'])->name('post.like');
    Route::post('/comments', [CommentController::class, 'store'])->name('comment.store');
    Route::patch('/comments/{comment}', [CommentController::class, 'update'])->name('comment.update');
    Route::delete('/comments/{id}', [CommentController::class, 'destroy'])->name('comment.destory');

    Route::get('/follows', [FollowController::class, 'index'])->name('follow.index');
    Route::post('/user/follow', [FollowController::class, 'follow'])->name('user.follow');
    Route::post('/user/unfollow', [FollowController::class, 'unfollow'])->name('user.unfollow');

    Route::get('/user/{id}/{type}', [FollowController::class, 'getConnections'])->name('user.connections');
});

require __DIR__.'/auth.php';
