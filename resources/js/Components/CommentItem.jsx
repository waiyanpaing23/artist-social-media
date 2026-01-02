import React, { useState } from 'react';
import { useForm, usePage, Link } from '@inertiajs/react';
import { MdClose, MdCheck } from 'react-icons/md';
import TimeAgo from './TimeAgo'; // Adjust path as needed

const CommentItem = ({ comment }) => {
    const { auth } = usePage().props;
    const [isEditing, setIsEditing] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    const { data, setData, patch, processing, reset, clearErrors } = useForm({
        content: comment.content
    });

    const handleEditSubmit = (e) => {
        e.preventDefault();
        patch(`/comments/${comment.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setIsEditing(false);
                setShowDropdown(false);
            }
        });
    };

    const cancelEdit = () => {
        setIsEditing(false);
        reset(); // Revert text back to original
        clearErrors();
        setShowDropdown(false);
    };

    return (
        <div className="flex gap-3 group">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 overflow-hidden mt-1">
                <img src={`https://ui-avatars.com/api/?name=${comment.user.name}`} alt={comment.user.name} />
            </div>

            <div className="flex-1">
                {isEditing ? (
                    <form onSubmit={handleEditSubmit} className="flex-1">
                        <textarea
                            value={data.content}
                            onChange={(e) => setData('content', e.target.value)}
                            className="w-full p-2 text-sm border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 resize-none bg-white border"
                            rows="2"
                            autoFocus
                        />
                        <div className="flex items-center gap-2 mt-2">
                            <button
                                type="button"
                                onClick={cancelEdit}
                                className="text-xs text-gray-500 hover:text-gray-700 font-bold px-2 py-1"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full font-bold hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1"
                            >
                                Save
                            </button>
                        </div>
                    </form>
                ) : (
                    <>
                        <div className="bg-gray-100 p-3 rounded-2xl shadow-sm relative group border border-gray-100">
                            <div className="flex justify-between items-start">
                                <span className="font-bold text-sm text-gray-900">{comment.user.name}</span>

                                {/* Dropdown Trigger */}
                                {auth.user && auth.user.id === comment.user.id && (
                                    <div className='relative'>
                                        <button onClick={() => setShowDropdown(!showDropdown)} className='text-gray-400 hover:text-gray-600 font-bold px-1'>•••</button>

                                        {showDropdown && (
                                            <>
                                                <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)}></div>
                                                <div className="absolute right-0 top-6 w-32 bg-white rounded-lg shadow-xl py-1 border border-gray-100 z-50 animate-fadeIn overflow-hidden">
                                                    <button
                                                        onClick={() => {
                                                            setIsEditing(true);
                                                            setShowDropdown(false);
                                                        }}
                                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                                                    >
                                                        Edit
                                                    </button>
                                                    <Link
                                                        href={`/comments/${comment.id}`}
                                                        method="delete"
                                                        preserveScroll
                                                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                                    >
                                                        Delete
                                                    </Link>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                            <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap leading-relaxed">{comment.content}</p>
                        </div>
                        <span className="text-xs text-gray-400 ml-1 mt-1 block">
                            <TimeAgo timestamp={comment.created_at} />
                        </span>
                    </>
                )}
            </div>
        </div>
    );
};

export default CommentItem;
