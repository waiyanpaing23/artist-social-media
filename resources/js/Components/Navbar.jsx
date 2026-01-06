import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import NavLink from '@/Components/NavLink';
import { MdHome } from "react-icons/md";
import { FaPlus } from "react-icons/fa6";
import { TbUsers } from "react-icons/tb";

export default function Navbar({ onOpenCreate }) {
    const { auth } = usePage().props;

    const [showDropdown, setShowDropdown] = useState(false);

    return (
        <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 relative">

                    <div className="flex items-center">
                        <Link href="/" className="flex-shrink-0 flex items-center">
                            <span className="text-2xl font-bold text-blue-600 tracking-tighter">
                                Artizen
                            </span>
                        </Link>
                    </div>

                    <div className="flex flex-1 items-center justify-center space-x-8">
                        <NavLink href="/feeds" active={window.location.pathname === '/feeds'}>
                            <MdHome size={28} />
                        </NavLink>

                        <button
                            onClick={onOpenCreate}
                            className="inline-flex items-center px-1 pt-1 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none text-gray-400 hover:text-gray-700 hover:border-gray-300"
                        >
                            <FaPlus size={24} />
                        </button>
                    </div>

                    <div className="flex items-center">
                        {auth.user ? (
                            <div className="relative">

                                <div className="flex items-center space-x-4">
                                    <span className="text-sm text-gray-500 hidden sm:block">Hello, {auth.user.name}</span>

                                    <button
                                        onClick={() => setShowDropdown(!showDropdown)}
                                        className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 text-blue-600 font-bold hover:bg-blue-200 transition focus:outline-none ring-offset-2 focus:ring-2 ring-blue-500"
                                    >
                                        <img
                                            className="w-full h-full object-cover rounded-full"
                                            src={auth?.user.profile_picture ? `/storage/${auth?.user.profile_picture}` : `https://ui-avatars.com/api/?name=${auth?.user.name}&background=random`}
                                            alt={auth?.user.name}
                                        />
                                    </button>
                                </div>

                                {/* dropdown */}
                                {showDropdown && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-40"
                                            onClick={() => setShowDropdown(false)}
                                        ></div>

                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-100 z-50 origin-top-right animate-fadeIn">
                                            <div className="px-4 py-2 border-b border-gray-100 mb-1">
                                                <p className="text-xs text-gray-500">Signed in as</p>
                                                <p className="text-sm font-bold text-gray-900 truncate">{auth.user.email}</p>
                                            </div>

                                            <Link
                                                href={`/profile/${auth?.user.id}`}
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                                                onClick={() => setShowDropdown(false)}
                                            >
                                                Profile
                                            </Link>

                                            <Link
                                                href="/logout"
                                                method="post"
                                                as="button"
                                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                                onClick={() => setShowDropdown(false)}
                                            >
                                                Log Out
                                            </Link>
                                        </div>
                                    </>
                                )}

                            </div>
                        ) : (
                            <div className="space-x-4">
                                <Link href="/login" className="text-sm text-gray-700 hover:text-gray-900">Log in</Link>
                                <Link href="/register" className="text-sm font-bold text-blue-600 hover:text-blue-700">Register</Link>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </nav>
    );
}
