import { Link } from '@inertiajs/react';
import React from 'react'

const MiniProfile = ({ user }) => {

  return (
    <aside className="hidden md:flex flex-col w-80 h-[calc(100vh-5rem)] sticky top-20 border-r border-gray-200 p-6 font-sans overflow-y-auto">
        {/* 1. Header / Switch Profile Section */}
        <div className="flex items-center justify-center mb-8">
            <Link href="/" className="gap-3">
                <div className="w-20 h-20 mx-auto rounded-full bg-gray-300 overflow-hidden mb-3">
                    <img
                        src={user?.profile_picture ? `/storage/${user?.profile_picture}` : `https://ui-avatars.com/api/?name=${user?.name}&background=random`}
                        alt="User"
                        className="w-full h-full object-cover"
                    />
                </div>
                <h3 className="font-bold text-lg text-gray-900">{user?.name || 'Guest User'}</h3>
                <p className="text-gray-500 text-sm">@{user?.name?.toLowerCase().replace(/\s/g, '') || 'guest'}</p>
            </Link>
        </div>

        <div className="border border-gray-200 rounded-2xl p-4 mb-8">
            <h4 className="text-xs font-bold text-gray-400 mb-4 tracking-wider uppercase">Your Studio</h4>

            <div className="flex items-center text-center w-full">

                <div className="flex-1">
                    <span className="block font-bold text-gray-900 text-sm">{user?.artworks_count}</span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Artworks</span>
                </div>

                <div className="w-[1px] h-8 bg-gray-100"></div>

                <div className="flex-1">
                    <span className="block font-bold text-gray-900 text-sm">{user?.statuses_count}</span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Posts</span>
                </div>

            </div>
        </div>

        {/* 5. Footer Links */}
        <div className="mt-auto pt-6 text-[11px] text-gray-300 space-x-2">
            <a href="#" className="hover:underline">About</a> •
            <a href="#" className="hover:underline">Help</a> •
            <a href="#" className="hover:underline">Privacy</a> •
            <a href="#" className="hover:underline">Terms</a>
            <div className="mt-2">© 2025 ARTIZEN INC.</div>
        </div>
    </aside>
  );
};

export default MiniProfile
