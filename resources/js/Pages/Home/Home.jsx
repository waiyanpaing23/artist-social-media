import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import PostCard from '@/Components/PostCard';
import MiniProfile from '@/Components/MiniProfile';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const Home = ({ posts }) => {
  const { auth } = usePage().props;

  const displayPosts = posts?.length > 0 ? posts : [
    {
        id: 1,
        author: 'Taylor Otwell',
        handle: 'taylorotwell',
        time: '2h',
        content: 'Laravel + Inertia + React is a game changer for full-stack developers. 🚀',
        likes: 1200,
        retweets: 340,
        comments: 45,
        image: null
    },
    {
        id: 2,
        author: 'React Team',
        handle: 'reactjs',
        time: '4h',
        content: 'Check out the new features in React 19! Server components are becoming easier to adopt.',
        likes: 5400,
        retweets: 900,
        comments: 120,
        image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop'
    },
    {
        id: 3,
        author: 'Web Dev',
        handle: 'webdev_daily',
        time: '5h',
        content: 'Just finished building a social media clone. Tailwind CSS makes styling so fast!',
        likes: 85,
        retweets: 12,
        comments: 5,
        image: null
    }
  ];

  return (
    <AuthenticatedLayout className="min-h-screen bg-white text-gray-900 font-sans">

      <div className="max-w-5xl mx-auto flex items-start">
        <MiniProfile user={auth?.user} />

        <main className="flex-1 min-w-0 mx-5">

            <div className="pb-20">
                {displayPosts.map(post => (
                    <PostCard key={post.id} post={post} />
                ))}

                <div className="p-8 text-center text-gray-500">
                    You've reached the end! 🎨
                </div>
            </div>
        </main>

      </div>
    </AuthenticatedLayout>
  )
}

export default Home
