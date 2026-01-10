import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { MdPersonAdd, MdCheck } from "react-icons/md";

const FollowButton = ({ user, className = "" }) => {
    const [isFollowing, setIsFollowing] = useState(user.is_following);

    const { post, processing } = useForm({
        user_id: user.id
    });

    const handleFollow = (e) => {
        e.stopPropagation();

        const newState = !isFollowing;
        setIsFollowing(newState);

        const routeName = isFollowing ? 'user.unfollow' : 'user.follow';

        post(route(routeName), {
            preserveScroll: true,
            only: ['flash'],
            onError: () => {
                setIsFollowing(!newState);
            }
        });
    };

    return (
        <button
            onClick={handleFollow}
            disabled={processing}
            className={`
                px-4 py-2 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200
                ${isFollowing
                    ? 'bg-gray-100 text-gray-800 hover:bg-red-50 hover:text-red-600 hover:border-red-100 border border-transparent'
                    : 'bg-black text-white hover:bg-gray-800 shadow-md hover:shadow-lg'
                }
                ${className}
            `}
        >
            {processing ? (
                <span className="opacity-50">Processing...</span>
            ) : (
                <>
                    {isFollowing ? (
                        <>
                            {/* Show "Following" normally, "Unfollow" on hover */}
                            <span className="group-hover:hidden flex items-center gap-2"><MdCheck /> Following</span>
                            <span className="hidden group-hover:inline">Unfollow</span>
                        </>
                    ) : (
                        <>
                            <MdPersonAdd className="text-lg" /> Follow
                        </>
                    )}
                </>
            )}
        </button>
    );
}

export default FollowButton;
