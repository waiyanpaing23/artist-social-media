import EditProfileModal from '@/Components/EditProfileModal';
import FollowButton from '@/Components/FollowButton';
import PostCard from '@/Components/PostCard';
import PostModal from '@/Components/PostModal';
import UserListModal from '@/Components/UserListModal';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { usePage } from '@inertiajs/react';
import React, { useState } from 'react'
import { MdClose } from 'react-icons/md';

const Profile = ({ user, artworks, statuses }) => {
    const { auth } = usePage().props;
    const [activeTab, setActiveTab] = useState('artworks')

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [postToEdit, setPostToEdit] = useState(null);

    const [showEditProfile, setShowEditProfile] = useState(false);

    const [selectedArtworkId, setSelectedArtworkId] = useState(null);
    const selectedArtwork = artworks?.find(art => art.id === selectedArtworkId);

    const [followerModalState, setFollowerModalState] = useState({
        show: false,
        type: 'followers',
        title: ''
    });

    const openFollowerModal = (type) => {
        setFollowerModalState({
            show: true,
            type: type,
            title: type === 'followers' ? 'Followers' : 'Following'
        });
    };

    const closeFollowerModal = () => {
        setFollowerModalState(prev => ({ ...prev, show: false }));
    };

    const openEditModal = (post) => {
        setPostToEdit(post);
        setShowCreateModal(true);
        setSelectedArtworkId(null);
    }

    const closeModal = () => {
        setShowCreateModal(false);
        setPostToEdit(null);
    }

    const isMyProfile = auth.user && auth.user.id === user.id;

    return (
        <AuthenticatedLayout className="min-h-screen bg-white text-gray-900">
            <div className="max-w-5xl mx-auto px-6 py-10">

                {/* --- HEADER SECTION --- */}
                <div className="flex items-center gap-6">
                    <img
                        src={user?.profile_picture ? `/storage/${user.profile_picture}` : `https://ui-avatars.com/api/?name=${user?.name}&background=random`}
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover border"
                    />

                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-semibold">{user?.name || 'Guest User'}</h1>
                                <p className="text-gray-500">@{user?.name?.toLowerCase().replace(/\s/g, '') || 'guest'}</p>
                            </div>
                            {isMyProfile ? (
                                <button
                                    onClick={() => setShowEditProfile(true)}
                                    className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-100 transition"
                                >
                                    Edit Profile
                                </button>
                            ) :
                            (<FollowButton user={user} className="px-6" />)
                            }
                        </div>

                        <p className="mt-3 text-sm max-w-lg">{user.bio}</p>

                        <div className="mt-3 flex gap-4">
                            <button onClick={() => openFollowerModal('followers')} className="hover:underline">
                                <strong>{user.followers_count}</strong> followers
                            </button>
                            <button onClick={() => openFollowerModal('following')} className="hover:underline">
                                <strong>{user.following_count}</strong> following
                            </button>
                        </div>

                        <UserListModal
                            show={followerModalState.show}
                            onClose={closeFollowerModal}
                            userId={user.id}
                            type={followerModalState.type}
                            title={followerModalState.title}
                        />
                    </div>
                </div>

                {/* --- TABS --- */}
                <div className="flex gap-6 border-b mt-10">
                    <button
                        onClick={() => setActiveTab('artworks')}
                        className={`pb-3 text-sm font-medium ${activeTab === 'artworks' ? 'border-b-2 border-black' : 'text-gray-500'}`}
                    >
                        {user?.artworks_count} Artworks
                    </button>

                    <button
                        onClick={() => setActiveTab('posts')}
                        className={`pb-3 text-sm font-medium ${activeTab === 'posts' ? 'border-b-2 border-black' : 'text-gray-500'}`}
                    >
                        {user?.statuses_count} Posts
                    </button>
                </div>

                {/* --- ARTWORK GRID --- */}
                {activeTab === 'artworks' && (
                    <div className="grid grid-cols-3 gap-8 mt-8 space-y-8">
                        {artworks?.map((art, index) => (
                            <div
                                key={index}
                                onClick={() => setSelectedArtworkId(art.id)}
                                className="relative aspect-square bg-gray-100 overflow-hidden group cursor-pointer"
                            >
                                {art.media && art.media[0] ? (
                                    <img
                                        src={`/storage/${art.media[0].file_path}`}
                                        alt="Artwork"
                                        className="w-full h-full object-cover rounded-lg hover:opacity-90 transition"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">No Image</div>
                                )}

                                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                    <span className="text-white text-sm font-bold bg-black/50 px-3 py-1 rounded-full">View</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* --- POSTS FEED --- */}
                {activeTab === 'posts' && (
                    <div className="mt-8 space-y-8">
                        {statuses.map(post => (
                            <PostCard key={post.id} user={user} post={post} onEdit={openEditModal} />
                        ))}
                    </div>
                )}


                <PostModal
                    show={showCreateModal}
                    onClose={closeModal}
                    postToEdit={postToEdit}
                />

                {selectedArtwork && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
                        onClick={() => setSelectedArtworkId(null)}
                    >
                        <div className="relative w-full max-w-lg" onClick={e => e.stopPropagation()}>

                            <button
                                onClick={() => setSelectedArtworkId(null)}
                                className="absolute -top-10 right-0 p-1 text-white hover:text-gray-300 transition"
                            >
                                <MdClose size={32} />
                            </button>

                            <div className="bg-white rounded-xl overflow-hidden shadow-2xl">
                                <PostCard
                                    user={auth?.user}
                                    post={selectedArtwork}
                                    onEdit={openEditModal}
                                />
                            </div>
                        </div>
                    </div>
                )}

                <EditProfileModal
                    show={showEditProfile}
                    onClose={() => setShowEditProfile(false)}
                    user={user}
                />

            </div>
        </AuthenticatedLayout>
    )
}

export default Profile
