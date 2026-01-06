import React, { useState } from 'react'
import { FaTrash, FaExclamationTriangle } from "react-icons/fa";
import { FaHandsClapping, FaRegComment } from 'react-icons/fa6';
import { IoColorPalette } from "react-icons/io5";
import { PiHandsClapping } from "react-icons/pi";
import TimeAgo from './TimeAgo';
import ImageCarousel from './ImageCarousel';
import { Link, router, usePage } from '@inertiajs/react';
import CommentSection from './CommentSection';

const PostCard = ({ user, post, onEdit }) => {

    const { auth } = usePage().props;
    const images = post.media || [];
    const isArtwork = post.type === 'artwork';
    const [showDropdown, setShowDropdown] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const [showComments, setShowComments] = useState(false);

    const handleDeletePost = () => {
        router.delete(`/post/delete/${post.id}`, {
            onSuccess: () => {
                setShowDeleteConfirm(false);
            },
            preserveScroll: true,
        });
    };

    const handleLike = () => {
        router.post('/post/like', {post_id: post.id}, {
            preserveScroll: true
        });
    }

    const closeComment = () => {
        setShowComments(false);
    }

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6 my-5">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <Link href={`/profile/${post.author.id}`} onClick={(e) => e.stopPropagation()} className="shrink-0">
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-100">
                            <img
                                className="w-full h-full object-cover"
                                src={post.author?.profile_picture ? `/storage/${post.author?.profile_picture}` : `https://ui-avatars.com/api/?name=${post.author.name}&background=random`}
                                alt={post.author}
                            />
                        </div>
                    </Link>
                    <div className="flex flex-col">
                        <Link
                            href={`/profile/${post.author.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="font-bold text-sm text-gray-900 hover:text-blue-600 hover:underline transition w-fit"
                        >
                            {post.author.name}
                        </Link>
                        <div className='flex item-center'>
                            <TimeAgo timestamp={post.created_at} />
                        </div>
                    </div>
                </div>

                <div className='flex items-center'>
                    {isArtwork && (
                    <span className="flex items-center gap-1 px-2 py-0.5 me-3 rounded-full bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-wide">
                        <IoColorPalette size={12} />
                        <span>Artwork</span>
                    </span>
                    )}
                    <div className="flex items-center">
                        {user && post.author.id === auth?.user.id && (
                            <div className="relative">

                                <div className="flex items-center space-x-4">
                                    <button onClick={() => setShowDropdown(!showDropdown)} className="text-gray-400 hover:text-gray-600">•••</button>
                                </div>

                                {/* dropdown */}
                                {showDropdown && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-40"
                                            onClick={() => setShowDropdown(false)}
                                        ></div>

                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-100 z-50 origin-top-right animate-fadeIn">

                                            <button
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                                                onClick={() => {
                                                    setShowDropdown(false);
                                                    onEdit(post);
                                                }}
                                            >
                                                Edit Post
                                            </button>

                                            <button onClick={() => {
                                                setShowDropdown(false);
                                                setShowDeleteConfirm(true);
                                            }}
                                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                            >Delete Post</button>
                                        </div>
                                    </>
                                )}

                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Image */}
            {isArtwork ? (
                <div>
                    <div className="p-4 bg-white rounded-lg rounded">
                        <ImageCarousel media={images} dimensions={post.dimensions} />
                    </div>

                    <div>
                        {post.medium && <p className='mt-1 font-semibold text-gray-400'>{post.medium}</p>}
                        <h2 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h2>
                        {post.content && <p className="text-gray-700">{post.content}</p>}
                    </div>
                </div>
            ) : (

                <div>
                    <div className="text-gray-800 text-base leading-relaxed whitespace-pre-line">
                        {post.content}
                    </div>
                    {images.length > 0 &&
                        (<div className="p-4 bg-white rounded-lg rounded">
                            <ImageCarousel media={images} dimensions={post.dimensions} />
                        </div>)}
                </div>
            )}

            {/* Minimal Actions */}
            <div className="flex items-cente mt-5 gap-6">
                <button
                    onClick={handleLike}
                    className="group flex items-center gap-2">
                    <span className="text-xl group-hover:scale-110 transition">
                        {post.is_liked_by_user ? (
                            <FaHandsClapping size={26} />
                        ) : (
                            <PiHandsClapping size={26} />
                        )}
                    </span>
                </button>
                <button onClick={() => setShowComments(!showComments)} className="group flex items-center gap-2">
                    <span className="text-xl group-hover:scale-110 transition">
                        <FaRegComment size={24} />
                    </span>
                </button>
            </div>
            <div className="mt-3 text-sm font-semibold text-gray-600">
                <span>{post.likes_count} Appreciations</span>
                <span onClick={() => setShowComments(!showComments)} className='ms-8 cursor-pointer'>{post.comments_count} Comments</span>
            </div>

            {showComments &&
                <CommentSection onClose={closeComment} user={user} postId={post.id} comments={post.comments || []} />
            }

            {showDeleteConfirm && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full overflow-hidden transform transition-all scale-100">

                        <div className="p-6 text-center">

                            <div className="flex items-center justify-center mb-4">
                                <FaExclamationTriangle className="h-6 w-6 text-rose-600" />
                            </div>

                            <p className='text-gray-700'>
                                Are you sure you want to remove this post?
                            </p>
                        </div>

                        {/* Buttons */}
                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-2">
                            <button
                                type="button"
                                onClick={handleDeletePost}
                                className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-rose-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                            >
                                Yes, Delete
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowDeleteConfirm(false)}
                                className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostCard
