import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import PostCard from '@/Components/PostCard';
import MiniProfile from '@/Components/MiniProfile';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PostModal from '@/Components/PostModal';

const Home = ({ posts }) => {
  const { auth } = usePage().props;
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [postToEdit, setPostToEdit] = useState(null);

  const openEditModal = (post) => {
    setPostToEdit(post);
    setShowCreateModal(true);
  }

  const closeModal = () => {
    setShowCreateModal(false);
    setPostToEdit(null);
  }

  return (
    <AuthenticatedLayout className="min-h-screen bg-white text-gray-900 font-sans">

      <div className="max-w-5xl mx-auto flex items-start">
        <MiniProfile user={auth?.user} />

        <main className="flex-1 min-w-0 mx-5">

            <div className="pb-20">
                {posts.map(post => (
                    <PostCard key={post.id} post={post} user={auth?.user} onEdit={openEditModal} />
                ))}

                <div className="p-8 text-center text-gray-500">
                    You've reached the end! 🎨
                </div>
            </div>

            <PostModal
                show={showCreateModal}
                onClose={closeModal}
                postToEdit={postToEdit}
            />
        </main>

      </div>
    </AuthenticatedLayout>
  )
}

export default Home
