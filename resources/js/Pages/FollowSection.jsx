import FollowButton from '@/Components/FollowButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { router } from '@inertiajs/react';
import React, { useState } from 'react';
import { MdPersonAdd, MdCheck, MdClose, MdSearch } from "react-icons/md";

const FollowSection = ({users, filters}) => {

    const handleSearch = (e) => {
        const value = e.target.value;

        router.get(
            route('follow.index'),
            { search: value },
            { preserveState: true, preserveScroll: true, replace: true }
        );
    }

    return (
        <AuthenticatedLayout className="min-h-screen bg-white text-gray-900">
            <div className="max-w-5xl mx-auto px-8 md:px-4 py-8">

                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Discover People</h1>
                    <p className="text-gray-500 mt-1">Connect with artists and creators you might know.</p>

                    {/* Search */}
                    <div className="mt-6 relative max-w-md">
                        <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                        <input
                            type="text"
                            placeholder="Search for friends..."
                            defaultValue={filters?.search}
                            onChange={handleSearch}
                            className="w-full pl-10 pr-4 py-3 bg-gray-100 border-none rounded-xl focus:ring-2 focus:ring-black/5 transition outline-none"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {users.data.map((user) => {

                        return (
                            <div key={user.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition relative group">

                                <div className="flex flex-col items-center text-center">
                                    {/* Avatar */}
                                    <div className="w-20 h-20 rounded-full overflow-hidden mb-4 border-4 border-gray-50">
                                        <img
                                            src={user.profile_picture ? `/storage/${user.profile_picture}` : `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                                            alt={user.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Info */}
                                    <h3 className="font-bold text-lg text-gray-900">{user.name}</h3>
                                    {/* <p className="text-sm text-gray-500 mb-2">{user.username}</p> */}

                                    <p className="text-sm text-gray-600 line-clamp-2 min-h-[40px] mb-4">
                                        {user.bio}
                                    </p>

                                    {/* Follow Button */}
                                    <div className="mt-4 group">
                                        <FollowButton user={user} className="w-full" />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {users.length === 0 && (
                    <div className="text-center py-20 text-gray-400">
                        <p>No more suggestions right now.</p>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
};

export default FollowSection;
