import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import MiniProfile from '@/Components/MiniProfile';
import PostCard from '@/Components/PostCard';

// --- MAIN PAGE COMPONENT ---
const Home = ({ posts }) => {
  const { auth } = usePage().props;

  // Sample Data matching the vibe
  const displayPosts = posts?.length > 0 ? posts : [
    {
        id: 1,
        author: 'Elena Vance',
        handle: 'elena_paint',
        time: '2h ago',
        content: 'Sunset studies from yesterday. Trying to capture that golden hour warmth.',
        likes: 1200,
        image: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=800&auto=format&fit=crop'
    },
    {
        id: 2,
        author: 'Julian Estavez',
        handle: 'j_art',
        time: '5h ago',
        content: 'WIP of the new sculpture series.',
        likes: 850,
        image: 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=800&auto=format&fit=crop'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <div className="max-w-6xl mx-auto flex items-start">

        {/* 1. LEFT COLUMN: Styled Sidebar */}
        <MiniProfile user={auth?.user} />

        {/* 2. RIGHT COLUMN: Feeds */}
        <main className="flex-1 min-w-0 bg-white min-h-screen border-r border-gray-100">
            {/* Optional Header */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-md z-10 border-b border-gray-100 px-6 py-4">
                 <h1 className="text-xl font-bold">Home Feed</h1>
            </div>

            {/* Posts */}
            <div className="pb-20">
                {displayPosts.map(post => (
                    <PostCard key={post.id} post={post} />
                ))}
            </div>
        </main>

      </div>
    </div>
  )
}

export default Home
