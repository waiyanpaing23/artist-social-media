import React, { useEffect, useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import PostCard from '@/Components/PostCard';
import MiniProfile from '@/Components/MiniProfile';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PostModal from '@/Components/PostModal';
import axios from 'axios';

const Home = ({ posts: initialPosts }) => {
    const { auth } = usePage().props;

    const [localPosts, setLocalPosts] = useState(initialPosts.data);
    const [nextPageUrl, setNextPageUrl] = useState(initialPosts.next_page_url);
    const [loading, setLoading] = useState(false);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [postToEdit, setPostToEdit] = useState(null);

    const handlePostDelete = (postId) => {
        setLocalPosts(prev => prev.filter(p => p.id !== postId));
        router.reload({ only: ['auth'] }); // to update post count in mini profile
    };

    const handlePostCreate = (newPost) => {
        setLocalPosts(prev => [newPost, ...prev]);
        router.reload({ only: ['auth'] }); // to update post count in mini profile
    };

    useEffect(() => {
        setLocalPosts(initialPosts.data);
        setNextPageUrl(initialPosts.next_page_url);
    }, [initialPosts]);

    const openEditModal = (post) => {
        setPostToEdit(post);
        setShowCreateModal(true);
    }

    const closeModal = () => {
        setShowCreateModal(false);
        setPostToEdit(null);
    }

    const loadMore = () => {
        if (!nextPageUrl || loading) return;
        setLoading(true);

        axios.get(nextPageUrl)
            .then(response => {
                setLocalPosts(prev => [...prev, ...response.data.data]);
                setNextPageUrl(response.data.next_page_url);
                setLoading(false);
            });
    };

    return (
        <AuthenticatedLayout className="min-h-screen bg-white text-gray-900 font-sans">

            <div className="max-w-5xl mx-auto flex items-start">
                <MiniProfile user={auth?.user} />

                <main className="flex-1 min-w-0 mx-5">

                    <div className="pb-20">
                        {localPosts.map(post => (
                            <PostCard key={post.id} post={post} user={auth?.user} onEdit={openEditModal} onRemove={handlePostDelete} />
                        ))}

                        <div className="p-8 text-center">
                            {nextPageUrl ? (
                                <button onClick={loadMore} disabled={loading} className="px-6 py-2 bg-gray-100 rounded-full">
                                    {loading ? "Loading..." : "Load More"}
                                </button>
                            ) : (
                                <span className="text-gray-400 text-sm">You've reached the end! 🎨</span>
                            )}
                        </div>
                    </div>

                    <PostModal
                        show={showCreateModal}
                        onClose={closeModal}
                        postToEdit={postToEdit}
                        onSuccess={handlePostCreate}
                    />
                </main>

            </div>
        </AuthenticatedLayout>
    )
}

export default Home
