import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { MdHome } from "react-icons/md";
import { FaPlus } from "react-icons/fa6";

export default function Navbar({ onOpenCreate }) {
    const { auth } = usePage().props;

    return (
        <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 relative">

                    {/* 1. LEFT: Logo Only */}
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

                    {/* 3. RIGHT: Profile / Auth */}
                    <div className="flex items-center">
                        {auth.user ? (
                             <div className="flex items-center space-x-4">
                                <span className="text-sm text-gray-500 hidden sm:block">Hello, {auth.user.name}</span>
                                <Link href="/profile" className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 text-blue-600 font-bold hover:bg-blue-200 transition">
                                    {/* ... profile circle ... */}
                                    {auth.user.name.charAt(0).toUpperCase()}
                                </Link>
                            </div>
                        ) : (
                            <div className="space-x-4">
                                {/* ... login links ... */}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </nav>
    );
}

// --- Helper Component for Links ---
// This makes the code cleaner and handles the "active" underline state
// --- Helper Component for Links ---
function NavLink({ active = false, className = '', children, ...props }) {
    return (
        <Link
            {...props}
            className={
                'inline-flex items-center px-1 pt-1 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ' +
                (active
                    ? 'text-blue-600 focus:border-blue-700'
                    : 'text-gray-400 hover:text-gray-700 hover:border-gray-300 focus:text-gray-700 focus:border-gray-300 ') + // Default: Gray text -> Hover: Darker Gray
                className
            }
        >
            {children}
        </Link>
    );
}
