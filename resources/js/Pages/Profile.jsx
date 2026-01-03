import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { usePage } from '@inertiajs/react';
import React, { useState } from 'react'

const Profile = () => {
  const { auth } = usePage().props;
  const [activeTab, setActiveTab] = useState('artworks')

  const user = {
    name: 'Aurelia Moon',
    username: '@aureliamoon',
    bio: 'Digital illustrator • Pencil & Ink • Minimalist art',
    avatar: auth.user.profile_picture || `https://ui-avatars.com/api/?name=${auth.user.name}&background=random`,
    artworks: 12,
    posts: 6,
  }

  const artworks = Array.from({ length: 8 }).map((_, i) => ({
    id: i,
    image: `https://picsum.photos/seed/art${i}/600/600`,
    title: `Project ${i + 1}`,
    likes: Math.floor(Math.random() * 500)
}));

  const posts = [
    {
      id: 1,
      image: 'https://via.placeholder.com/600x400',
      caption: 'New sketch inspired by quiet mornings 🌿',
    },
    {
      id: 2,
      image: 'https://via.placeholder.com/600x500',
      caption: 'Experimenting with ink textures',
    },
  ]

  return (
    <AuthenticatedLayout className="min-h-screen bg-white text-gray-900">
      <div className="max-w-5xl mx-auto px-6 py-10">

        <div className="flex items-center gap-6">
          <img
            src={user.avatar}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border"
          />

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold">{user.name}</h1>
                <p className="text-gray-500">{user.username}</p>
              </div>
              <button className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-100">
                Edit Profile
              </button>
            </div>

            <p className="mt-3 text-sm max-w-lg">{user.bio}</p>

            <div className="flex gap-6 mt-4 text-sm">
              <span><strong>{user.artworks}</strong> artworks</span>
              <span><strong>{user.posts}</strong> posts</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b mt-10">
          <button
            onClick={() => setActiveTab('artworks')}
            className={`pb-3 text-sm font-medium ${
              activeTab === 'artworks'
                ? 'border-b-2 border-black'
                : 'text-gray-500'
            }`}
          >
            Artworks
          </button>

          <button
            onClick={() => setActiveTab('posts')}
            className={`pb-3 text-sm font-medium ${
              activeTab === 'posts'
                ? 'border-b-2 border-black'
                : 'text-gray-500'
            }`}
          >
            Posts
          </button>
        </div>

        {/* Artwork Grid */}
        {activeTab === 'artworks' && (
          <div className="columns-2 md:columns-3 gap-8 mt-8 space-y-8">
            {artworks.map((art, index) => (
              <img
                key={index}
                src={art.image}
                alt="Artwork"
                className="w-full rounded-lg hover:opacity-90 transition"
              />
            ))}
          </div>
        )}

        {/* Posts */}
        {activeTab === 'posts' && (
          <div className="mt-8 space-y-8">
            {posts.map(post => (
              <div key={post.id} className="border rounded-xl overflow-hidden">

                <img src={post.image} alt="Post" className="w-full" />
                <div className="p-4 text-sm">
                  {post.caption}
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </AuthenticatedLayout>
  )
}

export default Profile
